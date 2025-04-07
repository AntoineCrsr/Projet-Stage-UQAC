const ReviewErrorManager = require("./ReviewError/ReviewErrorManager")
const GeneralErrorManager = require("../workspace/GeneralError/GeneralErrorManager")
const ServiceResponse = require("../workspace/service_response")
const ReviewFactory = require("./ReviewFactory")
const ReviewSeeker = require("./ReviewSeeker")

exports.getReviews = async (constraints) => {
    const constraintError = ReviewErrorManager.getConstraintsError(constraints)
    if (constraintError.hasError) return new ServiceResponse(undefined, 400, true, constraintError.error)
    
    return await ReviewSeeker.getReviews(constraints)
        .then(reviews => new ServiceResponse(reviews))
        .catch(error => new ServiceResponse(undefined, 500, true, error))
}

exports.createReview = async (reqRev, userAuthId) => {
    const authError = GeneralErrorManager.getAuthError(userAuthId)
    if (authError.hasError) return new ServiceResponse(undefined, 401, true, authError.error)
    
    const verifError = await ReviewErrorManager.getCreationError(reqRev, userAuthId)
    if (verifError.hasError) return new ServiceResponse(undefined, 400, true, verifError.error)

    const review = ReviewFactory.createReview(userAuthId, reqRev.reviewedId, reqRev.punctualityRating, reqRev.securityRating, reqRev.comfortRating, reqRev.courtesyRating, reqRev.message)

    return await review.save()
        .then(() => (new ServiceResponse(undefined, 201)).setLocation("/review/" + review.id))
        .catch(error => new ServiceResponse(undefined, 500, true, error))
}