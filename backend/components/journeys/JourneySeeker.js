const Journey = require("./journeyModel")

/**
 * @param {Number} limit 
 * @returns {Promise}
 */
exports.getLastJourneys = (limit) => {
    return Journey.find().sort({ date: -1 }).limit(limit)
}

/**
 * @param {number} journeyId
 * @returns {Promise}
 */
exports.getOneJourney = (journeyId) => {
    return Journey.findOne({_id: journeyId})
}