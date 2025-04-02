const errorTable = require("./CarErrors.json")
const ErrorReport = require("../../workspace/ErrorReport")
const { isNullOrUndefined } = require("node:util")

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

    return new ErrorReport(false)
}


exports.getNotFound = (car) => {
    if (car == null) return new ErrorReport(true, errorTable["notFound"])
    return new ErrorReport(false)
}


/**
 * 
 * @param {string} id 
 */
exports.getOneCarError = (id) => {
    if (id.length !== 24) return new ErrorReport(true, errorTable["idError"])
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

    return new ErrorReport(false)
}

exports.getAuthError = (authId, ownerId) => {
    if (authId !== ownerId) return new ErrorReport(true, errorTable["unauthorized"])
    return new ErrorReport(false)
}