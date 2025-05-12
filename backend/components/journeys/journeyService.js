const Service_Response = require("../workspace/service_response.js")
const JourneyErrorManager = require("./JourneyError/JourneyErrorManager.js")
const GeneralErrorManager = require("../workspace/GeneralError/GeneralErrorManager.js")
const AdressVerifier = require("../workspace/GeneralError/adressVerifier.js")
const JourneyFactory = require("./JourneyFactory.js")
const JourneySeeker = require("./JourneySeeker.js")
const JourneyFilter = require("./JourneyFilter.js")
const ReservationService = require("../reservation/ReservationService.js")
const CarSeeker = require("../cars/CarSeeker.js")


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
    const isConnected = GeneralErrorManager.getAuthError(userId)
    if (isConnected.hasError) return new Service_Response(undefined, 401, true, isConnected.error)
    
    const userRegistrationCompleteError = await GeneralErrorManager.isUserVerified(userId)
    if (userRegistrationCompleteError.hasError) return new Service_Response(undefined, 401, true, userRegistrationCompleteError.error)
    
    const creationError = JourneyErrorManager.getCreationError(reqJourney)
    if (creationError.hasError) return new Service_Response(undefined, 400, true, creationError.error)

    const verifyIfUserHasCar = await JourneyErrorManager.verifyIfUserHasCar(userId, reqJourney.carId)
    if (verifyIfUserHasCar.hasError) return new Service_Response(undefined, 401, true, verifyIfUserHasCar.error)
    
    const verifyStartingAddress = await AdressVerifier.isAddressCorrect(reqJourney.starting.address, reqJourney.starting.regionCode, reqJourney.starting.city)
    if (verifyStartingAddress.hasError) return new Service_Response(undefined, 400, true, verifyStartingAddress.error)

    const verifyArrivalAddress = await AdressVerifier.isAddressCorrect(reqJourney.arrival.address, reqJourney.arrival.regionCode, reqJourney.arrival.city)
    if (verifyArrivalAddress.hasError) return new Service_Response(undefined, 400, true, verifyArrivalAddress.error)

    const journey = JourneyFactory.createJourney(userId, reqJourney.starting, reqJourney.arrival, reqJourney.date, reqJourney.seats, reqJourney.price, reqJourney.carId)
    return await journey.save()
        .then(() => (new Service_Response(undefined, 201)).setLocation('/journey/' + journey.id))
        .catch(error => new Service_Response(undefined, 500, true, error))
}


/**
 * Renvoie les dernières journeys dans la limite du paramètre limite (50 si non renseigné)
 * @param {object} query 
 * @param {number} limit 
 * @returns {Service_Response}
 */
exports.getLastJourneys = async (query, limit=20) => {
    return await JourneySeeker.getLastJourneys(limit, query)
        .then(elts => {
            JourneyFilter.filterMultipleJourneys(elts)
            return new Service_Response(elts)
        })
        .catch(error => new Service_Response(undefined, 500, true, error))
}

/**
 * Renvoie la journey dont l'id est en paramètre, dans un Service_Response
 * @param {number} journeyId 
 * @returns {Promise} 
 */
