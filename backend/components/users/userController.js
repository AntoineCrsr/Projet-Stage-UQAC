const userService = require("./userService")
require("dotenv").config();

exports.signup = (req, res, next) => {
    userService.createUser(req.body.user)
    .then(user => res.status(201).json({"message": "user created!", "user": user}))
    .catch(error => res.status(500).json(error));
}

exports.login = (req, res, next) => {
    userService.verifyUserLogin(req.body.user.email, req.body.user.password)
        .then(data => {
            res.status(200).json(data)
        })
        .catch(error => res.status(500).json(error))
}