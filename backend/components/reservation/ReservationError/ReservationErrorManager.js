const ErrorReport = require("../../workspace/ErrorReport")
const errorTable = require("./ReservationErrors.json")
const JourneyService = require("../../journeys/journeyService")
const ReservationSeeker = require("../ReservationSeeker")

async function hasAlreadyReserved(journeyId, userId) {
    let hasAlreadyRes = false
    (await ReservationSeeker.getReservations({"journeyId": reqRes.journeyId})).forEach(res => {
        if (res.userId === reqRes.userId) {
            hasAlreadyRes = true
            return
        }
    });
    return hasAlreadyRes
}

exports.verifyAuth = (userAuthId) => {
    if (userAuthId == null) return new ErrorReport(true, errorTable["notLogin"])
    return new ErrorReport(false)
}

exports.verifyCreation = async (reqRes) => {
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

    // Possibilité d'ajouter une réservation sur la journey
    const canAddRes = await JourneyService.canAddAReservation(reqRes.journeyId)
    if (canAddRes.has_error) return new ErrorReport(true, canAddRes.error_object)
    if (!canAddRes.result) return new ErrorReport(true, errorTable["notEnoughPlace"])
    
    // Vérifier si l'utilisateur n'a pas déjà réservé la journey
    if (await this.hasAlreadyReserved(reqRes.journeyId, reqRes.userId))
        return new ErrorReport(true, errorTable["alreadyRes"])
    
    return new ErrorReport(false)
}