exports.getOneJourney = async (journeyId) => {
    const getOneJourneyError = GeneralErrorManager.isValidId(journeyId, "journey")
    if (getOneJourneyError.hasError) 
        return new Service_Response(undefined, 400, true, getOneJourneyError.error)

    return await JourneySeeker.getOneJourney(journeyId)
        .then(journey => {
            const notFound = JourneyErrorManager.getNotFoundError(journey)
            if (notFound.hasError) return new Service_Response(undefined, 404, true, notFound.error)
            JourneyFilter.filterOneJourney(journey)
            return new Service_Response(journey, 302)
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
        .then(async currentJourneyResp => {
            if (currentJourneyResp.has_error) 
                return currentJourneyResp

            // Vérification de la validité des données
            const modifyError = await JourneyErrorManager.getModifyError(newJourney, userAuthId, currentJourneyResp.result.ownerId, currentJourneyResp.result.seats)
            if (modifyError.hasError) return new Service_Response(undefined, 400, true, modifyError.error)
            
            if (currentJourneyResp.result.ownerId !== undefined) {
                const ownerError = await JourneyErrorManager.verifyIfUserHasCar(userAuthId.toString(), currentJourneyResp.result.carId.toString())
                if (ownerError.hasError) return new Service_Response(undefined, 401, true, ownerError.error)    
            }
            
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
    const idError = JourneyErrorManager.getIdError(journeyId)
    if (idError.hasError) return new Service_Response(undefined, 400, true, idError.error)

    return await JourneySeeker.getOneJourney(journeyId)
        .then(journey => {
            const authError = JourneyErrorManager.verifyAuthentication(journey.ownerId, userAuthId)
            if (authError.hasError) return new Service_Response(undefined, 401, true, authError.error)
            
            const reservationResponse = ReservationService.deleteJourneyReservation(journeyId)
            if (reservationResponse.has_error) return reservationResponse

            return JourneyFactory.deleteJourney(journeyId)
                .then(() => new Service_Response(undefined))
                .catch(error => new Service_Response(undefined, 500, true, error))
        })
        .catch(error => new Service_Response(undefined, 500, true, error))
}



/**
 * 
 * @param {string} journeyId 
 * @param {string} userId 
 * @returns {Promise}
 */
exports.canAddAReservation = async (journeyId, userId) => {
    const journeyIdError = JourneyErrorManager.getIdError(journeyId)
    if (journeyIdError.hasError) return new Service_Response(undefined, 400, true, journeyIdError.error)

    return await JourneySeeker.getOneJourney(journeyId)
        .then(journey => {
            const notFound = JourneyErrorManager.getNotFoundError(journey)
            if (notFound.hasError) return new Service_Response(undefined, 404, true, notFound.error)
            
            const permissionError = JourneyErrorManager.verifyRightsOfReservationOfUserOnJourney(journey, userId)
            if (permissionError.hasError) return new Service_Response(undefined, 401, true, permissionError.error)
            
            const journeyDoneError = JourneyErrorManager.getDoneError(journey)
            if (journeyDoneError.hasError) return new Service_Response(undefined, 400, true, journeyDoneError.error)

            return new Service_Response(journey.seats.left > 0)
        })
}


/**
 * 
 * @param {string} journeyId 
 * @param {Number} nbReservation could be positive to add reservations, or negative to remove ones
 * @returns {Service_Response}
 */
exports.editReservation = async (journeyId, nbReservation) => {
    const journeyIdError = JourneyErrorManager.getIdError(journeyId)
    if (journeyIdError.hasError) return new Service_Response(undefined, 400, true, journeyIdError.error)
    
    return await JourneySeeker.getOneJourney(journeyId)
        .then(journey => {
            const notFound = JourneyErrorManager.getNotFoundError(journey)
            if (notFound.hasError) return new Service_Response(undefined, 404, true, notFound.error)
            
            const verifyAddingLogic = JourneyErrorManager.verifyAddReservation(journey, nbReservation)
            if (verifyAddingLogic.hasError) return new Service_Response(undefined, 500, true, verifyAddingLogic.error)
            
            JourneyFactory.addReservation(journey, nbReservation)
            return journey.save()
                .then(() => new Service_Response(undefined))
                .catch(error => new Service_Response(undefined, 500, true, error))
        })
}


exports.isDoneJourney = async (journeyId) => {
    const journeyIdError = JourneyErrorManager.getIdError(journeyId)
    if (journeyIdError.hasError) return new Service_Response(undefined, 400, true, journeyIdError.error)
    
    return await JourneySeeker.getOneJourney(journeyId)
        .then(journey => {
            const journeyDoneError = JourneyErrorManager.getDoneError(journey)
            if (journeyDoneError.hasError) return new Service_Response(undefined, 400, true, journeyDoneError.error)

            return new Service_Response(undefined)
        })
}