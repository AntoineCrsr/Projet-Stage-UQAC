const Journey = require("./journeyModel")
const Service_Response = require("../workspace/service_response.js")
const JourneyErrorManager = require("./JourneyError/JourneyErrorManager.js")
const JourneyFactory = require("./JourneyFactory.js")
const JourneySeeker = require("./JourneySeeker.js")

/**
 * Le role de ce service est de :
 * 1. Lancer la vérifaction des données avec JourneyErrorManager
 * 2. Lancer l'opération avec le ou les classes adaptées
 */




/**
 * Vérifie les données et renvoie la Journey dans un Service_Response
 * @param {*} reqJourney 
 * @param {string} userId 
 * @returns {Service_Response}
 */
exports.createJourney = async (reqJourney, userId) => {
    const creationError = JourneyErrorManager.getCreationError(reqJourney)
    if (creationError.hasError) return new Service_Response(undefined, 400, true, creationError.error)

    const journey = JourneyFactory.createJourney(userId, reqJourney.starting, reqJourney.arrival, reqJourney.date, reqJourney.seats, reqJourney.price)
    return await journey.save()
        .then(() => (new Service_Response(undefined, 201)).setLocation('/journey/' + journey.id))
        .catch(error => new Service_Response(undefined, 400, true, error))
}


/**
 * Renvoie les dernières journeys dans la limite du paramètre limite (50 si non renseigné)
 * @param {number} limit 
 * @returns {Service_Response}
 */
exports.getLastJourneys = async (limit=50) => {
    return await JourneySeeker.getLastJourneys(limit)
        .then(elts => new Service_Response(elts))
        .catch(error => new Service_Response(undefined, 500, true, error))
}


/**
 * Retourne une promise de la journey dont l'id est passé en paramètre
 * @param {number} journeyId 
 * @returns {Promise} 
 */
exports.getOneJourney = async (journeyId) => {
    return await JourneySeeker.getOneJourney(journeyId)
        .then(journey => {
            if (journey == null) return new Service_Response(undefined, 404, true, error)
            return new Service_Response(journey)
        })
        .catch(error => new Service_Response(undefined, 500, true, error))
}

// LA
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
exports.modifyOneJourney = async (newJourneyId, newJourney, userAuthId) => {
    return await this.getOneJourney(newJourneyId)
        .then(currentJourneyResp => {
            if (currentJourneyResp.has_error) 
                return currentJourneyResp
            
            delete newJourney._id
            delete newJourney.ownerId

            currentJourney = currentJourneyResp.result
            
            if (currentJourney.ownerId != userAuthId)
                return new Service_Response(undefined, 401, true, unauthorizedError)
            return Journey.updateOne({ _id: newJourneyId }, { ...newJourney, _id: newJourneyId })
                .then(() => (new Service_Response(undefined)).setLocation('/journey/' + newJourneyId))
                .catch(error => new Service_Response(undefined, 500, true, error))
        })
}


/**
 * Supprime la journey en vérifiant que l'utilisateur qui le demande
 * en soit le propriétaire
 * @param {*} journeyId 
 * @param {*} userAuthId 
 * @returns 
 */
exports.deleteOneJourney = async (journeyId, userAuthId) => {
    return await Journey.findOne({_id: journeyId})
        .then(journey => {
            if (journey.ownerId != userAuthId)
                return new Service_Response(undefined, 401, true, unauthorizedError)
            return Journey.deleteOne({_id: journeyId})
                .then(() => new Service_Response(undefined))
                .catch(error => new Service_Response(undefined, 500, true, error))
        })
        .catch(error => new Service_Response(undefined, 500, true, error))
}