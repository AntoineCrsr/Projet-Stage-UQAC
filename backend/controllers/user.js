const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

exports.signup = (req, res, next) => {
    console.log(req)
    // Note: le problême de l'interface actuellement c'est que la req est pas conforme à l'objet req qu'on attend
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                phone: req.body.phone,
                verifiedPermit: false,
                password: hash
            })
            user.save()
                .then(() => res.status(201).json({message: "User created !"}))
                .catch(error => res.status(400).json(error))
        })
        .catch(error => res.status(500).json(error))
}

exports.login = (req, res, next) => {
    const messageError = "Incorrect login or password"
    User.findOne({email: req.body.email})
        .then(user => {
            if (user === null) {
                res.status(401).json({message: messageError})
            } 
            else {
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            res.status(401).json({message: messageError})
                        }
                        else {
                            res.status(200).json({
                                _id: user._id,
                                token: jwt.sign(
                                    {userId: user._id},
                                    // Note: Ceci est la clé de déchiffrement JWT, en production elle devra être un peu plus sécurisée, auquel cas modifier aussi dans le middleware auth
                                    'RANDOM_KEY', 
                                    { expiresIn: '24h' }
                                )
                            })
                        }
                    })
                    .catch(error => res.status(500).json(error)) // note: error d'exécution
            }
        })
        .catch(error => res.status(500).json(error))
}