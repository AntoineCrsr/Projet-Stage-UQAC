const carService = require("./carService")


/**
 * Crée une voiture selon carService
 * 201 Si la création a marché
 * 400 Sinon
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.createCar = (req, res, next) => {
    // Gestion des voitures avec et sans images
    if (typeof req.body.car == "string") { // Formdata avec image (body multipart)
        car = JSON.parse(req.body.car)
    } else { // Body json 
        car = req.body.car
    }
    
    carService.createCar(car, req.auth ? req.auth.userId : null, req.file, req.protocol, req.get('host'))
        .then(service_response => service_response.buildResponse(res))
}


/**
 * Renvoie toutes les voitures
 * TEMP -- faire ça pour un utilisateur donné
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getAllCars = (req, res, next) => {
    carService.getAllCars(req.query)
        .then(service_response => service_response.buildResponse(res))
}


/**
 * Renvoie une voiture selon son id dans /api/car/id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getOneCar = (req, res, next) => {
    carService.getOneCar(req.params.id, req.auth ? req.auth.userId : null, req.query.private)
        .then(service_response => service_response.buildResponse(res))
}

/**
 * Modifie une voiture selon carService
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.modifyOneCar = (req, res, next) => {
    let newCarReq = typeof(req.body.car) === "string" ? JSON.parse(req.body.car) : {...req.body.car}
    carService.modifyOneCar(req.params.id, req.auth ? req.auth.userId : null, req.file, newCarReq, req.protocol, req.get('host'))
        .then(service_response => service_response.buildResponse(res))
}


/**
 * Supprime une voiture selon carService
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.deleteOneCar = (req, res, next) => {
    carService.deleteOneCar(req.params.id, req.auth ? req.auth.userId : null)
        .then(service_response => service_response.buildResponse(res))
}