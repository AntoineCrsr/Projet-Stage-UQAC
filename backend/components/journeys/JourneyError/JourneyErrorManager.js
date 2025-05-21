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
        || req.arrival == undefined
        || req.arrival.city == undefined
        || req.arrival.address == undefined
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
        || typeof(req.arrival) !== "object"
        || typeof(req.arrival.city) !== "string"
        || !Array.isArray(req.arrival.address)
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


exports.getModifyError = (req) => {
    // Exact same verifications as creation, but some words can be different
    const error = this.getCreationError(req)
    if (JSON.stringify(error.error) === JSON.stringify(errorTable["missingArg"]))
        return new ErrorReport(true, errorTable["missingArgModify"])
    return error
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

exports.getInvalidAddress = (correctAddress) => {
    if (correctAddress == null) return new ErrorReport(true, errorTable["adressInv"])
    return new ErrorReport(false)
}

exports.isAlreadyTerminated = (journey) => {
    if (journey.state === "d") return new ErrorReport(true, errorTable["alreadyTerminated"])
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

exports.getDeleteDoneError = (journey) => {
    if (journey.state === "d") return new ErrorReport(true, errorTable["doneError"])
    return new ErrorReport(false)
}

exports.getDoneError = (journey) => {
    if (journey.state === "d") return new ErrorReport(true, errorTable["interactDoneError"])
    return new ErrorReport(false)
}

exports.getProvinceError = (journey) => {
    if (journey.starting.province !== "QC" || journey.arrival.province !== "QC")
        return new ErrorReport(true, errorTable["invProvince"])
    return new ErrorReport(false)
}


exports.verifySeatsLeft = (journey) => {
    if (journey.seats.left <= 0)
        return new ErrorReport(true, errorTable["noSeatsLeft"])
    return new ErrorReport(false)
}