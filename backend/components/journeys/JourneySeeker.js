const Journey = require("./journeyModel")

/**
 * @param {Number} limit 
 * @returns {Promise}
 */
exports.getLastJourneys = async (limit, constraints={}) => {
    let refinedConstraints = {}
    if (constraints.starting) refinedConstraints["starting.city"] = constraints.starting.toLowerCase()
    if (constraints.arrival) refinedConstraints["arrival.city"] = constraints.arrival.toLowerCase()
    if (constraints.date) refinedConstraints["date"] = constraints.date
    console.log(refinedConstraints)
    return await Journey.find(refinedConstraints).sort({ date: -1 }).limit(limit)
}

/**
 * @param {number} journeyId
 * @returns {Promise}
 */
exports.getOneJourney = async (journeyId) => {
    return await Journey.findOne({_id: journeyId})
}