const Service_Response = require("../workspace/service_response")
const ReservationErrorManager = require("./ReservationError/ReservationErrorManager")
const GeneralErrorManager = require("../workspace/GeneralError/GeneralErrorManager.js")
const ReservationFactory = require("./ReservationFactory")
const ReservationSeeker = require("./ReservationSeeker")
const ReservationFilter = require("./ReservationFilter")
const JourneyService = require("../journeys/journeyService")

/**
 * 
 * @param {object} reqRes 
 * @param {string} userAuthId 
 * @returns {Promise}
 */
exports.createReservation = async (reqRes, userAuthId) => {
    // Authentification
    const authError = ReservationErrorManager.verifyAuth(userAuthId)
    if (authError.hasError) return new Service_Response(undefined, 401, true, authError.error)

    // Utilisateur avec inscription complète
    const userRegistrationCompleteError = await GeneralErrorManager.isUserVerified(userAuthId)
    if (userRegistrationCompleteError.hasError) return new Service_Response(undefined, 401, true, userRegistrationCompleteError.error)

    // Validité des données
    const creationError = await ReservationErrorManager.verifyCreation(reqRes, userAuthId) 
    if (creationError.hasError) return new Service_Response(undefined, 400, true, creationError.error)
    
    // Création
    const reservation = ReservationFactory.createReservation(userAuthId, reqRes.journeyId)
    const journeyAddResponse = await JourneyService.editReservation(reqRes.journeyId, 1)
    if (journeyAddResponse.has_error) return journeyAddResponse

    return await reservation.save()
        .then(() => (new Service_Response(undefined, 201).setLocation("/reservation/" + reservation.id)))
        .catch(error => new Service_Response(undefined, 500, true, error))
}


/**
 * 
 * @param {object} constraints 
 * @returns {Promise}
 */
exports.getReservations = async (constraints) => {
    const verifConstraints = ReservationErrorManager.getReservationGetError(constraints)
    if (verifConstraints.hasError) return new Service_Response(undefined, 400, true, verifConstraints.error)

    return await ReservationSeeker.getReservations(constraints)
        .then(reservations => {
            ReservationFilter.filterMultipleReservations(reservations)
            return new Service_Response(reservations)
        })
        .catch(error => new Service_Response(undefined, 500, true, error))
}


exports.deleteReservation = async (reservationId, userAuthId) => {
    // Format de l'id
    const idError = ReservationErrorManager.getIdError(reservationId)
    if (idError.hasError) return idError.error
    // Existance de la réservation
    const reservationExists = await ReservationErrorManager.getReservationExistError(reservationId)
    if (reservationExists.hasError) return new Service_Response(undefined, 404, true, reservationExists.error)
    // Permission du user
    const permissionError = await ReservationErrorManager.getDeleteError(reservationId, userAuthId)
    if (permissionError.hasError) return new Service_Response(undefined, 401, true, permissionError.error)
    
    // Anti-suppression si le trajet a été fait
    const journeyId = (await ReservationSeeker.getReservations({"_id": reservationId}))[0].journeyId.toString()
    const isDone = await JourneyService.isDoneJourney(journeyId)
    if (isDone.has_error) return isDone

    const journeyAddResponse = await JourneyService.editReservation(journeyId, -1)
    if (journeyAddResponse.has_error) return journeyAddResponse
    // Action
    return await ReservationFactory.deleteReservation(reservationId)
        .then(() => new Service_Response(undefined))
        .catch(error => new Service_Response(undefined, 500, true, error))
}


/**
 * A n'utiliser que dans un contexte interne et sécurisé
 * @param {string} journeyId 
 * @returns {Promise}
 */
exports.deleteJourneyReservation = async (journeyId) => {
    const internalError = ReservationErrorManager.getIdError(journeyId)
    if (internalError.hasError) return new Service_Response(undefined, 400, true, internalError.error)

    return await ReservationFactory.deleteJourneyReservations(journeyId)
        .then(() => new Service_Response(undefined))
        .catch(error => new Service_Response(undefined, 500, true, error))
} 