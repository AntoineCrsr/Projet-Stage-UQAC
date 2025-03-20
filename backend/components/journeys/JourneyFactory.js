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
exports.createJourney = (userId, starting, arrival, date, seats, price) => {
    return new Journey({
        ownerId: userId,
        starting: starting,
        arrival: arrival,
        date: date,
        seats: seats,
        price: price,
        passengers: [],
        state: "w" // w = waiting, d = done
    })
}