const UserSeeker = require("./userSeeker.js")
const UserFactory = require("./userFactory.js")
const Service_Response = require("../workspace/service_response.js")

const UserErrorManager = require("./UserError/UserErrorManager.js")
const UserConnexionManager = require("./UserConnexionManager.js")


/**
 * 
 * @param {string} userId 
 * @returns {Service_Response}
 */
exports.getUser = async (userId) => {
    const reqError = UserErrorManager.getOneUserError(userId)
    if (reqError.hasError) 
        return new Service_Response(undefined, 400, true, reqError.error)

    return await UserSeeker.getOneUser(userId)
        .then(user => new Service_Response(user, 302))
        .catch(error => new Service_Response(undefined, 404, true))
}


/**
 * @param {object} reqUser
 * @returns {Service_Response}
 */
exports.createUser = async (reqUser) => {
    const report = await UserErrorManager.userCreationError(reqUser)
    if (report.hasError) return new Service_Response(undefined, 400, true, report.error)

    return UserFactory.createUser(reqUser.email, reqUser.password, reqUser.preferredLangage)
        .then(user => {
            return user.save()
                .then(userData => {
                    return this.verifyUserLogin(reqUser)
                        .then(loginResponse => {
                            if (loginResponse.has_error) return new Service_Response(undefined, 400, true, loginResponse.error_object)
                            return loginResponse.setLocation("/auth/" + userData._id)
                        })
                        .catch(error => new Service_Response(undefined, 500, true, error))
                })
                .catch(error => new Service_Response(undefined, 400, true, error))
        })
        .catch(error => new Service_Response(undefined, 500, true, error))
}


/**
 * 
 * @param {User} reqUser
 * @returns {Service_Response}
 */
exports.verifyUserLogin = async (reqUser) => {
    const inputError = UserErrorManager.userLoginInput(reqUser.email, reqUser.password)
    if (inputError.hasError) return new Service_Response(undefined, 400, true, inputError.error)

    return await UserSeeker.getOneUserByEmail(reqUser.email)
        .then(user => {
            // Vérification que l'utilisateur existe
            const isUserNullReport = UserErrorManager.getErrorForNullUserLogin(user)
            if (isUserNullReport.hasError) return new Service_Response(undefined, 403, true, isUserNullReport.error)
            
            return UserConnexionManager.getToken(user, reqUser.password)
                .then(token => {
                    // Vérification couple login / mdp
                    const tokenError = UserErrorManager.getErrorForNullTokenLogin(token)
                    if (tokenError.hasError) return new Service_Response(undefined, 403, true, tokenError.error)
                    
                    return new Service_Response({
                        _id: user._id,
                        token: token
                    })
                })
                .catch(error => new Service_Response(undefined, 500, true, error))
        })
        .catch(error => new Service_Response(undefined, 400, true, error))
}


/**
 * 
 * @param {object} newUser 
 * @param {string} userId 
 * @param {string} userAuthId 
 * @param {object} reqFile 
 * @param {string} reqProtocol 
 * @param {string} reqHost 
 * @returns {Service_Response}
 */
exports.modifyUser = async (newUser, userId, userAuthId, reqFile, reqProtocol, reqHost) => {
    // Vérification des arguments
    const inputError = UserErrorManager.getModificationError(newUser, userId, userAuthId, reqFile, reqProtocol, reqHost)
    if (inputError.hasError) return new Service_Response(undefined, 400, true, inputError.error)

    // Vérification des droits
    let unauthorizedError = UserErrorManager.verifyAuthentication(userId, userAuthId)
    if (unauthorizedError.hasError) return new Service_Response(undefined, 401, true, unauthorizedError.error)

    return await UserSeeker.getOneUser(userId)
        .then(async user => {
            // Vérification du not found
            const notFoundError = UserErrorManager.getUserNotFoundError(user)
            if (notFoundError.hasError) return new Service_Response(undefined, 404, true, notFoundError.error)
            
            // Vérification des infos sachant user
            const report = await UserErrorManager.getModificationErrorKnowingUser(user, newUser)
            if (report.hasError) return new Service_Response(undefined, 400, true, report.error)

            // Direction du traitement des infos
            if (reqFile !== undefined) UserFactory.modifyProfilePicture(user, reqFile, reqProtocol, reqHost)
            if (newUser.email != undefined) UserFactory.modifyEmail(user, newUser.email)
            if (newUser.password != undefined) await UserFactory.modifyPassword(user, newUser.password)
            if (newUser.name != undefined) UserFactory.modifyName(user, newUser.name.firstName, newUser.name.lastName, newUser.name.publicName)
            if (newUser.phone != undefined) UserFactory.modifyPhone(user, newUser.phone.type, newUser.phone.prefix, newUser.phone.number, newUser.phone.phoneExt, newUser.phone.phoneDescription)
            if (newUser.dateBirthday != undefined) UserFactory.modifyBirth(user, newUser.dateBirthday)
            if (newUser.aboutMe != undefined) UserFactory.modifyAboutMe(user, newUser.aboutMe)
            if (newUser.alternateEmail != undefined) UserFactory.modifyAlternateEmail(user, newUser.alternateEmail)
            if (newUser.testimonial != undefined) UserFactory.modifyTestimonial(user, newUser.testimonial)
            if (newUser.isStudent != undefined) UserFactory.modifyIsStudent(user, newUser.isStudent)
            if (newUser.parameters != undefined) {
                if (newUser.parameters.show != undefined) UserFactory.modifyShowParameter(user, newUser.parameters.show.showAgePublically, newUser.parameters.show.showEmailPublically, newUser.parameters.show.showPhonePublically)
                if (newUser.parameters.notification != undefined) UserFactory.modifyNotificationParameter(user, newUser.parameters.notification.sendNewsletter, newUser.parameters.notification.remindEvaluations, newUser.parameters.notification.remindDeparture)
                if (newUser.parameters.preferredLangage != undefined) UserFactory.modifyPreferredLangage(user, newUser.parameters.preferredLangage)
            }

            return user.save()
                .then(() => (new Service_Response(undefined, 200).setLocation("/auth/" + user._id)))
                .catch(error => new Service_Response(undefined, 500, true, error))
        })
}


/**
 * 
 * @param {object} reqUser 
 * @param {string} userId 
 * @param {string} userAuthId 
 * @param {string} forAttribute 
 * @returns {Service_Response}
 */
exports.verifyNonce = async (reqUser, userId, userAuthId, forAttribute) => {
    const nonceVerifError = UserErrorManager.getNonceVerifError(reqUser, userId, userAuthId)
    if (nonceVerifError.hasError) 
        return new Service_Response(undefined, 400, true, nonceVerifError.error)

    return await UserSeeker.getOneUser(userId)
        .then(user => {
            const nonceToVerify = forAttribute === "email" ? user.emailNonce : user.phoneNonce
            const isNonceCorrect = UserErrorManager.getNonceEqualsError(nonceToVerify, reqUser.nonce)
            if (isNonceCorrect.hasError) 
                return new Service_Response(undefined, 400, true, isNonceCorrect.error)
            
            if (forAttribute === "email") 
                UserFactory.validateNonceEmail(user)
            
            else if (forAttribute === "phone") 
                UserFactory.validateNoncePhone(user)

            return user.save()
                .then(() => (new Service_Response(undefined, 200).setLocation("/auth/" + user._id)))
                .catch(error => new Service_Response(undefined, 500, true, error))
        })
    
}