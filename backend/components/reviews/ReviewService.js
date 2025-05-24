const ReviewErrorManager = require("./ReviewError/ReviewErrorManager")
const GeneralErrorManager = require("../workspace/GeneralError/GeneralErrorManager")
const ServiceResponse = require("../workspace/service_response")
const ReviewFactory = require("./ReviewFactory")
const ReviewSeeker = require("./ReviewSeeker")
const ReviewFilter = require("./ReviewFilter")
const UserService = require("../users/userService")

/**
 * 
 * @param {Array} constraints - normalement l'objet req.query
 * @returns {Promise}
 */
exports.getReviews = async (constraints) => {
    const constraintError = ReviewErrorManager.getConstraintsError(constraints)
    if (constraintError.hasError) return new ServiceResponse(undefined, 400, true, constraintError.error)
    
    return await ReviewSeeker.getReviews(constraints)
        .then(reviews => { 
            ReviewFilter.filterMultipleReviews(reviews)
            return new ServiceResponse(reviews)
        })
        .catch(error => new ServiceResponse(undefined, 500, true, error))
}

exports.getOneReview = async (id) => {
    const idError = GeneralErrorManager.isValidId(id, "review")
    if (idError.hasError) return new ServiceResponse(undefined, 400, true, idError.error)
    
    return await ReviewSeeker.getOneReview(id)
        .then(review => { 
            const notFound = ReviewErrorManager.getNotFound(review)
            if (notFound.hasError) return new ServiceResponse(undefined, 404, true, notFound.error)

            ReviewFilter.filterReview(review)
            return new ServiceResponse(review, 302)
        })
        .catch(error => new ServiceResponse(undefined, 500, true, error))
}

/**
 * 
 * @param {object} reqRev 
 * @param {string} userAuthId 
 * @returns {Promise}
 */
exports.createReview = async (reqRev, userAuthId) => {
    const authError = GeneralErrorManager.getAuthError(userAuthId)
    if (authError.hasError) return new ServiceResponse(undefined, 401, true, authError.error)
    
    const verifError = await ReviewErrorManager.getCreationError(reqRev)
    if (verifError.hasError) return new ServiceResponse(undefined, 400, true, verifError.error)

    const authorizationError = await ReviewErrorManager.getAuthorizedError(reqRev, userAuthId)
    if (authorizationError.hasError) return new ServiceResponse(undefined, 401, true, authorizationError.error)
        
    const review = ReviewFactory.createReview(userAuthId, reqRev.reviewedId, reqRev.punctualityRating, reqRev.securityRating, reqRev.comfortRating, reqRev.courtesyRating, reqRev.message)

    await UserService.updateRating(reqRev.reviewedId, reqRev.punctualityRating, reqRev.securityRating, reqRev.comfortRating, reqRev.courtesyRating)

    return await review.save()
        .then(() => (new ServiceResponse(undefined, 201)).setLocation("/review/" + review.id))
        .catch(error => new ServiceResponse(undefined, 500, true, error))
}


exports.deleteReview = async (reviewId, userAuthId) => {
    const authError = GeneralErrorManager.getAuthError(userAuthId)
    if (authError.hasError) return new ServiceResponse(undefined, 401, true, authError.error)
    
    const idError = GeneralErrorManager.isValidId(reviewId, "review")
    if (idError.hasError) return new ServiceResponse(undefined, 400, true, idError.error)

    return await ReviewSeeker.getOneReview(reviewId)
        .then(async review => {
            const notFound = ReviewErrorManager.getNotFound(review)
            if (notFound.hasError) return new ServiceResponse(undefined, 404, true, notFound.error)

            const permissionError = GeneralErrorManager.isUserOwnerOfObject(review.reviewerId.toString(), userAuthId)
            if (permissionError.hasError) return new ServiceResponse(undefined, 401, true, permissionError.error)
            
            await UserService.undoRating(review.reviewedId, review.punctualityRating, review.securityRating, review.comfortRating, review.courtesyRating)

            return await ReviewFactory.deleteReview(reviewId)
                .then(() => new ServiceResponse(undefined))
                .catch(error => new ServiceResponse(undefined, 500, true, error))
        }) 
}


exports.modifyReview = async (reviewId, reqRev, userAuthId) => {
    // Auth
    const authError = GeneralErrorManager.getAuthError(userAuthId)
    if (authError.hasError) return new ServiceResponse(undefined, 401, true, authError.error)
    // Format d'id
    const idError = ReviewErrorManager.getIdError(reviewId)
    if (idError.hasError) return new ServiceResponse(undefined, 400, true, idError.error)

    return await ReviewSeeker.getOneReview(reviewId)
        .then(async review => {
            // Not found
            const notFound = ReviewErrorManager.getNotFound(review)
            if (notFound.hasError) return new ServiceResponse(undefined, 404, true, notFound.error)
            // Permission
            const permissionError = ReviewErrorManager.getModifyPermissionError(review, userAuthId)
            if (permissionError.hasError) return new ServiceResponse(undefined, 401, true, permissionError.error)
            // Vérification des données
            const verifData = await ReviewErrorManager.getModifyError(reqRev, review)
            if (verifData.hasError) return new ServiceResponse(undefined, 400, true, verifData.error)
            
            // Retirer l'ancien rating
            await UserService.undoRating(review.reviewedId, review.punctualityRating, review.securityRating, review.comfortRating, review.courtesyRating)
            // Ajouter le nouveau rating
            await UserService.updateRating(reqRev.reviewedId, reqRev.punctualityRating, reqRev.securityRating, reqRev.comfortRating, reqRev.courtesyRating)

            // Action de modification
            return await ReviewFactory.modifyReview(reviewId, reqRev)
                .then(() => (new ServiceResponse(undefined)).setLocation("/review/" + review._id))
                .catch(error => new ServiceResponse(undefined, 500, true, error))
        }) 
        .catch(error => new ServiceResponse(undefined, 500, true, error))
}