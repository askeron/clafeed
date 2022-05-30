const util = require('./util.js')
const { also } = util

const express = require('express')
const { checkIdFormat, clearArray, checkObjectArray } = require('./util.js')
const cron = require('node-cron');
const expressApp = express()
const expressServer = require('http').createServer(expressApp)
const webSocketServer = new (require('ws')).Server({ server: expressServer })
const historyMiddleware = require('connect-history-api-fallback')
const cors = require('cors')
expressApp.use("/api/", cors())
expressApp.use(historyMiddleware({
  rewrites: [
    {
        from: /^\/api\/.*$/,
        to: function(context) {
          return context.parsedUrl.pathname;
        }
      },
      {
        from: /^\/statistics$/,
        to: function(context) {
          return context.parsedUrl.pathname;
        }
      },
  ]
})) // redirects to index.html
expressApp.use(express.static('frontend-dist'))
expressApp.use(express.json());


const serverEnv = {
    inviteCodeLifetimeMillis: 10*60*1000,
    pendingInviteLifetimeMillis: 10*60*1000,
    serverSecret: "6ce4732694d2eb3b139d87a9fc342d7910b2e163313088417b6effda54e9dd2e",
    maxOpenedRooms: 250, // if exceed no Room can be opened at the moment, man kann wohl nur 65k, aber realistisch nur 20k Websockets pro IP betreiben (bei 40 Geräten pro Raum, wären das maximal 500 Raum und wegen Puffer halt die hälfte)
    millisAfterLastTeacherKeepAliveToAutoColeTheRoom: 60*60*1000,
    devMode: true,
}

const { generateRoomSecret, generateRoomDeviceSecret } = require("./secret-generator.js")(serverEnv.serverSecret)
serverEnv.serverSecret = null

/*
overwriteServerSecretEnvVariableAndNodeArguements() // if possible
*/

const data = {
    rooms: [
        {
            id: "814ed27c4f2937a69d400d04c107b488ebb91b0fc0f48360011498af1a770000", // crypto random, first 4 chars reserved for later use e.g. server number
            secret: generateRoomSecret("814ed27c4f2937a69d400d04c107b488ebb91b0fc0f48360011498af1a770000"),
            publicKey: "8672814ed27c4f2937a69d400d04c107b488ebb91b0fc0f48360011498af1a77", // format noch ungekannt, aber bestimmt Bytes auf Lehrer client erstellt und zum verschlüsseln der EventFiles gedacht
            name: "Klasse 7a Physik bei Herrn Kuhlen",
            currentlyOpen: true,
            lastKeepAliveFromTeacher: 1647559031960,
            allowedRoomDevices: [
                {
                    roomDeviceId: "9564915d5ae79cd2c0f27e9c18f395357556bb4333d819a446e93170ffb83997",
                    roomDeviceSecret: "9564915d5ae79cd2c0f27e9c18f395357556bb4333d819a446e93170ffb83997",
                },
                {
                    roomDeviceId: "be8573a1b0890628dfbffaa0dc07c17f7863ce8ff54462659785b853bde9eb18",
                    roomDeviceSecret: "be8573a1b0890628dfbffaa0dc07c17f7863ce8ff54462659785b853bde9eb18",
                },
                {
                    roomDeviceId: "107e768f183deb80080fe43df504bef6333516bd5ee7cf7af0e4be201f284586",
                    roomDeviceSecret: "107e768f183deb80080fe43df504bef6333516bd5ee7cf7af0e4be201f284586",
                },
            ],
        },
    ],
    inviteCodes: [
        {
            code: "82352924",
            roomId: "814ed27c4f2937a69d400d04c107b488ebb91b0fc0f48360011498af1a770000",
            maxLifetimeDate: Date.now() + serverEnv.inviteCodeLifetimeMillis,
        },
    ],
    pendingInvites: [
        {
            roomId: "814ed27c4f2937a69d400d04c107b488ebb91b0fc0f48360011498af1a770000",
            roomDeviceId: "d28df0e8d2cbd14cbba6730a57f71f0eec7dee9066fdae686a6a5ae7b196bf7b",
            roomDeviceSecret: "841d21ec38da65e924359a80301de92c188bad0373330bd15a0925058c0b02ef",
            suggestedPupilName: "Sven",
            maxLifetimeDate: Date.now() + serverEnv.pendingInviteLifetimeMillis,
        },
    ]
}


