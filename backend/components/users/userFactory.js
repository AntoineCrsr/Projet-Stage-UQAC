const User = require("./userModel")
const bcrypt = require("bcrypt")

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
                dateBirthday: null, 
                aboutMe: null,
                alternateEmail: null,
                testimonial: null,
                imageUrl: null,

                name: {
                    publicName: null,
                    firstName: null,
                    lastName: null
                },

                phone: {
                    type: null,
                    prefix: null,
                    number: null,
                    phoneExt: null,
                    phoneDescription: null
                },

                rating: {
                    punctualityRating: null,
                    securityRating: null,
                    comfortRating: null,
                    courtesyRating: null,
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
                hasVerifiedPhone: false,
                emailNonce: null,
                phoneNonce: null
            })
        })
}


/**
 * 
 * @param {User} user 
 * @param {string} firstName 
 * @param {string} lastName 
 * @param {string?} publicName 
 * @returns {User}
 */
exports.modifyName = (user, firstName, lastName, publicName) => {
    user.name.firstName = firstName
    user.name.lastName = lastName
    if (publicName == null) user.name.publicName = firstName + " " + lastName
    else user.name.publicName = publicName
    return user
}


/**
 * 
 * @param {User} user 
 * @param {string} dateBirthday 
 * @returns {User}
 */
exports.modifyBirth = (user, dateBirthday) => {
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
exports.modifyProfilePicture = (user, reqFile, reqProtocol, reqHost) => {
    user.imageUrl = `${reqProtocol}://${reqHost}/images/${reqFile.filename}`
    return user
}


/**
 * 
 * @param {User} user 
 * @param {string} email 
 * @returns {User}
 */
exports.modifyEmail = (user, email) => {
    user.email = email
    return user
}


/**
 * 
 * @param {User} user 
 * @param {string} password 
 * @returns {User}
 */
exports.modifyPassword = async (user, password) => {
    return await bcrypt.hash(password, 10)
        .then(hash => {
            user.password = hash
            return user
        })
        .catch(error => console.error(error))
}


/**
 * 
 * @param {User} user 
 * @param {string} preferredLangage 
 * @returns {User}
 */
exports.modifyPreferredLangage = (user, preferredLangage) => {
    user.parameters.preferredLangage = preferredLangage
    return user
}


/**
 * 
 * @param {Boolean} showAgePublically 
 * @param {Boolean} showEmailPublically 
 * @param {Boolean} showPhonePublically 
 * @returns {User}
 */
exports.modifyShowParameter = (user, showAgePublically, showEmailPublically, showPhonePublically) => {
    if (showAgePublically != undefined) user.parameters.show.showAgePublically = showAgePublically
    if (showEmailPublically != undefined) user.parameters.show.showEmailPublically = showEmailPublically
    if (showPhonePublically != undefined) user.parameters.show.showPhonePublically = showPhonePublically
    return user
}

/**
 * 
 * @param {Boolean} sendNewsletter 
 * @param {Boolean} remindEvaluations 
 * @param {Boolean} remindDeparture 
 * @returns {User}
 */
exports.modifyNotificationParameter = (user, sendNewsletter, remindEvaluations, remindDeparture) => {
    if (sendNewsletter != undefined) user.parameters.notification.sendNewsletter = sendNewsletter
    if (remindEvaluations != undefined) user.parameters.notification.remindEvaluations = remindEvaluations
    if (remindDeparture != undefined) user.parameters.notification.remindDeparture = remindDeparture
    return user
}



/**
 * 
 * @param {User} user 
 * @param {string} aboutMe 
 * @returns {User}
 */
exports.modifyAboutMe = (user, aboutMe) => {
    user.aboutMe = aboutMe
    return user
}


/**
 * 
 * @param {User} user 
 * @param {string} alternateEmail 
 * @returns {User}
 */
exports.modifyAlternateEmail = (user, alternateEmail) => {
    user.alternateEmail = alternateEmail
    return user
}


/**
 * 
 * @param {User} user 
 * @param {string} testimonial 
 * @returns {User}
 */
exports.modifyTestimonial = (user, testimonial) => {
    user.testimonial = testimonial
    return user
}