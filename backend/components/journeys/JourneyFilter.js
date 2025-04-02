// Cette classe filtre les données avant envoi, telles que __v qui n'est pas utile. 

/**
 * 
 * @param {object} journey 
 * @returns {Journey}
 */
exports.filterOneJourney = (journey) => {
    journey.__v = undefined
    return journey
}

/**
 * 
 * @param {Array} journeys 
 * @returns {Array}
 */
exports.filterMultipleJourneys = (journeys) => {
    journeys.forEach(journey => {
        this.filterOneJourney(journey)
    })
    return journeys
}