const errorTable = require("./JourneyErrors.json")
const ErrorReport = require("./ErrorReport")

exports.getCreationError = (req) => {
    // Présence de tous les champs nécessaires
    if (
        req.starting == undefined
        || req.arrival == undefined
        || req.date == undefined
        || req.seats == undefined
        || req.price == undefined
    ) {
        return new ErrorReport(true, errorTable["missingArg"])
    }

    // Type des valeurs
    if (
        typeof(req.starting) !== "string"
        || typeof(req.arrival) !== "string"
        || typeof(req.date) !== "string"
        || typeof(req.seats) !== "number"
        || typeof(req.price) !== "number"
    ) {
        return new ErrorReport(true, errorTable["typeError"])
    }

    // Bon sens des valeurs
    if (
        seats < 0
        || price < 0
    ) {
        return new ErrorReport(true, errorTable["badValues"])
    }

    return new ErrorReport(false)
}


/**
 * @param {string} id 
 * @returns {ErrorReport}
 */
exports.getOneError = (id) => {
    // Missing fields
    if (id == undefined) {
        return new ErrorReport(true, errorTable["missingId"])
    }

    // Type error (ceci ne devrait jamais arriver vu que normalement le req.params est systématiquement un string)
    if (typeof(id) !== "string") {
        return new ErrorReport(true, errorTable["typeError"])
    }
    
    return new ErrorReport(false)
}


/**
 * 
 * @param {string} ownerId 
 * @param {string} userAuthId 
 * @returns 
 */
exports.verifyAuthentication = (ownerId, userAuthId) => {
    if (ownerId != userAuthId) {
        return new ErrorReport(true, errorTable["unauthorizedError"])
    }
    return new ErrorReport(false)
}


/**
 * 
 * @param {object} req 
 * @param {string} userAuthId 
 * @param {string} ownerId 
 * @returns {ErrorReport}
 */
exports.getModifyError = (req, userAuthId, ownerId) => {
    // Attention, il est probable que la requete ne contienne que l'attribut qui doit être modifié
    // Type des variables
    if (
        (req.starting != null && typeof(req.starting) !== "string")
        || (req.arrival != null && typeof(req.arrival) !== "string")
        || (req.date != null && typeof(req.date) !== "string")
        || (req.seats != null && typeof(req.seats) !== "number")
        || (req.price != null && typeof(req.price) !== "number")
    ) {
        return new ErrorReport(true, errorTable["typeError"])
    }

    // Vérification des valeurs nulles
    if (
        req.starting === null
        || req.arrival === null
        || req.date === null
        || req.seats === null
        || req.price === null
    ) {
        return new ErrorReport(true, errorTable["nullError"])
    }

    // Authentification
    const authError = this.verifyAuthentication(ownerId, userAuthId)
    if (authError.hasError) return authError

    return new ErrorReport(false)
}