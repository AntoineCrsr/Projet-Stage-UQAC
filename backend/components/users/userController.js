const userService = require("./userService")
require("dotenv").config();

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
    userService.modifyUser(req.body.user, req.params.id, req.auth.userId)
        .then(service_response => service_response.buildSimpleResponse(res))
}