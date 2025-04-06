const UserService = require("../../users/userService")
const generalErrors = require("./GenerealErrors.json")
const ErrorReport = require("../ErrorReport")

exports.isUserVerified = async (userId) => {
    const servResp = await UserService.getRegistrationCompleted(userId)
    if (servResp.has_error) return new ErrorReport(true, servResp.error_object)
    return new ErrorReport(false)
}