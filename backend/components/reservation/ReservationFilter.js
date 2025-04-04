exports.filterReservation = (reservation) => {
    reservation.__v = undefined
    return reservation
}

exports.filterMultipleReservations = (reservations) => {
    reservations.forEach(res => this.filterReservation(res))
    return reservations
}