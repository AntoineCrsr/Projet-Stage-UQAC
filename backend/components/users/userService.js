const User = require('./userModel')
const bcrypt = require('bcrypt')

exports.createUser = (reqUser) => {
    // Pour l'instant sans vérification de données
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
            })
            .catch(error => {throw error})
}

function verifyInformation(inf) {
    /*
    First name,
    Last name,
    City,
    Email,
    Password,
    Birth date,
    Phone number (type, prefix, number, ext)
    */
   // TODO: Vérifie les informations données par l'utilisateur, notamment le format, l'existance de la ville,
   // l'unicité du téléphone, validation du préfix, du type ect. 
   return true;
}