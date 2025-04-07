const Review = require("./ReviewModel")


/**
 * 
 * @param {object} constraints 
 * @returns {Promise}
 */
exports.getReviews = async (constraints) => {
    return await Review.find(constraints)
} 