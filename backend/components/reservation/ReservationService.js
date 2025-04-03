const Service_Response = require("../workspace/service_response")
const ReservationErrorManager = require("./ReservationError/ReservationErrorManager")

exports.createReservation = (reqRes, userAuthId) => {
    // TODO: Verify auth, impélementer avec la vérification de UserService
    const authError = ReservationErrorManager.verifyAuth(userAuthId)
    if (authError.hasError) return new Service_Response(undefined, 401, true, authError.error)
}