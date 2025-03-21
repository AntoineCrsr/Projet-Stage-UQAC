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
 * @param {object} reqJourney 
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
 * Renvoie la journey dont l'id est en paramètre, dans un Service_Response
 * @param {number} journeyId 
 * @returns {Promise} 
 */
exports.getOneJourney = async (journeyId) => {
    const getOneJourneyError = JourneyErrorManager.getOneError(journeyId)
    if (getOneJourneyError.hasError) 
        return new Service_Response(undefined, 400, true, getOneJourneyError.error)

    return await JourneySeeker.getOneJourney(journeyId)
        .then(journey => {
            if (journey == null) return new Service_Response(undefined, 404, true, error)
            return new Service_Response(journey)
        })
        .catch(error => new Service_Response(undefined, 500, true, error))
}

/**
 * Modifie la journey à newJourneyId
 * @param {string} newJourneyId 
 * @param {object} newJourney 
 * @param {string} userAuthId 
 * @returns {Service_Response}
 */
exports.modifyOneJourney = async (newJourneyId, newJourney, userAuthId) => {
    // Utilise le service pour éviter la répétition de code
    return await this.getOneJourney(newJourneyId)
        .then(currentJourneyResp => {
            if (currentJourneyResp.has_error) 
                return currentJourneyResp

            // Vérification de la validité des données
            const modifyError = JourneyErrorManager.getModifyError(newJourney, userAuthId, currentJourneyResp.result.ownerId, currentJourneyResp.result.seats)
            if (modifyError.hasError) return new Service_Response(undefined, 400, true, modifyError.error)
            
            return JourneyFactory.updateJourney(newJourneyId, newJourney)
                .then(() => (new Service_Response(undefined)).setLocation('/journey/' + newJourneyId))
                .catch(error => new Service_Response(undefined, 500, true, error))
        })
}


/**
 * Supprime la journey en vérifiant que l'utilisateur qui le demande
 * en soit le propriétaire
 * @param {string} journeyId 
 * @param {string} userAuthId 
 * @returns  {Service_Response}
 */
exports.deleteOneJourney = async (journeyId, userAuthId) => {
    return await Journey.findOne({_id: journeyId})
        .then(journey => {
            const authError = JourneyErrorManager.verifyAuthentication(journey.ownerId, userAuthId)
            if (authError.hasError) return new Service_Response(undefined, 401, true, authError.error)
            return JourneyFactory.deleteJourney(journeyId)
                .then(() => new Service_Response(undefined))
                .catch(error => new Service_Response(undefined, 500, true, error))
        })
        .catch(error => new Service_Response(undefined, 500, true, error))
}