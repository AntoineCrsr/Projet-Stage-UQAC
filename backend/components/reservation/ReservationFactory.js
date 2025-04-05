const Reservation = require("./ReservationModel")

/**
 * 
 * @param {string} userId 
 * @param {string} journeyId 
 * @returns {Reservation}
 */
exports.createReservation = (userId, journeyId) => {
    return new Reservation({
        userId: userId,
        journeyId: journeyId
    })
}


exports.deleteReservation = (reservationId) => {
    return Reservation.deleteOne({_id: reservationId})
}