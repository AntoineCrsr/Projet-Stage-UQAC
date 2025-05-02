const ErrorReport = require("../workspace/ErrorReport")
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
                email: email.toLowerCase(),
                password: hash,
                isStudent: false,
                dateBirthday: null, 
                aboutMe: null,
                alternateEmail: null,
                testimonial: null,
                imageUrl: null,
                gender: null,

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
                emailNonce: "000",
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
    let isChangingNumber = user.phone.number !== number
    user.phone.type = type
    user.phone.prefix = prefix
    user.phone.number = number
    user.phone.phoneExt = phoneExt
    user.phone.phoneDescription = phoneDescription

    if (isChangingNumber) {
        user.phoneNonce = "000"
        user.hasVerifiedPhone = false
    }
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
    if (user.email === email) return user
    user.email = email.toLowerCase()
    user.emailNonce = "000"
    user.hasVerifiedEmail = false
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
    user.parameters.preferredLangage = preferredLangage.toLowerCase()
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


exports.validateNonceEmail = (user) => {
    user.hasVerifiedEmail = true
    user.emailNonce = null
    return user
}

exports.validateNoncePhone = (user) => {
    user.hasVerifiedPhone = true
    user.phoneNonce = null
    return user
}

exports.modifyGender = (user, gender) => {
    user.gender = gender.toLowerCase()
    return user
}



exports.updateRating = (user, punctualityRating, securityRating, comfortRating, courtesyRating) => {
    if (user.rating.nbRating === 0) {
        user.rating.punctualityRating = punctualityRating    
        user.rating.securityRating = securityRating
        user.rating.comfortRating = comfortRating
        user.rating.courtesyRating = courtesyRating
    } 
    // newMoy = (ancMoy * card(ancMoy) + newVal) / (card(ancMoy) + 1) puis card(ancMoy)++
    user.rating.punctualityRating = (punctualityRating + user.rating.punctualityRating * user.rating.nbRating) / (user.rating.nbRating+1) 
    user.rating.securityRating = (securityRating + user.rating.securityRating * user.rating.nbRating) / (user.rating.nbRating+1)
    user.rating.comfortRating = (comfortRating + user.rating.comfortRating * user.rating.nbRating) / (user.rating.nbRating+1)
    user.rating.courtesyRating = (courtesyRating + user.rating.courtesyRating * user.rating.nbRating) / (user.rating.nbRating+1)
    user.rating.nbRating++
}


exports.undoRating = (user, punctualityRating, securityRating, comfortRating, courtesyRating) => {
    if (user.rating.nbRating === 1) {
        user.rating.punctualityRating = null    
        user.rating.securityRating = null
        user.rating.comfortRating = null
        user.rating.courtesyRating = null
        user.rating.nbRating = 0
        return
    }
    // newMoy = (ancMoy * card(ancMoy) - newVal) / (card(ancMoy) - 1) puis card(ancMoy)--
    user.rating.punctualityRating = (user.rating.punctualityRating * user.rating.nbRating - punctualityRating) / (user.rating.nbRating-1) 
    user.rating.securityRating = (user.rating.securityRating * user.rating.nbRating - securityRating) / (user.rating.nbRating-1)
    user.rating.comfortRating = (user.rating.comfortRating * user.rating.nbRating - comfortRating) / (user.rating.nbRating-1)
    user.rating.courtesyRating = (user.rating.courtesyRating * user.rating.nbRating - courtesyRating) / (user.rating.nbRating-1)
    user.rating.nbRating--
}