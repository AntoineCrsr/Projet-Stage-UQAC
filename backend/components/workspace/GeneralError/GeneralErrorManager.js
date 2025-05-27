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
    const isValid = typeof id === "string" && 
           id.length === 24 && 
           /^[A-Za-z0-9]+$/.test(id);

    return isValid ? new ErrorReport(false) : new ErrorReport(true, formatError(generalErrors["invalidIdError"], type))
}