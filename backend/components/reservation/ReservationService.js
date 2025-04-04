const Service_Response = require("../workspace/service_response")
const ReservationErrorManager = require("./ReservationError/ReservationErrorManager")

exports.createReservation = (reqRes, userAuthId) => {
    const authError = ReservationErrorManager.verifyAuth(userAuthId)
    if (authError.hasError) return new Service_Response(undefined, 401, true, authError.error)

    const creationError = ReservationErrorManager.verifyCreation(reqRes) 
    if (creationError.hasError) return new Service_Response(undefined, 400, true, creationError.error)

    // Faire la factory
}