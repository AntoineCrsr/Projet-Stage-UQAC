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
 * @param {string?} publicName 
 * @returns {User}
 */
exports.modifyName = (user, firstName, lastName, publicName) => {
    user.name.firstName = firstName
    user.name.lastName = lastName
    if (publicName != null) user.name.publicName = firstName + " " + lastName
    else user.name.publicName = publicName
    return user
}


/**
 * 
 * @param {User} user 
 * @param {string} dateBirthday 
 */
exports.modifyBirth = (user, dateBirthday) => {
    user.dateBirthday = dateBirthday
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
exports.modifyShowParameter = (showAgePublically, showEmailPublically, showPhonePublically) => {
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
exports.modifyNotificationParameter = (sendNewsletter, remindEvaluations, remindDeparture) => {
    if (sendNewsletter != undefined) user.parameters.notification.sendNewsletter = sendNewsletter
    if (remindEvaluations != undefined) user.parameters.notification.remindEvaluations = remindEvaluations
    if (remindDeparture != undefined) user.parameters.notification.remindDeparture = remindDeparture
    return user
}