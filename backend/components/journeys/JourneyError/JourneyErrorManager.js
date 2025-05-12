const errorTable = require("./JourneyErrors.json")
const ErrorReport = require("../../workspace/ErrorReport")
const CarService = require("../../cars/carService.js")

/**
 * Teste les erreurs possibles de req pour réussir la création future de l'objet
 * @param {object} req 
 * @returns {ErrorReport}
 */
exports.getCreationError = (req) => {
    // Présence de tous les champs nécessaires
    if (
        req.starting == undefined
        || req.starting.city == undefined
        || req.starting.address == undefined
        || req.starting.regionCode == undefined
        || req.arrival == undefined
        || req.arrival.city == undefined
        || req.arrival.address == undefined
        || req.arrival.regionCode == undefined
        || req.date == undefined
        || req.seats == undefined
        || req.seats.total == undefined
        || req.seats.left == undefined
        || req.price == undefined
        || req.carId == undefined
    ) {
        return new ErrorReport(true, errorTable["missingArg"])
    }

    // Type des valeurs
    if (
        typeof(req.starting) !== "object"
        || typeof(req.starting.city) !== "string"
        || !Array.isArray(req.starting.address)
        || typeof(req.starting.regionCode) !== "string"
        || typeof(req.arrival) !== "object"
        || typeof(req.arrival.city) !== "string"
        || !Array.isArray(req.arrival.address)
        || typeof(req.arrival.regionCode) !== "string"
        || typeof(req.date) !== "string"
        || typeof(req.seats) !== "object"
        || typeof(req.seats.total) !== "number"
        || typeof(req.seats.left) !== "number"
        || typeof(req.price) !== "number"
        || typeof(req.carId) !== "string"
    ) {
        return new ErrorReport(true, errorTable["typeError"])
    }

    // Bon sens des valeurs
    if (req.seats.left < 0 || req.seats.total < 0) return new ErrorReport(true, errorTable["badPlace"])
    if (req.seats.left > req.seats.total) return new ErrorReport(true, errorTable["badPlaceLogic"])
    if (req.price < 0) return new ErrorReport(true, errorTable["badPrice"])
    
    // Format de carId
    if (req.carId.length !== 24) return new ErrorReport(true, errorTable["carIdError"])

    // Cohérence date
    const date = new Date(req.date)
    if (date.toString() === "Invalid Date") return new ErrorReport(true, errorTable["badDate"])
    if (date.toISOString() < (new Date(Date.now()).toISOString())) return new ErrorReport(true, errorTable["passedDate"])

    return new ErrorReport(false)
}


/**
 * Teste l'authentifaication
 * @param {string} ownerId 
 * @param {string} userAuthId 
 * @returns {ErrorReport}
 */
exports.verifyAuthentication = (ownerId, userAuthId) => {
    if (ownerId != userAuthId) {
        return new ErrorReport(true, errorTable["unauthorizedError"])
    }
    return new ErrorReport(false)
}


/**
 * Cherche des erreurs avant la modification de l'objet
 * @param {object} req 
 * @param {string} userAuthId 
 * @param {string} ownerId 
 * @param {object} seats 
 * @returns {ErrorReport}
 */
exports.getModifyError = async (req, userAuthId, ownerId, seats) => {
    // Attention, il est probable que la requete ne contienne que l'attribut qui doit être modifié
    // Authentification
    const authError = this.verifyAuthentication(ownerId, userAuthId)
    if (authError.hasError) return authError

    // Type des variables
    if (
        (req.starting != null && typeof(req.starting) !== "object")
        || (req.starting.city != null && typeof(req.starting.city) !== "string")
        || (req.starting.adress != null && typeof(req.starting.adress) !== "string")
        || (req.arrival != null && typeof(req.arrival) !== "object")
        || (req.arrival.adress != null && typeof(req.arrival.adress) !== "string")
        || (req.arrival.city != null && typeof(req.arrival.city) !== "string")
        || (req.date != null && typeof(req.date) !== "string")
        || (req.seats != null && typeof(req.seats) !== "object")
        || (req.seats.total != null && typeof(req.seats.total) !== "number")
        || (req.seats.left != null && typeof(req.seats.left) !== "number")
        || (req.price != null && typeof(req.price) !== "number")
        || (req.state != null && typeof(req.state) !== "string")
        || (req.carId != null && typeof(req.carId !== "string") && req.carId.length !== 24)
    ) {
        return new ErrorReport(true, errorTable["typeError"])
    }

    // Vérification des valeurs nulles
    if (
        req.starting === null
        || req.starting.adress === null
        || req.starting.city === null
        || req.arrival === null
        || req.arrival.adress === null
        || req.arrival.city === null
        || req.date === null
        || req.seats === null
        || req.seats.left === null
        || req.seats.total === null
        || req.price === null
        || req.state === null
        || req.carId === null
    ) {
        return new ErrorReport(true, errorTable["nullError"])
    }

    // Cohérence
    let coherent = true
    if (req.seats != null) {
        // Seats est défini
        if (req.seats.left != null) {
            // left est défini
            if (req.seats.left < 0) coherent = false

            if (req.seats.total != null) {
                // left et total sont définis
                if (req.seats.total <= 1) coherent = false
                if (req.seats.left > req.seats.total) coherent = false
            }
            else {
                // seul left est défini
                if (req.seats.left > seats.total) coherent = false // Vérification sur le seats de l'objet déjà enregistré
            }
        }
    }

    if (!coherent) return new ErrorReport(true, errorTable["leftUpperThanTotal"])

    return new ErrorReport(false)
}


/**
 * Suppose userId et carId déjà vérifiés (non null et de 24 char)
 * @param {string} userId 
 * @param {string} carId 
 * @returns {Promise}
 */
exports.verifyIfUserHasCar = async (userId, carId) => {
    // Bonne utilisation de la fonction:
    if (userId == null || carId == null || userId.length !== 24 || carId.length !== 24)
        return new ErrorReport(true, errorTable["internalError"])

    // Vérification de l'inclusion de la voiture
    return await CarService.verifyIfUserHasCar(userId, carId)
        .then(hasTheCar => {
            return hasTheCar ? new ErrorReport(false) : new ErrorReport(true, errorTable["carNotInUserData"])
        })
        .catch(error => new ErrorReport(true, error))
}

exports.getIdError = (id) => {
    if (id == null || id.length !== 24) return new ErrorReport(true, errorTable["idTypeError"])
    return new ErrorReport(false)
}

exports.getNotFoundError = (journey) => {
    if (journey == null) return new ErrorReport(true, errorTable["journeyNotFound"])
    return new ErrorReport(false)
}

exports.verifyRightsOfReservationOfUserOnJourney = (journey, userId) => {
    if (userId == undefined) return new ErrorReport(true, errorTable["internalError"])
    if (journey.ownerId.toString() === userId) return new ErrorReport(true, errorTable["reserverIsOwner"])
    return new ErrorReport(false)
}

exports.verifyAddReservation = (journey, nbReservation) => {
    const newNbLeft = journey.seats.left - nbReservation
    if (newNbLeft < 0 || newNbLeft > journey.seats.total) return new ErrorReport(true, errorTable["addReservationError"])
    return new ErrorReport(false)
}

exports.getDoneError = (journey) => {
    if (journey.state === "d") return new ErrorReport(true, errorTable["doneError"])
    return new ErrorReport(false)
}