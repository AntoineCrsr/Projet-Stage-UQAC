const userService = require("./userService")


/**
 * Retourne les données de l'utilisateur dont l'id est en paramètres
 * @param {object} req 
 * @param {object} res 
 * @param {Function} next 
 */
exports.getUser = (req, res, next) => {
    userService.getUser(req.params.id, req.query.private, req.auth ? req.auth.userId : null)
        .then(service_response => service_response.buildResponse(res))
}


/**
 * Crée un user selon userService
 * @param {object} req 
 * @param {object} res 
 * @param {Function} next 
 */
exports.signup = (req, res, next) => {
    userService.createUser(req.body.user)
        .then(service_response => service_response.buildResponse(res))
}

/**
 * Connecte un user selon userService
 * @param {object} req 
 * @param {object} res 
 * @param {Function} next 
 */
exports.login = (req, res, next) => {
    userService.verifyUserLogin(req.body.user)
        .then(service_response => service_response.buildResponse(res))
}


/**
 * Modifie un user selon userService
 * @param {object} req 
 * @param {object} res 
 * @param {Function} next 
 */
exports.modify = (req, res, next) => {
    let user = req.body.user
    if (typeof user === 'string') {
            user = JSON.parse(user);
    }
    userService.modifyUser(user, req.params.id, req.auth ? req.auth.userId : null, req.file, req.protocol, req.get('host'))
        .then(service_response => service_response.buildResponse(res))
}


/**
 * @param {object} req 
 * @param {object} res 
 * @param {Function} next 
 */
exports.verifyEmailNonce = (req, res, next) => {
    userService.verifyNonce(req.body.user, req.params.id, req.auth ? req.auth.userId : null, "email")
        .then(service_response => service_response.buildResponse(res))
}

/**
 * @param {object} req 
 * @param {object} res 
 * @param {Function} next 
 */
exports.verifyPhoneNonce = (req, res, next) => {
    userService.verifyNonce(req.body.user, req.params.id, req.auth ? req.auth.userId : null, "phone")
        .then(service_response => service_response.buildResponse(res))
}