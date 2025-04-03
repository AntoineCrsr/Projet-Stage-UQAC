const ErrorReport = require("../../workspace/ErrorReport")
const errorTalbe = require("./ReservationErrors.json")

exports.verifyAuth = (userAuthId) => {
    if (userAuthId == null) return new ErrorReport(true, errorTalbe["notLogin"])
    return new ErrorReport(false)
}

exports.verifyCreation = (reqRes) => {

}