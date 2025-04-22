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
    const num = [48, 57]
    if (id == undefined || typeof(id) !== "string" || id.length !== 24) {
        return false
    }

    for (let i = 0; i<id.length; i++) {
        let asciiCode = id.charCodeAt(i)
        if (
            !((asciiCode >= maj[0] && asciiCode <= maj[1]) // is Maj
            || (asciiCode >= min[0] && asciiCode <= min[1]) // is Min
            || (asciiCode >= num[0] && asciiCode <= num[1])) // is Num
        )
            return false
    }

    return true
}