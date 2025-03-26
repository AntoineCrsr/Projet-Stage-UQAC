const User = require("./userModel")

/**
 * 
 * @param {string} email 
 * @param {string} password 
 * @returns {User}
 */
exports.createUser = async (email, password, preferredLangage="FR") => {
    return await bcrypt.hash(password, 10)
        .then(hash => {
            return new User({
                email: email,
                password: hash,
                isStudent: false,

                rating: {
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
                        remindEvaluations: false,
                        remindDeparture: false,
                    },
                    preferredLangage: preferredLangage
                },

                statistics: {
                    nbRidesCompleted: 0,
                    nbKmTravelled: 0,
                    nbPeopleTravelledWith: 0,
                    nbTonsOfCO2Saved: 0,
                },

                hasVerifiedEmail: false,
                hasVerifiedPhone: false
            })
        })
}


/**
 * 
 * @param {User} user 
 * @param {string} firstName 
 * @param {string} lastName 
 * @param {string} dateBirthday 
 * @returns {User}
 */
exports.modifyNameAndBirth = (user, firstName, lastName, dateBirthday) => {
    user.name.firstName = firstName
    user.name.lastName = lastName
    user.name.publicName = firstName + " " + lastName
    user.dateBirthday = dateBirthday
    return user
}


/**
 * 
 * @param {User} user 
 * @param {string} type 
 * @param {string} prefix 
 * @param {string} number 
 * @param {string} phoneExt 
 * @param {string} phoneDescription 
 * @returns {User}
 */
exports.modifyPhone = (user, type, prefix, number, phoneExt, phoneDescription) => {
    user.phone.type = type
    user.phone.prefix = prefix
    user.phone.number = number
    user.phone.phoneExt = phoneExt
    user.phone.phoneDescription = phoneDescription
    return user
}


/**
 * 
 * @param {User} user 
 * @param {Boolean} isStudent 
 * @returns {User}
 */
exports.modifyIsStudent = (user, isStudent) => {
    user.isStudent = isStudent
    return user
}


/**
 * 
 * @param {User} user 
 * @param {string} imageUrl 
 * @returns {User}
 */
exports.modifyProfilePicture = (user, imageUrl) => {
    user.imageUrl = imageUrl
    return user
}

/**
 * Etapes de création d'un User:
 * 1. Email, password, preferredLangage
 * 2. Name + dateBirth
 * 3. Phone
 * 4. isStudent
 * 5. Profile Picture
 */

/**
 * Modification (par groupe):
 * // TODO
 */


/*
return new User({
                email: email,
                password: hash,
                isStudent: false,
                dateBirthday: undefined,
                aboutMe: undefined,
                alternateEmail: undefined,
                testimonial: undefined,
                imageUrl: undefined,

                name: {
                    publicName: undefined,
                    firstName: undefined,
                    lastName: undefined,
                },

                phone: {
                    type: undefined,
                    prefix: undefined,
                    number: undefined,
                    phoneExt: undefined,
                    phoneDescription: undefined
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
                        remindEvaluations: false,
                        remindDeparture: false,
                    },
                    preferredLangage: preferredLangage
                },

                statistics: {
                    nbRidesCompleted: 0,
                    nbKmTravelled: 0,
                    nbPeopleTravelledWith: 0,
                    nbTonsOfCO2Saved: 0,
                },

                emailNonce: undefined,
                phoneNonce: undefined,
                hasVerifiedEmail: false,
                hasVerifiedPhone: false
            })
        })
            */