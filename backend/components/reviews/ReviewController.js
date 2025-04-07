const ReviewService = require("./ReviewService")

exports.createReview = (req, res, next) => {
    ReviewService.createReview(req.body.review, req.auth.userId)
        .then(service_response => service_response.buildResponse(res))
}

exports.getReviews = (req, res, next) => {
    ReviewService.getReviews(req.query)
        .then(service_response => {console.log(service_response); return service_response.buildResponse(res)})
}