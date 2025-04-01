const ErrorReport = require("../../workspace/ErrorReport")
const EmailVerifier = require("./emailVerifier")
const PhoneVerifier = require("./phoneVerifier")
const errorTable = require("./UserErrors.json")
const userSeeker = require("../userSeeker")

/**
 * 
 * @param {any} userId 
 * @returns {ErrorReport}
 */
exports.getOneUserError = (userId) => {
    // Missing fields
    if (userId == undefined) {
        return new ErrorReport(true, errorTable["missingId"])
    }

    // Type error (ceci ne devrait jamais arriver vu que normalement le req.params est systématiquement un string)
    if (typeof(userId) !== "string") {
        return new ErrorReport(true, errorTable["typeError"])
    }
    
    return new ErrorReport(false)
}


exports.userCreationError = async (req) => {
    // Présence de tous les champs nécessaires
    if (req == undefined
        || typeof(req) !== "object"
        || req.email == undefined
        || req.password == undefined
    ) {
        return new ErrorReport(true, errorTable["missingArg"])
    }

    // Type des valeurs
    if (typeof(req.email) !== "string"
        || typeof(req.password) !== "string"
        || (req.preferredLangage != undefined && typeof(req.preferredLangage) !== "string")
    ) {
        return new ErrorReport(true, errorTable["typeError"])
    }

    // Bon sens des valeurs
    if (!EmailVerifier.verifyEmail(req.email))
        return new ErrorReport(true, errorTable["badEmail"])

    // Présence des attributs dans la db
    return await userSeeker.emailExists(req.email)
        .then(alreadyExist => alreadyExist ? 
            new ErrorReport(true, errorTable["emailAlreadyExists"])
            : new ErrorReport(false)
        )
}


/**
 * 
 * @param {any} userEmail 
 * @param {any} userPassword 
 * @returns {ErrorReport}
 */
exports.userLoginInput = (userEmail, userPassword) => {
    if (userEmail == undefined
        || userPassword == undefined
    )
        return new ErrorReport(true, errorTable["loginBadArgs"])

    if (typeof(userEmail) !== "string"
    || typeof(userPassword) !== "string") 
        return new ErrorReport(true, errorTable["loginBadArgs"])
    
    return new ErrorReport(false)
}


/**
 * 
 * @param {any} user 
 * @returns {ErrorReport}
 */
exports.getErrorForNullUserLogin = (user) => {
    if (user == null) return new ErrorReport(true, errorTable["badLoginPassword"])
    return new ErrorReport(false)
} 

/**
 * 
 * @param {any} token 
 * @returns {ErrorReport}
 */
exports.getErrorForNullTokenLogin = (token) => {
    if (token == null) return new ErrorReport(true, errorTable["badLoginPassword"])
        return new ErrorReport(false)
}

/**
 * Teste l'authentifaication
 * @param {string} userId 
 * @param {string} userAuthId 
 * @returns {ErrorReport}
 */
exports.verifyAuthentication = (userId, userAuthId) => {
    if (userId != userAuthId) {
        return new ErrorReport(true, errorTable["unauthorizedError"])
    }
    return new ErrorReport(false)
}


