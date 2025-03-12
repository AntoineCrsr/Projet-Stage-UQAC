const Journey = require("./journeyModel")
const Service_Response = require("../workspace/service_response.js")


let unauthorizedError = {
    "errors": {
        "journey": {
            "code": "Unauthorized",
            "name": "L'utilisateur cherchant éditer le trajet n'en est pas le propriétaire."
        }
    }
}


function verifyJourneyInformation(journeyJson, userId) {
    // Présence de tous les champs nécessaires
    if (
        starting == undefined
        || arrival == undefined
        || date == undefined
        || seats == undefined
        || price == undefined
    ) {
        return new Service_Response(undefined, 401, true, {
            "errors": {
                "journey": {
                    "code": "missing-fields",
                    "name": "La requete ne dispose pas des attributs nécessaires (starting, arrival, date, seats, price)"
                }
            }
        })
    }

    if (
        seats < 0
        || price < 0
    ) {
        return new Service_Response(undefined, 401, true, {
            "errors": {
                "journey": {
                    "code": "bad-values",
                    "name": "Les valeurs 'seats' ou 'price' doivent être >= 0."
                }
            }
        })
    }
}

/**
 * Crée une journey et retourne la promise de sa création
 * @param {*} reqJourney 
 * @param {*} userId 
 * @returns {Promise}
 */
exports.createJourney = async (reqJourney, userId) => {
    const journey = new Journey({
        ownerId: userId,
        starting: reqJourney.starting,
        arrival: reqJourney.arrival,
        date: reqJourney.date,
        seats: reqJourney.seats,
        price: reqJourney.price,
        passengers: []
    })
    return await journey.save()
        .then(() => (new Service_Response(undefined, 201)).setLocation('/journey/' + journey.id))
        .catch(error => new Service_Response(undefined, 400, true, error))
}


/**
 * Retourne les derniers journeys avec une limite de *limit*, trié par ordre décroissant
 * des dates
 */
exports.getLastJourneys = async (limit) => {
    return await Journey.find().sort({ date: -1 }).limit(limit)
        .then(elts => new Service_Response(elts))
        .catch(error => new Service_Response(undefined, 500, true, error))
}


/**
 * Retourne une promise de la journey dont l'id est passé en paramètre
 * @param {*} journeyId 
 * @returns {Promise} 
 */
exports.getOneJourney = async (journeyId) => {
    return await Journey.findOne({_id: journeyId})
        .then(journey => new Service_Response(journey))
        .catch(error => new Service_Response(undefined, 404, true, error))
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