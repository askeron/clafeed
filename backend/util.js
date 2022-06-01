const crypto = require('node:crypto')
const { isArray } = require('node:util')

function isLowerCaseHexStringWithLength(text, length) {
    return typeof text === "string" && text.length == length && text.match(/^[0-9a-f]+$/)
}

function checkArray(value) {
    if (!(Array.isArray(value))) {
        throw new Error("not an array")
    }
    return value
}

function checkIdFormat(id) {
    if (!isLowerCaseHexStringWithLength(id, 64)) {
        throw new Error("invalid id format")
    }
    return id
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
    checkIdFormat,
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
    assertTrue(conditionResult, message) {
        if (conditionResult) {
            throw new Error(message)
        }
        return value
    },
    checkStringWithMaxLength(text, maxLength) {
        if (!(typeof text === "string" && text.length <= maxLength)) {
            throw new Error("invalid string length")
        }
        return text
    },
    checkBoolean(value) {
        if (!(typeof value === "boolean")) {
            throw new Error("not a boolean")
        }
        return value
    },
    checkArray,
    checkIdArray(value) {
        checkArray(value)
        value.forEach(x => {
            checkIdFormat(x)
        });
        return value
    },
    checkObjectArray(value) {
        checkArray(value)
        value.forEach(x => {
            if (!(typeof x === "object")) {
                throw new Error("not a object")
            }
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
