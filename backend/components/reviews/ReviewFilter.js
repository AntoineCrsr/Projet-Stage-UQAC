exports.filterReview = (review) => {
    review.__v = undefined
    return review
}

exports.filterMultipleReviews = (reviews) => {
    reviews.forEach(res => this.filterReview(res))
    return reviews
}