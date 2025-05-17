const ReservationService = require("./ReservationService")
const Service_Response = require("../workspace/service_response")

exports.createReservation = (req, res, next) => {
    ReservationService.createReservation(req.body.reservation, req.auth.userId)
        .then(service_response => service_response.buildResponse(res))
}

exports.getReservations = (req, res, next) => {
    ReservationService.getReservations(req.query)
        .then(service_response => service_response.buildResponse(res))
}

exports.getOneReservation = (req, res, next) => {
    ReservationService.getOneReservation(req.params.id)
        .then(service_response => service_response.buildResponse(res))
}

exports.deleteReservation = (req, res, next) => {
    ReservationService.deleteReservation(req.params.id, req.auth.userId)
        .then(service_response => service_response.buildResponse(res))
}