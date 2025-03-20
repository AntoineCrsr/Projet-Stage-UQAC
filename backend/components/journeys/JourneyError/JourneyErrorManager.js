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
        return new ErrorReport(true, errorTable["missing-fields"])
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