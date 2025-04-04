const Service_Response = require("../workspace/service_response")
const ReservationErrorManager = require("./ReservationError/ReservationErrorManager")
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

    // Validité des données
    const creationError = await ReservationErrorManager.verifyCreation(reqRes, userAuthId) 
    if (creationError.hasError) return new Service_Response(undefined, 400, true, creationError.error)

    // Création
    const reservation = ReservationFactory.createReservation(userAuthId, reqRes.journeyId)
    const journeyAddResponse = await JourneyService.addReservation(reqRes.journeyId)
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