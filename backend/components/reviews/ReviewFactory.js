const Review = require("./ReviewModel")

exports.createReview = (reviewerId, reviewedId, punctualityRating, securityRating, comfortRating, courtesyRating, message) => {
    return new Review({
        reviewerId: reviewerId,
        reviewedId: reviewedId,
        punctualityRating: punctualityRating,
        securityRating: securityRating,
        comfortRating: comfortRating,
        courtesyRating: courtesyRating,
        message: message ? message : null // Permet de mettre null au lieu de undefined
    })
}


exports.deleteReview = (reviewId) => {
    return Review.deleteOne({"_id": reviewId})
}


exports.modifyReview = (reviewId, review) => {
    delete review._id
    delete review.reviewedId
    return Review.updateOne({_id: reviewId}, { ...review, _id: reviewId })
}