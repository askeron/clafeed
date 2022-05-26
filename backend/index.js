const util = require('./util.js')
const { also } = util

const express = require('express')
const { checkIdFormat, clearArray } = require('./util.js')
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
    joinRequestLifetimeMillis: 10*60*1000,
    serverSecret: "6ce4732694d2eb3b139d87a9fc342d7910b2e163313088417b6effda54e9dd2e",
    maxOpenedRooms: 250, // if exceed no Room can be opened at the moment, man kann wohl nur 65k, aber realistisch nur 20k Websockets pro IP betreiben (bei 40 Geräten pro Raum, wären das maximal 500 Raum und wegen Puffer halt die hälfte)
    millisAfterLastRoomOwnerKeepAliveToAutoColeTheRoom: 60*60*1000,
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
            lastKeepAliveFromRoomOwner: 1647559031960,
            attendeeId: [
                "9564915d5ae79cd2c0f27e9c18f395357556bb4333d819a446e93170ffb83997",
                "be8573a1b0890628dfbffaa0dc07c17f7863ce8ff54462659785b853bde9eb18",
                "107e768f183deb80080fe43df504bef6333516bd5ee7cf7af0e4be201f284586",
            ],
            allowedDevices: [
                {
                    roomDeviceId: "5317944480cb7e9b65acb95e7d45a4fc9415e7fe5e3a21586621a4de964a5884", // crypto random
                    attendeeId: "9564915d5ae79cd2c0f27e9c18f395357556bb4333d819a446e93170ffb83997", // immer nur ein RoomDeviceId pro Name zugelassen (fachliche Anforderung)
                    // identify code (zum mündlichen bestätigen) sind die ersten 4 Stellen von roomDeviceId
                },
                {
                    roomDeviceId: "6cb3c0b5cb95952cb79b462b5fe5a4a5ae7e615ae68172540361f6aaeda68076",
                    attendeeId: "be8573a1b0890628dfbffaa0dc07c17f7863ce8ff54462659785b853bde9eb18",
                },
            ],
            joinRequests: [
                {
                    roomDeviceId: "d28df0e8d2cbd14cbba6730a57f71f0eec7dee9066fdae686a6a5ae7b196bf7b",
                    suggestedName: "Sven",
                },
            ]
        },
    ],
    inviteCodes: [
        {
            code: "82352924",
            roomId: "814ed27c4f2937a69d400d04c107b488ebb91b0fc0f48360011498af1a770000",
            maxLifetimeDate: Date.now() + serverEnv.inviteCodeLifetimeMillis,
        },
    ],
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

expressApp.post('/api/v1/owner/createNewRoom', function(req, res, next) {
    const name = util.checkStringWithMaxLength(req.body.name, 200)
    const room = createNewRoom(name)
    res.json({
        id: room.id,
        secret: room.secret,
    })
})

expressApp.post('/api/v1/owner/deleteRoom', function(req, res, next) {
    const room = findRoomAndCheckSecretOrNull(req.body.id, req.body.secret)
    if (room) {
        data.inviteCodes = data.inviteCodes.filter(x => x.roomId !== room.id)
        data.rooms = data.rooms.filter(x => x.Id !== room.id)
    }
    res.json({})
})

expressApp.post('/api/v1/owner/keepalive', function(req, res, next) {
    const room = findRoomAndCheckSecret(req.body.roomId, req.body.roomSecret)
    room.lastKeepAliveFromRoomOwner = Date.now()
    res.json({})
})

expressApp.post('/api/v1/owner/updateRoom', function(req, res, next) {
    let room = findRoomAndCheckSecretOrNull(req.body.id, req.body.secret)
    if (!room) {
        room = {
            id: req.body.id,
            secret: req.body.secret,
            currentlyOpen: false,
        }
        data.rooms.push(room)
    }
    room.name = util.checkStringWithMaxLength(req.body.name, 200)
    util.alsoNonNull(req.body.currentlyOpen, x => room.currentlyOpen = util.checkBoolean(x))
    room.lastKeepAliveFromRoomOwner = Date.now()
    res.json({})
})

expressApp.post('/api/v1/owner/createInviteCode', function(req, res, next) {
    const room = findRoomAndCheckSecret(req.body.roomId, req.body.roomSecret)
    data.inviteCodes = data.inviteCodes.filter(x => x.roomId !== room.id)
    let newCode
    do {
        newCode = ""+util.getRandomIntegerInRange(10_000_000, 99_999_999)
        console.log(newCode)
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

expressApp.post('/api/v1/attendee/useInviteCode', function(req, res, next) {
    const inviteCode = findInviteCode(req.body.code)

    if (inviteCode) {
        const roomDeviceIdSuffix = "0" // last char reserved for later use
        const roomDeviceId = util.getCryptoRandomHexChars(64 - roomDeviceIdSuffix.length) + roomDeviceIdSuffix

        const joinRequest = {
            roomDeviceId,
            suggestedName: util.checkStringWithMaxLength(req.body.suggestedName, 200),
            maxLifetimeDate: Date.now() + serverEnv.joinRequestLifetimeMillis,
        }
        
        const room = findRoom(inviteCode.roomid)
        room.joinRequests.push(joinRequest)

        res.json({
            roomDeviceId: joinRequest.roomDeviceId,
            roomDeviceSecret: generateRoomDeviceSecret(joinRequest.roomDeviceId),
        })
    } else {
        res.status(404).send('could not find invite code')
    }

    util.alsoNonNull(req.body.name, x => room.name = util.checkStringWithMaxLength(x, 200))
    util.alsoNonNull(req.body.currentlyOpen, x => room.currentlyOpen = util.checkBoolean(x))
})

//socket
expressApp.post('/api/v1/owner/addAttendee', function(req, res, next) {
    const inviteCode = findInviteCode(req.body.code)

    if (inviteCode) {
        const roomDeviceIdSuffix = "0" // last char reserved for later use
        const roomDeviceId = util.getCryptoRandomHexChars(64 - roomDeviceIdSuffix.length) + roomDeviceIdSuffix

        const joinRequest = {
            roomDeviceId,
            suggestedName: util.checkStringWithMaxLength(req.body.suggestedName, 200),
            maxLifetimeDate: Date.now() + serverEnv.joinRequestLifetimeMillis,
        }
        
        const room = findRoom(inviteCode.roomid)
        room.joinRequests.push(joinRequest)

        res.json({
            roomDeviceId: joinRequest.roomDeviceId,
            roomDeviceSecret: generateRoomDeviceSecret(joinRequest.roomDeviceId),
        })
    } else {
        res.status(404).send('could not find invite code')
    }

    util.alsoNonNull(req.body.name, x => room.name = util.checkStringWithMaxLength(x, 200))
    util.alsoNonNull(req.body.currentlyOpen, x => room.currentlyOpen = util.checkBoolean(x))
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
        lastKeepAliveFromRoomOwner: Date.now(),
        attendeeId: [
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

function findInviteCode(code) {
    removeOldInviteCodes()
    return data.inviteCodes.find(x => x.code === code)
}

expressServer.listen(8080)
console.log("clafeed started")
