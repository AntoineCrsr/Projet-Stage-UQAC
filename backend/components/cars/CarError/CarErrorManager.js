const errorTable = require("./CarErrors.json")
const ErrorReport = require("../../workspace/ErrorReport")
const CarSeeker = require("../../cars/CarSeeker")
const JourneySeeker = require("../../journeys/JourneySeeker")

exports.verifyCarCreation = (reqCar) => {
    // Attributs définis
    if (
        reqCar == undefined
        || reqCar.carType == undefined
        || reqCar.manufacturer == undefined
        || reqCar.year == undefined
        || reqCar.model == undefined
        || reqCar.color == undefined
        || reqCar.licensePlate == undefined
        || reqCar.airConditioner == undefined
        || reqCar.name == undefined
    ) return new ErrorReport(true, errorTable["badArgs"])

    // Types
    if (
        typeof(reqCar.carType) !== "string"
        || typeof(reqCar.manufacturer) !== "string"
        || typeof(reqCar.year) !== "string"
        || typeof(reqCar.model) !== "string"
        || typeof(reqCar.color) !== "string"
        || typeof(reqCar.licensePlate) !== "string"
        || typeof(reqCar.airConditioner) !== "boolean"
        || typeof(reqCar.name) !== "string"
    ) return new ErrorReport(true, errorTable["typeError"])

    // Vérification des attributs par un appel à une API
    // TODO
    
    if (
        !/\d{4}/.test(reqCar.year) // Not a number
        ||reqCar.year < 1900 
        || reqCar.year > (new Date(Date.now()).getFullYear())
    )
        return new ErrorReport(true, errorTable["typeError"])

    if (!/^(?:[a-z0-9]{6}|[a-z0-9]{9})$/.test(reqCar.licensePlate.toLowerCase()))
        return new ErrorReport(true, errorTable["typeError"]);

    return new ErrorReport(false)
}


exports.getNotFound = (car) => {
    if (car == null) return new ErrorReport(true, errorTable["notFound"])
    return new ErrorReport(false)
}


exports.getModifyError = (carReq) => {
    // Présence de l'objet
    if (carReq == undefined) return new ErrorReport(true, errorTable["badArgs"])
    
    // Type (teste aussi les valeurs nulles)
    if (
        typeof(carReq.carType) !== "string"
        || typeof(carReq.manufacturer) !== "string"
        || typeof(carReq.year) !== "string"
        || typeof(carReq.model) !== "string"
        || typeof(carReq.color) !== "string"
        || typeof(carReq.licensePlate) !== "string"
        || typeof(carReq.airConditioner) !== "boolean"
        || typeof(carReq.name) !== "string"
    ) return new ErrorReport(true, errorTable["typeError"])

    if (!/^(?:[a-z0-9]{6}|[a-z0-9]{9})$/.test(carReq.licensePlate.toLowerCase()))
        return new ErrorReport(true, errorTable["typeError"]);

    if (!/^[0-9]*$/.test(carReq.year.toLowerCase()))
        return new ErrorReport(true, errorTable["typeError"]);

    return new ErrorReport(false)
}

exports.getAuthError = (authId, ownerId) => {
    if (authId !== ownerId) return new ErrorReport(true, errorTable["unauthorized"])
    return new ErrorReport(false)
}


exports.verifyPrivatePermission = (ownerId, userAuthId, showPrivate) => {
    if (ownerId !== userAuthId && showPrivate === "true") return new ErrorReport(true, errorTable["unauthorizedPrivate"])
    return new ErrorReport(false)
}

exports.verifyConstraints = (constraints) => {
    // Vérification de la bonne utilisation:
    if (constraints == null) return new ErrorReport(true, errorTable["internalError"])

    // Normalement toujours vrai si cela vient du query string
    if (constraints.userId != undefined 
        && typeof(constraints.userId) !== "string"  
    ) return new ErrorReport(true, errorTable["internalError"])

    // Vérification du format de l'id utilisateur
    if (constraints.userId != undefined
        && constraints.userId.length !== 24
    ) return new ErrorReport(true, errorTable["userIdError"])

    // Vérification que la contrainte est sur userId
    if (typeof(constraints) == "object" 
    && (Object.keys(constraints).length > 1 // Plus d'une contrainte non autorisé
        || (Object.keys(constraints).length === 1 && constraints.userId == undefined))) // S'il y en a une et qu'elle n'est pas userId
        return new ErrorReport(true, errorTable["badQueryString"])
    
    return new ErrorReport(false)
}

exports.getCarVerifError = (userId, carId) => {
    // Suppose que les vérifications de format de userId et carId ont déjà été faites
    if (
        userId == undefined 
        || carId == undefined
        || userId.length !== 24
        || carId.length !== 24
    ) return new ErrorReport(true, errorTable["internalError"])
    return new ErrorReport(false)
}


/**
 * Retourne vrai s'il y a un conflit
 * faux s'il n'y en a pas
 * Avec carId on évite de dire qu'il y a un conflit quand la voiture qu'on modifie est celle qu'on
 * vient de trouver
 * @param {string} licensePlate 
 * @param {string} carId 
 * @returns {ErrorReport}
 */
exports.getCarAlreadyExistError = async (licensePlate, carId=null) => {
    if(await CarSeeker.getAll({"licensePlate": licensePlate}).then((cars) => {
        if (cars.length === 0 || cars[0]._id.toString() === carId) return false
        return true
    }))
        return new ErrorReport(true, errorTable["immatError"])
    return new ErrorReport(false)
}


exports.carInJourneyError = async (carId) => {
    const existJourney = await JourneySeeker.getLastJourneys({"carId": carId}, 20)
        .then(journeys => journeys.length > 0)
    if (existJourney) return new ErrorReport(true, errorTable["existJourneyWithCar"])
    return new ErrorReport(false)
}