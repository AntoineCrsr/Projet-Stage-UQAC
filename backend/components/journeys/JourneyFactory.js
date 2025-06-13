const Journey = require("./journeyModel")
/**
 * @param {string} userId 
 * @param {string} starting 
 * @param {string} arrival 
 * @param {string} date 
 * @param {number} seats 
 * @param {number} price 
 * @returns {Journey}
 */
exports.createJourney = (userId, starting, arrival, date, seats, price, carId) => {
    starting.city = starting.city.toLowerCase()
    arrival.city = arrival.city.toLowerCase()
    return new Journey({
        ownerId: userId,
        starting: starting,
        arrival: arrival,
        date: date,
        seats: seats,
        price: price,
        carId: carId,
        state: "w" // w = waiting, d = done
    })
}

/**
 * @param {number} journeyId 
 * @param {object} newJourney 
 * @returns {Promise}
 */
exports.updateJourney = (journeyId, newJourney) => {
    delete newJourney._id
    delete newJourney.ownerId
    delete newJourney.state
    newJourney.starting.city = newJourney.starting.city.toLowerCase()
    newJourney.arrival.city = newJourney.arrival.city.toLowerCase()
    return Journey.updateOne({ _id: journeyId }, { ...newJourney, _id: journeyId })
}


/**
 * @param {string} journeyId 
 * @returns {Promise}
 */
exports.deleteJourney = (journeyId) => {
    return Journey.deleteOne({_id: journeyId})
    // Peut-être prévenir les passagers que la journey a été supp / annulée
    // Sinon considérer que tu ne peux pas la supp, seulement la passer dans l'état annuler ?
} 

exports.addReservation = (journey, nbReservation) => {
    journey.seats.left -= nbReservation
}