const Service_Response = require("../workspace/service_response")
const ReservationErrorManager = require("./ReservationError/ReservationErrorManager")
const ReservationFactory = require("./ReservationFactory")


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
    const creationError = ReservationErrorManager.verifyCreation(reqRes) 
    if (creationError.hasError) return new Service_Response(undefined, 400, true, creationError.error)

    // Création
    const reservation = ReservationFactory.createReservation(userAuthId, reqRes.journeyId)
    return await reservation.save()
        .then(() => (new Service_Response(undefined, 201).setLocation("/reservation/" + reservation.id)))
        .catch(error => new Service_Response(undefined, 500, true, error))
}