exports.getModificationError = (newUser, userId, userAuthId, reqFile, reqProtocol, reqHost) => {
    // Attributs obligatoires
    if (userId == undefined || userAuthId == undefined) return new ErrorReport(true, errorTable["missingLogin"])

    // Vérification qu'il y ait au moins une modification possible
    if (newUser == undefined && (reqFile == undefined || reqProtocol == undefined || reqHost == undefined))
        return new ErrorReport(true, errorTable["missingArgModify"])

    // Au moins un des attributs est présent dans newUser
    if (newUser != undefined 
        && newUser.email == undefined
        && newUser.password == undefined
        && newUser.name == undefined
        && newUser.phone == undefined
        && newUser.isStudent == undefined
        && newUser.parameters == undefined
        && newUser.dateBirthday == undefined
        && newUser.aboutMe == undefined
        && newUser.alternateEmail == undefined
        && newUser.testimonial == undefined
    ) return new ErrorReport(true, errorTable["missingArgModify"])
    
    // Type des paramètres
    if ((newUser != undefined && typeof(newUser) !== "object")
        && (newUser.email == undefined && typeof(newUser.email) !== "string")
        && (newUser.password == undefined && typeof(newUser.password) !== "string")
        && (newUser.name == undefined && typeof(newUser.name) !== "string")
        && (newUser.phone == undefined && typeof(newUser.phone) !== "object")
        && (newUser.isStudent == undefined && typeof(newUser.isStudent) !== "boolean")
        && (newUser.parameters == undefined && typeof(newUser.parameters) !== "object")
        && (newUser.dateBirthday == undefined && typeof(newUser.dateBirthday) !== "string")
        && (newUser.aboutMe == undefined && typeof(newUser.aboutMe) !== "string")
        && (newUser.alternateEmail == undefined && typeof(newUser.alternateEmail) !== "string")
        && (newUser.testimonial == undefined && typeof(newUser.testimonial) !== "string")
    ) return new ErrorReport(true, errorTable["typeError"])
    
    // Vérification de l'email
    if (newUser.email != undefined
        && !EmailVerifier.verifyEmail(newUser.email)
    ) return new ErrorReport(true, errorTable["badEmail"])

    // Vérification du téléphone
    if (newUser.phone != undefined
        && !PhoneVerifier.verifyPhone(newUser.phone)
    ) return new ErrorReport(true, errorTable["badPhone"])

    // Vérification des paramètres
    if (newUser.parameters != undefined
        && (newUser.parameters.show != undefined)
            && ((newUser.parameters.show.showAgePublically != null && typeof(newUser.parameters.show.showAgePublically) !== "boolean")
             && (newUser.parameters.show.showEmailPublically != null && typeof(newUser.parameters.show.showEmailPublically) !== "boolean")
             && (newUser.parameters.show.showPhonePublically != null && typeof(newUser.parameters.show.showPhonePublically) !== "boolean"))
        && (newUser.parameters.notification != undefined)
            && ((newUser.parameters.notification.sendNewsletter != null && typeof(newUser.parameters.notification.sendNewsletter) !== "boolean")
             && (newUser.parameters.notification.remindEvaluations != null && typeof(newUser.parameters.notification.remindEvaluations) !== "boolean")
             && (newUser.parameters.notification.remindDeparture != null && typeof(newUser.parameters.notification.remindDeparture) !== "boolean"))
    ) return new ErrorReport(true, errorTable["typeError"])

    return new ErrorReport(false)
}


/**
 * 
 * @param {object} reqUser 
 * @param {string} userId 
 * @param {string} userAuthId 
 * @returns {ErrorReport}
 */
exports.getNonceVerifError = (reqUser, userId, userAuthId) => { 
    if (userAuthId == undefined) 
        return new ErrorReport(true, errorTable["missingLogin"])

    if (userId == undefined)
        return new ErrorReport(true, errorTable["thisShouldNotHappen"])
    
    if (reqUser == undefined || reqUser.nonce == undefined)
        return new ErrorReport(true, errorTable["nonceMissing"])

    return new ErrorReport(false)
}


/**
 * 
 * @param {string} dbNonce 
 * @param {string} reqNonce 
 * @returns {ErrorReport}
 */
exports.getNonceEqualsError = (dbNonce, reqNonce) => {
    if (dbNonce == null)
        return new ErrorReport(true, errorTable["nonceVerifNotRequired"])

    if (dbNonce !== reqNonce)
        return new ErrorReport(true, errorTable["nonceNotEquals"])

    return new ErrorReport(false)
}


/**
 * 
 * @param {User} user 
 * @param {object} reqPhone 
 * @returns {Promise}
 */
exports.getPhoneModificationError = async (userPhone, reqPhone) => {
    return await userSeeker.phoneExists(reqPhone)
        .then(phoneExists => {
            if (userPhone.prefix == reqPhone.prefix && userPhone.number == reqPhone.number) return new ErrorReport(false)
            return phoneExists ? new ErrorReport(true, errorTable["phoneAlreadyExists"]) 
                        : new ErrorReport(false)
        })
}

exports.getEmailModificationError = async (userEmail, reqEmail) => {
    return await userSeeker.emailExists(reqEmail)
        .then(alreadyExist => {
            if (userEmail === reqEmail) return new ErrorReport(false)
            return alreadyExist ? new ErrorReport(true, errorTable["emailAlreadyExists"])
            : new ErrorReport(false)
        }
)
}

exports.getUserNotFoundError = (user) => {
    if (user == null) return new ErrorReport(true, errorTable["userNotFound"]) 
    return new ErrorReport(false)
}

exports.getModificationErrorKnowingUser = async (user, newUser) => {
    if (newUser.phone != undefined) {
        const phoneError = await this.getPhoneModificationError(user.phone, newUser.phone)
        if (phoneError.hasError) return phoneError
    }

    if (newUser.email != undefined) {
        const emailError = await this.getEmailModificationError(user.email, newUser.email)
        if (emailError.hasError) return emailError
    }
    
    return new ErrorReport(false)
}