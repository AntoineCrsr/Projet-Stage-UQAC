class Service_Response {
    constructor(result, http_code = 200, has_error = false, error_object = {}) {
        this.result = result
        this.http_code = http_code
        this.has_error = has_error
        this.error_object = error_object
        this.location = undefined
    }

    setLocation(location) {
        this.location = "/api" + location
        return this
    }

    // Fonction pour renvoyer une response avec gestion d'erreur adapté à service_response
    buildResponse(res) {
        if (this.has_error) res.status(this.http_code).json(this.error_object)
        else if (this.location != undefined) res.status(this.http_code).location(this.location).json(this.result)
        else res.status(this.http_code).json(this.result)
    }
}

module.exports = Service_Response