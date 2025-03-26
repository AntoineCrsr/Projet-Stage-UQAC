const ErrorReport = require("../../workspace/ErrorReport")
const EmailVerifier = require("./emailVerifier")

/**
 * 
 * @param {any} userId 
 * @returns {ErrorReport}
 */
exports.getOneUserError = (userId) => {
    // Missing fields
    if (userId == undefined) {
        return new ErrorReport(true, errorTable["missingId"])
    }

    // Type error (ceci ne devrait jamais arriver vu que normalement le req.params est systématiquement un string)
    if (typeof(userId) !== "string") {
        return new ErrorReport(true, errorTable["typeError"])
    }
    
    return new ErrorReport(false)
}


exports.userCreationError = (req) => {
    // Présence de tous les champs nécessaires
    if (req.email == undefined
        || req.password == undefined
    ) {
        return new ErrorReport(true, errorTable["missingArg"])
    }

    // Type des valeurs
    if (typeof(req.email !== "string") 
        || typeof(req.password !== "string")
        || (req.preferredLangage != undefined && typeof(req.preferredLangage) !== "string")
    ) {
        return new ErrorReport(true, errorTable["typeError"])
    }

    // Bon sens des valeurs
    if (!EmailVerifier.verifyEmail(req.email))
        return new ErrorReport(true, errorTable["badEmail"])
}