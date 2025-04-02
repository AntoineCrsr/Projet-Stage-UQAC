const userService = require("./userService")


/**
 * Retourne les données de l'utilisateur dont l'id est en paramètres
 * @param {object} req 
 * @param {object} res 
 * @param {Function} next 
 */
exports.getUser = (req, res, next) => {
    userService.getUser(req.params.id, req.query.private, req.auth ? req.auth.userId : null)
        .then(service_response => service_response.buildSimpleResponse(res))
}


/**
 * Crée un user selon userService
 * @param {object} req 
 * @param {object} res 
 * @param {Function} next 
 */
exports.signup = (req, res, next) => {
    if (typeof req.body.user == "string") { // Formdata avec image (body multipart)
        user = JSON.parse(req.body.user)
    } else { // Body json 
        user = req.body.user
    }
    userService.createUser(user)
        .then(service_response => service_response.buildLocationResponse(res))
}

/**
 * Connecte un user selon userService
 * @param {object} req 
 * @param {object} res 
 * @param {Function} next 
 */
exports.login = (req, res, next) => {
    userService.verifyUserLogin(req.body.user)
        .then(service_response => service_response.buildSimpleResponse(res))
}


/**
 * Modifie un user selon userService
 * @param {object} req 
 * @param {object} res 
 * @param {Function} next 
 */
exports.modify = (req, res, next) => {
    console.log(req.auth)
    userService.modifyUser(req.body.user, req.params.id, req.auth ? req.auth.userId : null, req.file, req.protocol, req.get('host'))
        .then(service_response => service_response.buildSimpleResponse(res))
}


/**
 * @param {object} req 
 * @param {object} res 
 * @param {Function} next 
 */
exports.verifyEmailNonce = (req, res, next) => {
    userService.verifyNonce(req.body.user, req.params.id, req.auth ? req.auth.userId : null, "email")
        .then(service_response => service_response.buildSimpleResponse(res))
}

/**
 * @param {object} req 
 * @param {object} res 
 * @param {Function} next 
 */
exports.verifyPhoneNonce = (req, res, next) => {
    userService.verifyNonce(req.body.user, req.params.id, req.auth ? req.auth.userId : null, "phone")
        .then(service_response => service_response.buildSimpleResponse(res))
}