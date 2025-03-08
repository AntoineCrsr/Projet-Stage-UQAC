class Service_Response {
    constructor(result, http_code = 200, has_error = false, error_object = null) {
        this.result = result
        this.http_code = http_code
        this.has_error = has_error
        this.error_object = error_object
    }
}

module.exports = Service_Response