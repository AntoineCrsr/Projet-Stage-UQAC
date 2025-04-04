const ReservationService = require("./ReservationService")
const Service_Response = require("../workspace/service_response")

exports.createReservation = (req, res, next) => {
    ReservationService.createReservation(req.body.reservation, req.auth.userId)
        .then(service_response => service_response.buildResponse(res))
}

exports.getReservations = (req, res, next) => {

}

exports.modifyReservation = (req, res, next) => {

}

exports.deleteReservation = (req, res, next) => {
    
}