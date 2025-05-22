const Journey = require("./journeyModel")

/**
 * @param {Number} limit 
 * @returns {Promise}
 */
exports.getLastJourneys = async (constraints={}, limit=undefined) => {
    if (constraints.starting) constraints["starting.city"] = constraints.starting.toLowerCase()
    if (constraints.arrival) constraints["arrival.city"] = constraints.arrival.toLowerCase()
    if (constraints.minDate) constraints["date"] = { $gte: constraints.minDate}
    delete constraints.starting
    delete constraints.arrival
    delete constraints.minDate
    return limit == undefined ? await Journey.find(constraints).sort({ date: -1 })
        : await Journey.find(constraints).sort({ date: -1 }).limit(limit)
}

/**
 * @param {string} journeyId
 * @returns {Promise}
 */
exports.getOneJourney = async (journeyId) => {
    return await Journey.findOne({_id: journeyId})
}


exports.getCitiesByCityPrefix = async (prefix) => {
    if (prefix) {
        const regex = new RegExp('^' + prefix.toLowerCase(), 'i');

        const journeys = await Journey.find({
            $or: [
                { 'starting.city': regex },
                { 'arrival.city': regex }
            ]
        }).limit(50).select('starting.city arrival.city -_id');

        const citiesSet = new Set();

        journeys.forEach(journey => {
            if (regex.test(journey.starting.city)) {
                citiesSet.add(journey.starting.city);
            }
            if (regex.test(journey.arrival.city)) {
                citiesSet.add(journey.arrival.city);
            }
            if (citiesSet.size >= 20) return;
        });

        return Array.from(citiesSet);
    } else {
        // Pas de prefix : on renvoie les 20 dernières villes utilisées
        const journeys = await Journey.find({})
            .sort({ date: -1 }) // dernières dates d'abord
            .limit(50) // on en récupère un peu plus pour avoir 20 villes uniques
            .select('starting.city arrival.city -_id');

        const citiesSet = new Set();

        for (const journey of journeys) {
            if (journey.starting.city) citiesSet.add(journey.starting.city);
            if (journey.arrival.city) citiesSet.add(journey.arrival.city);

            if (citiesSet.size >= 20) break;
        }

        return Array.from(citiesSet);
    }
};