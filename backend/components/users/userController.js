const userService = require("./userService")
require("dotenv").config();


exports.getUser = (req, res, next) => {
    userService.getUser(req.params.id)
        .then(service_response => service_response.buildSimpleResponse(res))
}


/**
 * Crée un user selon userService
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.signup = (req, res, next) => {
    if (typeof req.body.user == "string") { // Formdata avec image (body multipart)
        user = JSON.parse(req.body.user)
    } else { // Body json 
        user = req.body.user
    }
    userService.createUser(user)
        .then(service_response => service_response.buildSimpleResponse(res))
}

/**
 * Connecte un user selon userService
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.login = (req, res, next) => {
    userService.verifyUserLogin(req.body.user.email, req.body.user.password)
        .then(service_response => service_response.buildSimpleResponse(res))
}


/**
 * Modifie un user selon userService
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.modify = (req, res, next) => {
    userService.modifyUser(req.body.user, req.params.id, req.auth.userId, req.file, req.protocol, req.get('host'))
        .then(service_response => service_response.buildSimpleResponse(res))
}


/**
 * Prend une req qui contient le nonce de l'utilisateur connecté (token dans authentification)
 * puis valide le num de téléphone, et si déjà vérifié, valide l'email. 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.verify = (req, res, next) => {
    userService.verifyNonce(req.body.user, req.auth.userId)
        .then(service_response => service_response.buildSimpleResponse(res))
}