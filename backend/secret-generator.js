const crypto = require('node:crypto')
const util = require('./util.js')

module.exports = (serverSecret) => {
    if (!util.isLowerCaseHexStringWithLength(serverSecret, 64)) {
        throw "serverSecret must be 64 lowercase hexchars"
    }

    const generateSecret = (secretType, id) => {
        const hmac = crypto.createHmac('sha256', serverSecret)
        hmac.update(secretType)
        hmac.update(id)
        return hmac.digest("hex")
    }

    return {
        generateRoomSecret(roomId) {
            return generateSecret("room", roomId)
        },
        generateRoomDeviceSecret(roomDeviceId) {
            return generateSecret("roomDevice", roomDeviceId)
        },
    }
}
