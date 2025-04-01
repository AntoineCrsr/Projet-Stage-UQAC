const errorTable = require("./JourneyErrors.json")
const ErrorReport = require("../../workspace/ErrorReport")

/**
 * Teste les erreurs possibles de req pour réussir la création future de l'objet
 * @param {object} req 
 * @returns {ErrorReport}
 */
exports.getCreationError = (req) => {
    // Présence de tous les champs nécessaires
    if (
        req.starting == undefined
        || req.starting.city == undefined
        || req.starting.adress == undefined
        || req.arrival == undefined
        || req.arrival.city == undefined
        || req.arrival.adress == undefined
        || req.date == undefined
        || req.seats == undefined
        || req.seats.total == undefined
        || req.seats.left == undefined
        || req.price == undefined
    ) {
        return new ErrorReport(true, errorTable["missingArg"])
    }

    // Type des valeurs
    if (
        typeof(req.starting) !== "object"
        || typeof(req.starting.city) !== "string"
        || typeof(req.starting.adress) !== "string"
        || typeof(req.arrival) !== "object"
        || typeof(req.arrival.city) !== "string"
        || typeof(req.arrival.adress) !== "string"
        || typeof(req.date) !== "string"
        || typeof(req.seats) !== "object"
        || typeof(req.seats.total) !== "number"
        || typeof(req.seats.left) !== "number"
        || typeof(req.price) !== "number"
    ) {
        return new ErrorReport(true, errorTable["typeError"])
    }

    // Bon sens des valeurs
    if (
        req.seats.total < 0
        || req.seats.left < 0
        || req.price < 0
    ) {
        return new ErrorReport(true, errorTable["badValues"])
    }

    // Cohérence
    if (
        req.seats.left > req.seats.total
    ) {
        return new ErrorReport(true, errorTable["leftUpperThanTotal"])
    }

    return new ErrorReport(false)
}


/**
 * Teste les erreurs pour le get d'une journey
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
 * Teste l'authentifaication
 * @param {string} ownerId 
 * @param {string} userAuthId 
 * @returns {ErrorReport}
 */
exports.verifyAuthentication = (ownerId, userAuthId) => {
    if (ownerId != userAuthId) {
        return new ErrorReport(true, errorTable["unauthorizedError"])
    }
    return new ErrorReport(false)
}


/**
 * Cherche des erreurs avant la modification de l'objet
 * @param {object} req 
 * @param {string} userAuthId 
 * @param {string} ownerId 
 * @param {object} seats 
 * @returns {ErrorReport}
 */
exports.getModifyError = (req, userAuthId, ownerId, seats) => {
    // Attention, il est probable que la requete ne contienne que l'attribut qui doit être modifié
    // Authentification
    const authError = this.verifyAuthentication(ownerId, userAuthId)
    if (authError.hasError) return authError

    // Type des variables
    if (
        (req.starting != null && typeof(req.starting) !== "object")
        || (req.starting.city != null && typeof(req.starting.city) !== "string")
        || (req.starting.adress != null && typeof(req.starting.adress) !== "string")
        || (req.arrival != null && typeof(req.arrival) !== "object")
        || (req.arrival.adress != null && typeof(req.arrival.adress) !== "string")
        || (req.arrival.city != null && typeof(req.arrival.city) !== "string")
        || (req.date != null && typeof(req.date) !== "string")
        || (req.seats != null && typeof(req.seats) !== "object")
        || (req.seats.total != null && typeof(req.seats.total) !== "number")
        || (req.seats.left != null && typeof(req.seats.left) !== "number")
        || (req.price != null && typeof(req.price) !== "number")
        || (req.state != null && typeof(req.state) !== "string")
    ) {
        return new ErrorReport(true, errorTable["typeError"])
    }

    // Vérification des valeurs nulles
    if (
        req.starting === null
        || req.starting.adress === null
        || req.starting.city === null
        || req.arrival === null
        || req.arrival.adress === null
        || req.arrival.city === null
        || req.date === null
        || req.seats === null
        || req.seats.left === null
        || req.seats.total === null
        || req.price === null
        || req.state === null
    ) {
        return new ErrorReport(true, errorTable["nullError"])
    }

    // Cohérence
    let coherent = true
    if (req.seats != null) {
        // Seats est défini
        if (req.seats.left != null) {
            // left est défini
            if (req.seats.left < 0) coherent = false

            if (req.seats.total != null) {
                // left et total sont définis
                if (req.seats.total <= 1) coherent = false
                if (req.seats.left > req.seats.total) coherent = false
            }
            else {
                // seul left est défini
                if (req.seats.left > seats.total) coherent = false // Vérification sur le seats de l'objet déjà enregistré
            }
        }
    }

    if (!coherent) return new ErrorReport(true, errorTable["leftUpperThanTotal"])

    // Vérification du state
    if (req.state != null) {
        if (!(req.state === "w" || req.state === "d")) return new ErrorReport(true, errorTable["incorrectState"])
    }

    return new ErrorReport(false)
}