const Service_Response = require("../workspace/service_response.js")
const JourneyErrorManager = require("./JourneyError/JourneyErrorManager.js")
const GeneralErrorManager = require("../workspace/GeneralError/GeneralErrorManager.js")
const AdressVerifier = require("../workspace/GoogleAPI/adressVerifier.js")
const JourneyFactory = require("./JourneyFactory.js")
const JourneySeeker = require("./JourneySeeker.js")
const JourneyFilter = require("./JourneyFilter.js")
const ReservationService = require("../reservation/ReservationService.js")
const JourneyFormater = require("./JourneyFormater.js")
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
    
    const correctStartingAddress = await AdressVerifier.getCorrectAddress(reqJourney.starting.address, reqJourney.starting.city)

    const verifyStartingAddress = JourneyErrorManager.getInvalidAddress(correctStartingAddress)
    if (verifyStartingAddress.hasError) return new Service_Response(undefined, 400, true, verifyStartingAddress.error)

    const correctArrivalAddress = await AdressVerifier.getCorrectAddress(reqJourney.arrival.address, reqJourney.arrival.city)

    const verifyArrivalAddress = JourneyErrorManager.getInvalidAddress(correctArrivalAddress)
    if (verifyArrivalAddress.hasError) return new Service_Response(undefined, 400, true, verifyArrivalAddress.error)

    // Remplacer l'entrée user par celle corrigée par GMAPS et récupérer la province
    JourneyFormater.formatJourney(reqJourney, correctStartingAddress, correctArrivalAddress)

    const isCorrectProvince = JourneyErrorManager.getProvinceError(reqJourney)
    if (isCorrectProvince.hasError) return new Service_Response(undefined, 400, true, isCorrectProvince.error)

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
exports.modifyOneJourney = async (newJourneyId, reqJourney, userId) => {
    const getOneJourneyError = GeneralErrorManager.isValidId(newJourneyId, "journey")
    if (getOneJourneyError.hasError) return new Service_Response(undefined, 400, true, getOneJourneyError.error)

    const journey = await JourneySeeker.getOneJourney(newJourneyId)
    const isNotFound = JourneyErrorManager.getNotFoundError(journey)
    if (isNotFound.hasError) return new Service_Response(undefined, 404, true, isNotFound.error)

    const isConnected = GeneralErrorManager.getAuthError(userId)
    if (isConnected.hasError) return new Service_Response(undefined, 401, true, isConnected.error)
    
    const userRegistrationCompleteError = await GeneralErrorManager.isUserVerified(userId)
    if (userRegistrationCompleteError.hasError) return new Service_Response(undefined, 401, true, userRegistrationCompleteError.error)
    
    const creationError = JourneyErrorManager.getModifyError(reqJourney)
    if (creationError.hasError) return new Service_Response(undefined, 400, true, creationError.error)

    const alreadyTerminated = JourneyErrorManager.isAlreadyTerminated(journey)
    if (alreadyTerminated.hasError) return new Service_Response(undefined, 401, true, alreadyTerminated.error)

    const verifyIfUserHasCar = await JourneyErrorManager.verifyIfUserHasCar(userId, reqJourney.carId)
    if (verifyIfUserHasCar.hasError) return new Service_Response(undefined, 401, true, verifyIfUserHasCar.error)
    
    const correctStartingAddress = await AdressVerifier.getCorrectAddress(reqJourney.starting.address, reqJourney.starting.city)

    const verifyStartingAddress = JourneyErrorManager.getInvalidAddress(correctStartingAddress)
    if (verifyStartingAddress.hasError) return new Service_Response(undefined, 400, true, verifyStartingAddress.error)

    const correctArrivalAddress = await AdressVerifier.getCorrectAddress(reqJourney.arrival.address, reqJourney.arrival.city)

    const verifyArrivalAddress = JourneyErrorManager.getInvalidAddress(correctArrivalAddress)
    if (verifyArrivalAddress.hasError) return new Service_Response(undefined, 400, true, verifyArrivalAddress.error)

    // Remplacer l'entrée user par celle corrigée par GMAPS et récupérer la province
    JourneyFormater.formatJourney(reqJourney, correctStartingAddress, correctArrivalAddress)

    const isCorrectProvince = JourneyErrorManager.getProvinceError(reqJourney)
    if (isCorrectProvince.hasError) return new Service_Response(undefined, 400, true, isCorrectProvince.error)
    
    console.log(reqJourney)
    
    return JourneyFactory.updateJourney(newJourneyId, reqJourney)
        .then(() => (new Service_Response(undefined)).setLocation('/journey/' + newJourneyId))
        .catch(error => new Service_Response(undefined, 500, true, error))
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