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
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
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
        .then(elts => res.status(200).json(elts))
        .catch(error => res.status(400).json({error}))
}


/**
 * Renvoie une voiture selon son id dans /api/car/id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getOneCar = (req, res, next) => {
    carService.getOneCar(req.params.id )
        .then(car => res.status(200).json(car))
        .catch(error => res.status(404).json({ error }));
}

/**
 * Modifie une voiture selon carService
 * 200 si modifié
 * 401 sinon
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.modifyOneCar = (req, res, next) => {
    console.log(req.body.car)
    carService.modifyOneCar(req.params.id, req.auth.userId, req.file, req.body.car, req.protocol)
        .then(() => res.status(200).json({message : 'Objet modifié!'}))
        .catch(error => res.status(401).json({ error }));
 };


/**
 * Supprime une voiture selon carService
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.deleteOneCar = (req, res, next) => {
    carService.deleteOneCar(req.params.id, req.auth.userId)
        .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
        .catch(error => {res.status(401).json({ error }); console.log(error)});
}