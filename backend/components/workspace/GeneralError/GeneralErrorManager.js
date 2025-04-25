const UserService = require("../../users/userService")
const generalErrors = require("./GeneralErrors.json")
const ErrorReport = require("../ErrorReport")


/**
 * Remplace la partie "any" d'un error du tableau par le type renseigné (par exemple "user")
 * @param {Object} error 
 * @param {string} type 
 * @returns {Object}
 */
function formatError(error, type) {
    const newError = {
        "errors": {}
    }
    newError["errors"][type] = error["errors"]["any"]
    return newError
}


/**
 * 
 * @param {string} userId 
 * @returns {ErrorReport}
 */
exports.isUserVerified = async (userId) => {
    const servResp = await UserService.getRegistrationCompleted(userId)
    if (servResp.has_error) return new ErrorReport(true, servResp.error_object)
    return new ErrorReport(false)
}

/**
 * 
 * @param {string} userAuthId 
 * @returns {ErrorReport}
 */
exports.getAuthError = (userAuthId) => {
    if (userAuthId == null || userAuthId.length !== 24) 
        return new ErrorReport(true, generalErrors["authError"])
    return new ErrorReport(false)
}

/**
 * Nécessite d'avoir déjà vérifié la validité des ID
 * @param {string} userAuthId 
 * @param {string} ownerId 
 * @returns {ErrorReport}
 */
exports.isUserOwnerOfObject = (userAuthId, ownerId) => {
    if (userAuthId !== ownerId) return new ErrorReport(true, generalErrors["notOwnerError"])
    return new ErrorReport(false)
}


/**
 * 
 * @param {string} id 
 * @returns {Boolean}
 */
exports.isValidId = (id, type) => {
    const maj = [65, 90]
    const min = [97, 122]
    const num = [48, 57]
    let isValid = true
    if (id == undefined || typeof(id) !== "string" || id.length !== 24) {
        isValid = false
    }

    for (let i = 0; i<id.length; i++) {
        let asciiCode = id.charCodeAt(i)
        if (
            !((asciiCode >= maj[0] && asciiCode <= maj[1]) // is Maj
            || (asciiCode >= min[0] && asciiCode <= min[1]) // is Min
            || (asciiCode >= num[0] && asciiCode <= num[1])) // is Num
        )
            isValid = false
    }

    return isValid ? new ErrorReport(false) : new ErrorReport(true, formatError(generalErrors["invalidIdError"], type))
}