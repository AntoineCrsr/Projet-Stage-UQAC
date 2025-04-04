const Reservation = require("./ReservationModel")

/**
 * 
 * @param {object} constraints 
 * @returns {Promise}
 */
exports.getReservations = async (constraints={}) => {
    return await Reservation.find(constraints)
}