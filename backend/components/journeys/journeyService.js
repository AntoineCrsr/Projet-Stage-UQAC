const Journey = require("./journeyModel")


/**
 * Crée une journey et retourne la promise de sa création
 * @param {*} reqJourney 
 * @param {*} userId 
 * @returns {Promise}
 */
exports.createJourney = (reqJourney, userId) => {
    const journey = new Journey({
        ownerId: userId,
        starting: reqJourney.starting,
        arrival: reqJourney.arrival,
        date: reqJourney.date,
        seats: reqJourney.seats,
        price: reqJourney.price,
        passengers: []
    })
    return journey.save()
}


/**
 * Retourne les derniers journeys avec une limite de *limit*, trié par ordre décroissant
 * des dates
 */
exports.getLastJourneys = (limit) => {
    return Journey.find().sort({ date: -1 }).limit(limit)
        .then(elts => {
            return elts
        })
        .catch(error => {throw error})
}


/**
 * Retourne une promise de la journey dont l'id est passé en paramètre
 * @param {*} journeyId 
 * @returns {Promise} 
 */
exports.getOneJourney = (journeyId) => {
    return Journey.findOne({_id: journeyId})
}


/**
 * Modifie la journey à newJourneyId
 * NE TIENT PAS COMPTE DE newJourney.id
 * Envoie une erreur si l'utilisateur connecté n'est pas ownerId
 * Return la promise de l'update
 * @param {*} newJourneyId 
 * @param {*} newJourney 
 * @param {*} userAuthId 
 * @returns {Promise}
 */
exports.modifyOneJourney = (newJourneyId, newJourney, userAuthId) => {
    return this.getOneJourney(newJourneyId)
        .then(currentJourney => {
            delete newJourney._id
            delete newJourney.ownerId
            if (currentJourney.ownerId != userAuthId)
                throw new Error("You can't modify a journey that you don't own")
            return Journey.updateOne({ _id: newJourneyId }, { ...newJourney, _id: newJourneyId })
        })
        .catch(error => {throw error})
}


exports.deleteOneJourney = (journeyId, userAuthId) => {
    return Journey.findOne(journeyId)
        .then(journey => {
            if (journey.ownerId != userAuthId)
                throw new Error("You can't delete a journey that you don't own")
            return Journey.deleteOne(journeyId)
        })
        .catch(error => {throw error})
}