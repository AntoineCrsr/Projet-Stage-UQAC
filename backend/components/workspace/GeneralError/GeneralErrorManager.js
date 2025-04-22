const UserService = require("../../users/userService")
const generalErrors = require("./GenerealErrors.json")
const ErrorReport = require("../ErrorReport")

exports.isUserVerified = async (userId) => {
    const servResp = await UserService.getRegistrationCompleted(userId)
    if (servResp.has_error) return new ErrorReport(true, servResp.error_object)
    return new ErrorReport(false)
}

exports.getAuthError = (userAuthId) => {
    if (userAuthId == null || userAuthId.length !== 24) 
        return new ErrorReport(true, generalErrors["authError"])
    return new ErrorReport(false)
}

exports.isValidId = (id) => {
    const maj = [65, 90]
    const min = [97, 122]
    if (id == undefined || typeof(id) !== "string" || id.length !== 24) {
        return false
    }

    for (let i = 0; i<id.length; i++) {
        let asciiCode = id.charCodeAt(i)
        if (asciiCode >= min[1] || asciiCode <= maj[0] || (asciiCode > maj[1] && asciiCode < min[0]))
            return false
    }

    return true
}