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
                        courtesyRating: undefined,
                        nbRating: 0
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


/**
 * Ne gère pas une modification complète, seulement une modification spécifique à domaine (modif email,
 * password, phone, rating)
 * Division des modifications et ordre de priorité:
 * 1. Email
 * 2. Password
 * 3. publicName + firstName + lastName + isStudent + dateBirthday + aboutMe + alternateEmail + testimonial + imageUrl
 * 4. Phone
 * 5. Rating
 * 6. Parameters
 * @param newUser L'utilisateur passé dans la requete
 * @param userId  L'id de l'utilisateur de la requete PUT
 * @param userAuthId  L'id de l'utilisateur du token JWT
 * @returns un Service_Response adapté
 * */
exports.modifyUser = async (newUser, userId, userAuthId) => {
    // Appelle la fonction associée pour chaque groupe de données (rootInfo, name, phone, ratings, parameters, statistics)
    // Avant tout ça, récupère le user pour éviter de faire 36 appels
    if (userId !== userAuthId) {
        return new Service_Response(undefined, 401, true, {
            "errors": {
                "user": {
                    "code": "Not authorized",
                    "name": "L'utilisateur connecté tente de modifier un autre utilisateur."
                }
            }
        })
    }
    return await User.findOne({_id: userId})
        .then(async user => {
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

            // Vérifie et dirige les infos
            if (newUser.email !== undefined) {
                updateEmail(user, newUser.email)
            }
            else if (newUser.password !== undefined) {
                await updatePassword(user, newUser.password)
            }
            else if (
                newUser.name !== undefined
                && newUser.name.publicName !== undefined
                && newUser.name.firstName !== undefined
                && newUser.name.lastName !== undefined
                && newUser.isStudent !== undefined
                && newUser.dateBirthday !== undefined
            ) {
                updateRootInfo(user, newUser) // Améliorer les params
            }
            else if (
                newUser.phone !== undefined
                && newUser.phone.type !== undefined
                && newUser.phone.prefix !== undefined
                && newUser.phone.number !== undefined
            ) {
                updatePhone(user, newUser.phone)
            }
            else if (newUser.rating !== undefined) {
                updateRating(user, newUser.rating)
            }
            else if (newUser.parameters !== undefined) {
                updateParameters(user, newUser.parameters)
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
                .then(() => (new Service_Response(user, 200)))
                .catch(error => new Service_Response(undefined, 500, true, error))
        })
}


function updateRootInfo(user, rootInfo) {
   // TODO vérifications
   user.name = rootInfo.name
   user.isStudent = rootInfo.isStudent
   user.dateBirthday = rootInfo.dateBirthday
   user.aboutMe = rootInfo.aboutMe
   user.alternateEmail = rootInfo.alternateEmail
   user.testimonial = rootInfo.testimonial
   // Image non gérée
}


function updatePhone(user, phoneInfo) {
    // TODO Verification d'info 
    user.phone = phoneInfo
}


function updateRating(user, ratingInfo) {
    // Caclule les nouvelles statistiques en supposant vraie la formule suivante:
    // newRating = (previous * nbPrevious + newBornRating) / nbPreviousRating+1
    // nbRating += 1
    // TODO Verification d'info 

    nbRating = user.rating.nbRating

    // Si on n'a jamais eu d'avis, on doit setup un nombre pour qu'il prenne le type
    if (nbRating == 0) {
        user.rating.punctualityRating = 0
        user.rating.securityRating = 0
        user.rating.comfortRating = 0
        user.rating.courtesyRating = 0
    }

    newPunctualityRating = ((user.rating.punctualityRating * nbRating) + ratingInfo.punctualityRating)/(nbRating+1)
    newSecurityRating = ((user.rating.securityRating * nbRating) + ratingInfo.securityRating)/(nbRating+1)
    newComfortRating = ((user.rating.comfortRating * nbRating) + ratingInfo.comfortRating)/(nbRating+1)
    newCourtesyRating = ((user.rating.courtesyRating * nbRating) + ratingInfo.courtesyRating)/(nbRating+1)
    
    user.rating.punctualityRating = newPunctualityRating
    user.rating.securityRating = newSecurityRating
    user.rating.comfortRating = newComfortRating
    user.rating.courtesyRating = newCourtesyRating
    user.rating.nbRating++
}


function updateParameters(user, parameterInfo) {
    // TODO Verification d'info
    if (parameterInfo.show !== undefined) {
        if (parameterInfo.show.showAgePublically !== undefined) {
            user.parameters.show.showAgePublically = parameterInfo.show.showAgePublically
        }
        if (parameterInfo.show.showEmailPublically !== undefined) {
            user.parameters.show.showEmailPublically = parameterInfo.show.showEmailPublically
        }
        if (parameterInfo.show.showPhonePublically !== undefined) {
            user.parameters.show.showPhonePublically = parameterInfo.show.showPhonePublically
        }
    }

    if (parameterInfo.notification !== undefined) {
        if (parameterInfo.notification.sendNewsletter !== undefined) {
            user.parameters.notification.sendNewsletter = parameterInfo.notification.sendNewsletter
        }
        if (parameterInfo.notification.remindEvaluations !== undefined) {
            user.parameters.notification.remindEvaluations = parameterInfo.notification.remindEvaluations
        }
        if (parameterInfo.notification.remindDeparture !== undefined) {
            user.parameters.notification.remindDeparture = parameterInfo.notification.remindDeparture
        }
    }

    if (parameterInfo.preferredLangage !== undefined) {
        user.parameters.preferredLangage = parameterInfo.preferredLangage
    }
}

function updateEmail(user, email) {
    // TODO Verification d'info 
    user.email = email
    sendEmailValidation()
}

async function updatePassword(user, password) {
    await bcrypt.hash(password, 10)
        .then(hash => {
            user.password = hash
        })
}

function sendEmailValidation() {
    // TODO
}

/*
Chaque fonction doit:
1. Vérifier les infos
2. Modifier le user
*/