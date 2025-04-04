const Reservation = require("./ReservationModel")

exports.getReservations = async (constraints={}) => {
    return await Reservation.find(constraints)
}