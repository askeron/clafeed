const crypto = require('node:crypto')

function isLowerCaseHexStringWithLength(text, length) {
    return typeof text === "string" && text.length == length && text.match(/^[0-9a-f]+$/)
}

module.exports = {
    isLowerCaseHexStringWithLength,
    getRandomHexChars(charCount) {
        return [...Array(charCount)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')
    },
    getCryptoRandomHexChars(charCount) {
        let result = crypto.randomBytes(Math.ceil(charCount/2)).toString("hex")
        if (charCount % 2 == 1) {
            result = result.slice(0, -1) // remove last character
        }
        return result
    },
    checkIdFormat(id) {
        if (!isLowerCaseHexStringWithLength(id, 64)) {
            throw "invalid id format"
        }
        return id
    },
    also(value, lambda) {
        lambda(value)
        return value
    },
    alsoNonNull(value, lambda) {
        if (value) {
            lambda(value)
        }
        return value
    },
    checkStringWithMaxLength(text, maxLength) {
        if (!(typeof text === "string" && text.length <= maxLength)) {
            throw "invalid string length"
        }
        return text
    },
    checkBoolean(value) {
        if (!(typeof value === "boolean")) {
            throw "not a boolean"
        }
        return value
    },
    checkIdArray(value) {
        if (!(typeof value === "array")) {
            throw "not an array"
        }
        value.forEach(x => {
            if (!(typeof x === "string")) {
                throw "array contains non-strings"
            }
            checkIdFormat(x)
        });
        return value
    },
    getRandomIntegerInRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    clearArray(array) {
        while (array.length > 0) {
            array.pop()
        }
    }
}
