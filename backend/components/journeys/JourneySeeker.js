const Journey = require("./journeyModel")

/**
 * @param {Number} limit 
 * @returns {Promise}
 */
exports.getLastJourneys = async (limit, constraints={}) => {
    if (constraints.starting) constraints["starting.city"] = constraints.starting.toLowerCase()
    if (constraints.arrival) constraints["arrival.city"] = constraints.arrival.toLowerCase()
    delete constraints.starting
    delete constraints.arrival
    return await Journey.find(constraints).sort({ date: -1 }).limit(limit)
}

/**
 * @param {string} journeyId
 * @returns {Promise}
 */
exports.getOneJourney = async (journeyId) => {
    return await Journey.findOne({_id: journeyId})
}