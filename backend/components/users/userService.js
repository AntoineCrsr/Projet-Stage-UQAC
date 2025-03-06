const User = require('./userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

/**
 * Create the mongoDB user with information from the data in the request, and completed with default data
 * that can be modified in modify function
 * @param reqUser the user transmitted from the request 
 * @returns the promise of the user save
 */
exports.createUser = (reqUser) => {
    // Pour l'instant sans vérification de validité de données (TODO?)
    return bcrypt.hash(reqUser.password, 10)
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
                        return userData
                    })
                    .catch(error => {throw error})
            })
            .catch(error => {throw error})
}


/**
 * Checks if the user exists with the given email (throws an error otherwise), 
 * and compares passwords: throws an error if they are different, and returns the data to send
 * back to the user if correct 
 * @param userEmail the email of the user trying to connect
 * @param userPassword  the password of the user trying to connect
 * @returns the data to send back to the user, including the JWT token
 */
exports.verifyUserLogin = (userEmail, userPassword) => {
    const messageError = "Incorrect login or password"
    return User.findOne({email: userEmail})
        .then(user => {
            if (user === null) {
                throw new Error("User not found.")
            } 
            else {
                return bcrypt.compare(userPassword, user.password)
                    .then(valid => {
                        if (!valid) {
                            throw new Error(messageError)
                        }
                        else {
                            return {
                                _id: user._id,
                                token: jwt.sign(
                                    {userId: user._id},
                                    process.env.JWT_KEY, 
                                    { expiresIn: '24h' }
                                )
                            }
                        }
                    })
                    .catch(error => { throw error })
            }
        })
        .catch(error => { throw error })
}