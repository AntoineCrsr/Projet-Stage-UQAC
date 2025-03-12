require("dotenv").config();
const journeyService = require("./journeyService")

/**
 * Créer un Journey selon journeyService
 * Nécessite le token JWT, preuve de la connexion du user
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.createJourney = (req, res, next) => {
    journeyService.createJourney(req.body.journey, req.auth.userId)
        .then(service_response => service_response.buildLocationResponse(res))
}

/**
 * Renvoie un tableau des (au plus) 20 derniers journeys
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getLastJourneys = (req, res, next) => {
    journeyService.getLastJourneys(20)
        .then(service_response => service_response.buildSimpleResponse(res))
}

/**
 * Renvoie la journey dont l'id est à /api/journey/id
 */
exports.getOneJourney = (req, res, next) => {
    journeyService.getOneJourney(req.params.id)
        .then(service_response => service_response.buildSimpleResponse(res))
}

/**
 * Modifie la journey selon journeyService, à l'id passée en param à /api/journey/id
 */
exports.modifyOneJourney = (req, res, next) => {
    journeyService.modifyOneJourney(req.params.id, req.body.journey, req.auth.userId)
        .then(service_response => service_response.buildLocationResponse(res))
}

/**
 * Supprime la journey selon journeyService
 */
exports.deleteOneJourney = (req, res, next) => {
    journeyService.deleteOneJourney(req.params.id, req.auth.userId)
        .then(service_response => service_response.buildSimpleResponse(res))
}