if (!serverEnv.devMode) {
    clearArray(data.rooms)
    clearArray(data.inviteCodes)
}

// socket.io wird genutzt sobald man den Raum betritt

expressApp.get('/statistics', function(req, res, next) {
    if (req.query?.event == "taskerSharedText") {
    } else {
    }
    res.send('OK')
})

expressApp.get('/api/v1/devMode/data', function(req, res, next) {
    onlyInDevMode()
    res.json(data)
})

expressApp.post('/api/v1/teacher/createNewRoom', function(req, res, next) {
    const name = util.checkStringWithMaxLength(req.body.name, 200)
    const room = createNewRoom(name)
    res.json({
        id: room.id,
        secret: room.secret,
    })
})

expressApp.post('/api/v1/teacher/deleteRoom', function(req, res, next) {
    const room = findRoomAndCheckSecretOrNull(req.body.id, req.body.secret)
    if (room) {
        data.inviteCodes = data.inviteCodes.filter(x => x.roomId !== room.id)
        data.rooms = data.rooms.filter(x => x.Id !== room.id)
    }
    res.json({})
})

expressApp.post('/api/v1/teacher/keepalive', function(req, res, next) {
    const room = findRoomAndCheckSecret(req.body.roomId, req.body.roomSecret)
    room.lastKeepAliveFromTeacher = Date.now()
    res.json({})
})

expressApp.post('/api/v1/teacher/updateRoom', function(req, res, next) {
    let room = findRoomAndCheckSecretOrNull(req.body.id, req.body.secret)
    if (!room) {
        room = {
            id: req.body.id,
            secret: req.body.secret,
            currentlyOpen: false,
            lastKeepAliveFromTeacher: Date.now(),
            allowedRoomDevices: [],
        }
        data.rooms.push(room)
    }
    const newRoomName = util.checkStringWithMaxLength(req.body.name, 200)
    const newCurrentlyOpen = req.body.currentlyOpen !== undefined ? util.checkBoolean(req.body.currentlyOpen) : room.currentlyOpen
    const newAllowedRoomDevices = req.body.allowedRoomDeviceIds !== undefined ? util.checkIdArray(req.body.allowedRoomDeviceIds).map(roomDeviceId => {
        return {
            roomDeviceId,
            roomDeviceSecret: generateRoomDeviceSecret(room.id, roomDeviceId),
        }
    }) : room.allowedRoomDevices
    room.name = newRoomName
    room.currentlyOpen = newCurrentlyOpen
    room.allowedRoomDevices = newAllowedRoomDevices
    room.lastKeepAliveFromTeacher = Date.now()
    res.json({})
})

expressApp.post('/api/v1/teacher/createInviteCode', function(req, res, next) {
    const room = findRoomAndCheckSecret(req.body.roomId, req.body.roomSecret)
    data.inviteCodes = data.inviteCodes.filter(x => x.roomId !== room.id)
    let newCode
    do {
        newCode = ""+util.getRandomIntegerInRange(10_000_000, 99_999_999)
    } while (data.inviteCodes.filter(x => x.code === newCode).length != 0) // regerate code until unused is found
    const inviteCode = {
        code: newCode,
        roomId: room.id,
        maxLifetimeDate: Date.now() + serverEnv.inviteCodeLifetimeMillis,
    }
    data.inviteCodes.push(inviteCode)
    res.json({
        code: inviteCode.code,
        lifetimeMillis: serverEnv.inviteCodeLifetimeMillis,
    })
})

expressApp.post('/api/v1/pupil/useInviteCode', function(req, res, next) {
    const inviteCode = findInviteCode(req.body.inviteCode)

    if (inviteCode) {
        const { id: roomId, name: roomName } = findRoom(inviteCode.roomId)

        const roomDeviceIdSuffix = "0" // last char reserved for later use
        const roomDeviceId = util.getCryptoRandomHexChars(64 - roomDeviceIdSuffix.length) + roomDeviceIdSuffix
        const roomDeviceSecret = generateRoomDeviceSecret(roomId, roomDeviceId)

        data.pendingInvites.push({
            roomId,
            roomDeviceId,
            roomDeviceSecret,
            suggestedPupilName: util.checkStringWithMaxLength(req.body.suggestedPupilName, 200),
            maxLifetimeDate: Date.now() + serverEnv.pendingInviteLifetimeMillis,
        })

        // HACK START
        setTimeout(() => {
            const room = findRoom(roomId)
            room.allowedRoomDevices.push({
                roomDeviceId,
                roomDeviceSecret,
            })
        }, 4000)
        // HACK START

        res.json({
            found: true,
            roomId,
            roomName,
            roomDeviceId,
            roomDeviceSecret,
            lifetimeMillis: serverEnv.pendingInviteLifetimeMillis,
        })
    } else {
        res.json({
            found: false,
        })
    }
})

