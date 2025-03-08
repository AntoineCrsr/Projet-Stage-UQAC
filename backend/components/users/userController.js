const userService = require("./userService")
require("dotenv").config();

/**
 * Crée un user selon userService
 * 201 si le user est créé
 * 500 sinon
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
    .then(user => res.status(201).json({"message": "user created!", "user": user}))
    .catch(error => res.status(500).json(error));
}

/**
 * Connecte un user selon userService
 * 200 si la connection a réussi, avec le token JWT et l'id user dans le data 
 * 500 sinon
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.login = (req, res, next) => {
    userService.verifyUserLogin(req.body.user.email, req.body.user.password)
        .then(data => {
            res.status(200).json(data)
        })
        .catch(error => res.status(500).json(error))
}


exports.modify = (req, res, next) => {
    // Appelle userService.modifyUser()
}