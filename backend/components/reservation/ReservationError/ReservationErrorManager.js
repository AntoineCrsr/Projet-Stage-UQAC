const ErrorReport = require("../../workspace/ErrorReport")
const errorTable = require("./ReservationErrors.json")
const UserService = require("../../users/userService")

exports.verifyAuth = (userAuthId) => {
    if (userAuthId == null) return new ErrorReport(true, errorTable["notLogin"])
    return new ErrorReport(false)
}

exports.verifyCreation = (reqRes) => {
    // Valeurs nulles
    if (reqRes == null
        || reqRes.journeyId == null
        || reqRes.userId == null
    ) return new ErrorReport(true, errorTable["nullValues"])

    // Format des id (type et longueur)
    if (
        typeof(reqRes.journeyId) !== "string" 
        || typeof(reqRes.userId) !== "string"
        || reqRes.length !== 24
        || reqRes.length !== 24
    ) 
        return new ErrorReport(true, errorTable["typeError"])
}