expressApp.post('/api/v1/pupil/getStatusOfPendingInvites', function(req, res, next) {
    removeOldPendingInvites()
    const pendingInvites = checkObjectArray(req.body.pendingInvites)

    res.json(pendingInvites.map(pendingInvite => {
        const { roomId, roomDeviceId, roomDeviceSecret } = pendingInvite
        checkRoomDeviceSecret(roomId, roomDeviceId, roomDeviceSecret)
        const room = findRoomOrNull(roomId)
        let status = null
        if (room == null) {
            status = "room not present"
        } else if (room.allowedRoomDevices.map(x => x.roomDeviceId).includes(roomDeviceId)) {
            status = "accepted"
        } else if (data.pendingInvites.map(x => x.roomDeviceId).includes(roomDeviceId)) {
            status = "pending"
        } else {
            status = "not found"
        }
        return {
            roomId,
            roomDeviceId,
            status,
        }
    }))
})

function createNewRoom(name) {
    const roomIdSuffix = "0" // last char reserved for later use e.g. server number
    const id = util.getCryptoRandomHexChars(64 - roomIdSuffix.length) + roomIdSuffix
    const room = {
        id,
        secret: generateRoomSecret(id),
        // secret errechnet aus sha(hmac(id+serversecret+"secret"))
        publicKey: null, // format noch ungekannt, aber bestimmt Bytes auf Lehrer client erstellt und zum verschlüsseln der EventFiles gedacht
        name,
        currentlyOpen: false,
        lastKeepAliveFromTeacher: Date.now(),
        allowedRoomDeviceId: [
        ],
        allowedDevices: [
        ]
    }
    data.rooms.push(room)
    return room
}

function findRoomOrNull(id) {
    checkIdFormat(id)
    return data.rooms.find(x => x.id === id)
}

function findRoom(id) {
    return checkNotNullish(findRoomOrNull(id), "room not found")
}

function findRoomAndCheckSecretOrNull(id, secret) {
    checkRoomSecret(id, secret)
    return findRoomOrNull(id)
}

function findRoomAndCheckSecret(id, secret) {
    return checkNotNullish(findRoomAndCheckSecretOrNull(id, secret), "room not found")
}

function checkRoomSecret(id, secret) {
    checkIdFormat(id)
    checkIdFormat(secret)
    if (generateRoomSecret(id) !== secret) {
        throw "wrong roomSecret"
    }
}

function checkRoomDeviceSecret(roomId, roomDeviceId, roomDeviceSecret) {
    checkIdFormat(roomId)
    checkIdFormat(roomDeviceId)
    checkIdFormat(roomDeviceSecret)
    if (generateRoomDeviceSecret(roomId, roomDeviceId) !== roomDeviceSecret) {
        throw "wrong roomDeviceSecret"
    }
}

function onlyInDevMode() {
    if (!serverEnv.devMode) {
        throw "devmode is active"
    }
}

function checkNotNullish(value, errorMsg) {
    if (!value) {
        throw errorMsg
    }
    return value
}

/*
cron.schedule('0 * * * * *', () => {
    // remove old invitecodes
    data.inviteCodes = data.inviteCodes.filter(x => x.maxLifetimeDate > Date.now())
})
*/

cron.schedule('0 0 23 * * *', () => {
    // remove all data in the night
    data.rooms = []
    data.inviteCodes = []
    // TODO: delete files
})

function removeOldInviteCodes() {
    data.inviteCodes = data.inviteCodes.filter(x => x.maxLifetimeDate > Date.now())
}

function removeOldPendingInvites() {
    data.pendingInvites = data.pendingInvites.filter(x => x.maxLifetimeDate > Date.now())
}

function findInviteCode(code) {
    util.checkStringWithMaxLength(code, 8)
    removeOldInviteCodes()
    return data.inviteCodes.find(x => x.code === code)
}

expressServer.listen(8080)
console.log("clafeed started")
