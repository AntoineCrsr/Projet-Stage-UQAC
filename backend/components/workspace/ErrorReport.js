class ErrorReport {
    /**
     * @param {Boolean} hasError 
     * @param {Object} error 
     */
    constructor(hasError, error=null) {
        this.hasError = hasError
        this.error = error
    }
}

module.exports = ErrorReport