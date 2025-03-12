const User = require('./userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Service_Response = require("../workspace/service_response.js")

/**
 * Create the mongoDB user with information from the data in the request, and completed with default data
 * that can be modified in modify function
 * @param reqUser the user transmitted from the request 
 * @returns 
 */
exports.createUser = async (reqUser) => {
    // Pour l'instant sans vérification de validité de données (TODO?)
    return await bcrypt.hash(reqUser.password, 10)
            .then(hash => {
                const user = new User({
                    email: reqUser.email,
                    password: hash,
                    isStudent: false,
                    dateBirthday: reqUser.dateBirthday,
                    aboutMe: undefined,
                    alternateEmail: undefined,
                    testimonial: undefined,
                    nonce: undefined,
                    imageUrl: undefined,

                    name: {
                        publicName: reqUser.name.firstName + " " + reqUser.name.lastName,
                        firstName: reqUser.name.firstName,
                        lastName: reqUser.name.lastName,
                    },

                    phone: {
                        type: reqUser.phone.type,
                        prefix: reqUser.phone.prefix,
                        number: reqUser.phone.number,
                        phoneExt: reqUser.phone.phoneExt,
                        phoneDescription: reqUser.phone.phoneDescription
                    },

                    rating: {
                        punctualityRating: undefined,
                        securityRating: undefined,
                        comfortRating: undefined,
                        courtesyRating: undefined
                    },

                    parameters: {
                        show: {
                            showAgePublically: false,
                            showEmailPublically: false,
                            showPhonePublically: false,
                        },
                        notification: {
                            sendNewsletter: false,
                            remindEvaluations: false, // Envoie un mail pour rappeler d'évaluer un trajet qu'on a eu
                            remindDeparture: false, // Envoie un mail pour vérifier l'identité de nos passagers avant d'embarquer
                        },
                        preferredLangage: reqUser.parameters.preferredLangage
                    },

                    statistics: {
                        nbRidesCompleted: 0,
                        nbKmTravelled: 0,
                        nbPeopleTravelledWith: 0,
                        nbTonsOfCO2Saved: 0,
                    },
                })
                return user.save()
                    .then(userData => {
                        userData.password = undefined
                        return new Service_Response(userData, 201)
                    })
                    .catch(error => new Service_Response(undefined, 400, true, error))
            })
            .catch(error => new Service_Response(undefined, 500, true, error))
}


/**
 * Checks if the user exists with the given email (throws an error otherwise), 
 * and compares passwords: throws an error if they are different, and returns the data to send
 * back to the user if correct 
 * @param userEmail the email of the user trying to connect
 * @param userPassword  the password of the user trying to connect
 * @returns the data to send back to the user, including the JWT token
 */
exports.verifyUserLogin = async (userEmail, userPassword) => {
    const errorObject = new Service_Response(undefined, 403, true, {
        "errors": {
            "user": {
                "code": "Wrong login or password",
                "name": "La paire login / mot de passe est incorrecte."
            }
        }
    })
    return await User.findOne({email: userEmail})
        .then(user => {
            if (user === null) {
                return errorObject
            } 
            else {
                return bcrypt.compare(userPassword, user.password)
                    .then(valid => {
                        if (!valid) {
                            return new Service_Response(undefined, 403, true, errorObject)
                        }
                        else {
                            return new Service_Response({
                                _id: user._id,
                                token: jwt.sign(
                                    {userId: user._id},
                                    process.env.JWT_KEY, 
                                    { expiresIn: '24h' }
                                )
                            })
                        }
                    })
                    .catch(error => new Service_Response(undefined, 500, true, error))
            }
        })
        .catch(error => new Service_Response(undefined, 400, true, error))
}


exports.modifyUser = async (newUser, userId) => {
    // Appelle la fonction associée pour chaque groupe de données (rootInfo, name, phone, ratings, parameters, statistics)
    // Avant tout ça, récupère le user pour éviter de faire 36 appels
    return await User.findOne({email: userEmail})
        .then(user => {
            if (user === null || user.id !== userId) {
                return new Service_Response(undefined, 404, true, {
                    "errors": {
                        "user": {
                            "code": "Not found",
                            "name": "L'utilisateur n'a pas été trouvé."
                        }
                    }
                })
            }

            // Ne gère pas une modification complète, seulement une modification spécifique à domaine (modif email,
            // password, phone, rating etc.)
            
            // Division des modifications et ordre de priorité:
            // 1. Email
            // 2. Password
            // 3. publicName + firstName + lastName + isStudent + dateBirthday + aboutMe + alternateEmail + testimonial + imageUrl
            // 4. Phone
            // 5. Rating
            // 6. Parameters
            // 7. Statistics

            if (newUser.email !== undefined) {
                updateEmail(user, newUser.email)
            }
            else if (newUser.password !== undefined) {
                updatePassword(user, newUser.password)
            }
            else if (
                newUser.name !== undefined
                && isStudent !== undefined
                && dateBirthday !== undefined
                && aboutMe !== undefined
                && alternateEmail !== undefined
                && testimonial !== undefined
                && imageUrl !== undefined
            ) {
                updateRootInfo(user, newUser) // Améliorer les params
            }
            else if (newUser.phone !== undefined) {
                updatePhone(user, newUser.phone)
            }
            else if (newUser.rating !== undefined) {
                updateRating(user, newUser.rating)
            }
            else if (newUser.parameters !== undefined) {
                updateParameters(user, newUser.parameters)
            }
            else if (newUser.statistics !== undefined) {
                updateStatistics(user, newUser.statistics)
            }
            else {
                return new Service_Response(undefined, 400, true, {
                    "errors": {
                        "user": {
                            "code": "missing-fields",
                            "name": "Certains attributs de la requête sont peut-être manquants."
                        }
                    }
                })
            }

            return user.save()
                .then(() => new Service_Response(undefined, 200))
                .catch(error => new Service_Response(undefined, 500, true, error))
        })
}


function updateRootInfo(user, rootInfo) {

}

function updatePhone(user, phoneInfo) {

}

function updateRating(user, ratingInfo) {

}

function updateParameters(user, parameterInfo) {

}

function updateStatistics(user, statisticInfo) {

}

function updateEmail(user, email) {
    // TODO
}

function updatePassword(user, password) {
    // TODO
}