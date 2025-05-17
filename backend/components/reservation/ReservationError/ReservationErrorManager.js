const ErrorReport = require("../../workspace/ErrorReport")
const errorTable = require("./ReservationErrors.json")
const JourneyService = require("../../journeys/journeyService")
const ReservationSeeker = require("../ReservationSeeker")
const GeneralErrorManager = require("../../workspace/GeneralError/GeneralErrorManager")

async function hasAlreadyReserved(journeyId, userId) {
    let hasAlreadyRes = false
    await ReservationSeeker.getReservations({"journeyId": journeyId})
        .then(reservations => {
            reservations.forEach(res => {
                if (res.userId.toString() === userId) {
                    hasAlreadyRes = true
                    return
                }
            })
        });
    return hasAlreadyRes
}

async function getHasAReservationError(reservationId, userId) {
    const reservations = await ReservationSeeker.getReservations({"_id": reservationId})
    if (reservations.length === 0) return new ErrorReport(true, errorTable["internalError"])
    if (reservations[0].userId.toString() === userId) return new ErrorReport(false)
    return new ErrorReport(true, errorTable["cantDelete"])
}

exports.verifyAuth = (userAuthId) => {
    if (userAuthId == null) return new ErrorReport(true, errorTable["notLogin"])
    return new ErrorReport(false)
}

exports.verifyCreation = async (reqRes, userAuthId) => {
    // Valeurs nulles
    if (reqRes == null
        || reqRes.journeyId == null
    ) return new ErrorReport(true, errorTable["nullValues"])

    // Format des id (type et longueur)
    if (
        typeof(reqRes.journeyId) !== "string" 
        || typeof(userAuthId) !== "string" 
        || reqRes.journeyId.length !== 24
        || userAuthId.length !== 24
    ) 
        return new ErrorReport(true, errorTable["typeError"])

    // Possibilité d'ajouter une réservation sur la journey (ceci vérifie aussi que l'utilisateur n'est pas le créateur du trajet)
    const canAddRes = await JourneyService.canAddAReservation(reqRes.journeyId, userAuthId)
    if (canAddRes.has_error) return new ErrorReport(true, canAddRes.error_object)
    if (!canAddRes.result) return new ErrorReport(true, errorTable["notEnoughPlace"])
    
    // Vérifier si l'utilisateur n'a pas déjà réservé la journey
    if (await hasAlreadyReserved(reqRes.journeyId, userAuthId))
        return new ErrorReport(true, errorTable["alreadyRes"])

    // Vérifier si l'utilisateur n'est pas le créateur de la journey
    return new ErrorReport(false)
}


exports.getReservationGetError = (constraints) => {
    if (constraints.userId !== undefined) {
        const isUserValid = GeneralErrorManager.isValidId(constraints.userId, "reservation")
        if (isUserValid.hasError) return isUserValid
    }
    if (constraints.journeyId !== undefined) {
        const isJourneyValid = GeneralErrorManager.isValidId(constraints.journeyId, "reservation")
        if (isJourneyValid.hasError) return isJourneyValid
    }
    return new ErrorReport(false)
}


exports.getNotFound = (reservation) => {
    if (reservation == null) return new ErrorReport(true, errorTable["resNotFound"])
    return new ErrorReport(false)
}


exports.getReservationExistError = async (reservationId) => {
    const reservations = await ReservationSeeker.getReservations({"_id": reservationId})
    if (reservations.length === 0) return new ErrorReport(true, errorTable["resNotFound"])
    return new ErrorReport(false)
}


exports.getIdError = (id) => {
    if (id == null || typeof(id) !== "string" || id.length !== 24) return new ErrorReport(true, errorTable["idError"])
    return new ErrorReport(false)
}


exports.getDeleteError = async (reservationId, userAuthId) => {
    if (userAuthId == null) return new ErrorReport(true, errorTable["notLogin"])
    return await getHasAReservationError(reservationId, userAuthId)
}