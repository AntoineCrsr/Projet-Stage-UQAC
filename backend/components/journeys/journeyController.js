require("dotenv").config();
const { error } = require("console");
const journeyService = require("./journeyService")

/**
 * Créer un Journey selon journeyService
 * Nécessite le token JWT, preuve de la connexion du user
 * 201 Si la création a réussi
 * 500 sinon
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.createJourney = (req, res, next) => {
    journeyService.createJourney(req.body.journey, req.auth.userId)
        .then(journeyData => res.status(201).json({"message": "Journey created!", "journey": journeyData}))
        .catch(error => res.status(500).json(error));
}

/**
 * Renvoie un tableau des (au plus) 20 derniers journeys
 * 200 Si c'est correct
 * 400 s'il y a un problème
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getLastJourneys = (req, res, next) => {
    journeyService.getLastJourneys(20)
        .then(elts => res.status(200).json(elts))
        .catch(error => res.status(400).json({error}))
}

/**
 * Renvoie la journey dont l'id est à /api/journey/id
 * 200 si trouvée
 * 404 sinon
 */
exports.getOneJourney = (req, res, next) => {
    journeyService.getOneJourney(req.params.id)
        .then(journey => res.status(200).json(journey))
        .catch(error => res.status(404).json(error))
}

/**
 * Modifie la journey selon journeyService, à l'id passée en param à /api/journey/id
 */
exports.modifyOneJourney = (req, res, next) => {
    journeyService.modifyOneJourney(req.params.id, req.body.journey, req.auth.userId)
        .then(() => res.status(200).json({"message": "Journey successfully modified!"}))
        .catch(error => res.status(404).json(error))
}

/**
 * Supprime la journey selon journeyService
 * 200 Si ça a marché
 * 400 Sinon
 */
exports.deleteOneJourney = (req, res, next) => {
    journeyService.deleteOneJourney(req.params.id, req.auth.userId)
        .then(() => res.status(200).json({"message": "The journey has been deleted."}))
        .catch(error => {res.status(400).json(error); console.log(error)})
}

