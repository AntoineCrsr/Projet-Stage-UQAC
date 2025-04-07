const ReviewService = require("./ReviewService")

exports.createReview = (req, res, next) => {
    ReviewService.createReview(req.body.review, req.auth.userId)
        .then(service_response => service_response.buildResponse(res))
}

exports.getReviews = (req, res, next) => {
    ReviewService.getReviews(req.query)
        .then(service_response => service_response.buildResponse(res))
}

exports.deleteReview = (req, res, next) => {
    ReviewService.deleteReview(req.params.id, req.auth.userId)
        .then(service_response => service_response.buildResponse(res))
}