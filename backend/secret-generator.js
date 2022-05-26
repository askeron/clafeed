const crypto = require('node:crypto')
const util = require('./util.js')

module.exports = (serverSecret) => {
    if (!util.isLowerCaseHexStringWithLength(serverSecret, 64)) {
        throw "serverSecret must be 64 lowercase hexchars"
    }

    return {
        generateRoomSecret(roomId) {
            const hmac = crypto.createHmac('sha256', serverSecret)
            hmac.update("room")
            hmac.update(roomId)
            return hmac.digest("hex")
        },
        generateRoomDeviceSecret(roomId, roomDeviceId) {
            const hmac = crypto.createHmac('sha256', serverSecret)
            hmac.update("roomDevice")
            hmac.update(roomId)
            hmac.update(roomDeviceId)
            return hmac.digest("hex")
        },
    }
}
