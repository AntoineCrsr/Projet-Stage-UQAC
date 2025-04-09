const Review = require("./ReviewModel")


/**
 * 
 * @param {object} constraints 
 * @returns {Promise}
 */
exports.getReviews = async (constraints) => {
    return await Review.find(constraints)
} 

exports.getOneReview = async (reviewId) => {
    return await Review.findOne({"_id": reviewId})
}