const carService = require("./carService")


// Fonction pour renvoyer une response avec gestion d'erreur adapté à service_response
// Et SANS header location
function buildSimpleResponse(service_response, res) {
    if (service_response.has_error) res.status(service_response.http_code).json(service_response.error_object)
    else res.status(service_response.http_code).json(service_response.result)
}

// Même chose mais AVEC le header Location
function buildLocationResponse(service_response, res) {
    if (service_response.has_error) res.status(service_response.http_code).json(service_response.error_object)
    else res.status(service_response.http_code).location(service_response.location).json(service_response.result)
}


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
        .then(service_response => buildLocationResponse(service_response, res))
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
        .then(service_response => buildSimpleResponse(service_response, res))
}


/**
 * Renvoie une voiture selon son id dans /api/car/id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getOneCar = (req, res, next) => {
    carService.getOneCar(req.params.id )
        .then(service_response => buildSimpleResponse(service_response, res))
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
        .then(service_response => buildLocationResponse(service_response, res))
 }


/**
 * Supprime une voiture selon carService
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.deleteOneCar = (req, res, next) => {
    carService.deleteOneCar(req.params.id, req.auth.userId)
        .then(service_response => buildSimpleResponse(service_response, res))
}