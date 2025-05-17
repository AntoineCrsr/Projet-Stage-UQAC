const Reservation = require("./ReservationModel")

/**
 * 
 * @param {object} constraints 
 * @returns {Promise}
 */
exports.getReservations = async (constraints={}) => {
    return await Reservation.find(constraints)
}


/**
 * 
 * @param {String} id 
 * @returns {Promise}
 */
exports.getOneReservation = async (id) => {
    return await Reservation.findOne({"_id": id})
}