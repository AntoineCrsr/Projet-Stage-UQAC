const citiesService = require("./citiesService")

exports.getCities = (req, res, next) => {
    citiesService.getCities(req.query.prefix)
        .then(service_response => service_response.buildResponse(res))
}