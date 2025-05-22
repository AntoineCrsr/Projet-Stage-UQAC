const JourneySeeker = require("../journeys/JourneySeeker")
const Service_Response = require("../workspace/service_response")

/**
 * 
 * @param {string} prefix 
 * @returns {Promise<Service_Response>}
 */
exports.getCities = async (prefix) => {
    const cities = await JourneySeeker.getCitiesByCityPrefix(prefix)
    return new Service_Response(cities)
}