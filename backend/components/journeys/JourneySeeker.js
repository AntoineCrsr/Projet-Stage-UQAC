const Journey = require("./journeyModel")

/**
 * @param {Number} limit 
 * @returns {Promise}
 */
exports.getLastJourneys = async (limit) => {
    return await Journey.find().sort({ date: -1 }).limit(limit)
}

/**
 * @param {number} journeyId
 * @returns {Promise}
 */
exports.getOneJourney = async (journeyId) => {
    return await Journey.findOne({_id: journeyId})
}