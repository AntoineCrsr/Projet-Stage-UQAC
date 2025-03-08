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
    
    carService.createCar(car, req.auth.userId, req.file, req.protocol, req.get('host'))
        .then((servResp) => res.status(servResp.http_code).json(servResp.result))
}


/**
 * Renvoie toutes les voitures
 * TEMP -- faire ça pour un utilisateur donné
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getAllCars = (req, res, next) => {
    carService.getAllCars()
        .then(servResp => res.status(servResp.http_code).json(servResp.result))
}


/**
 * Renvoie une voiture selon son id dans /api/car/id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getOneCar = (req, res, next) => {
    carService.getOneCar(req.params.id )
        .then(servResp => res.status(servResp.http_code).json(servResp.result))
}

/**
 * Modifie une voiture selon carService
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.modifyOneCar = (req, res, next) => {
    console.log(req.body.car)
    carService.modifyOneCar(req.params.id, req.auth.userId, req.file, req.body.car, req.protocol)
        .then((servResp) => res.status(servResp.http_code).json(servResp.result))
 };


/**
 * Supprime une voiture selon carService
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.deleteOneCar = (req, res, next) => {
    carService.deleteOneCar(req.params.id, req.auth.userId)
        .then((servResp) => res.status(servResp.http_code).json(servResp.result))
}