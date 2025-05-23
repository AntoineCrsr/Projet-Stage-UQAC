const ReviewSeeker = require("../ReviewSeeker")
const JourneySeeker = require("../../journeys/JourneySeeker")
const ReservationSeeker = require("../../reservation/ReservationSeeker")
const ErrorReport = require("../../workspace/ErrorReport")
const errorTable = require("./ReviewErrors")
const GeneralErrorManager = require("../../workspace/GeneralError/GeneralErrorManager")

async function hasAlreadyGivenReview(userId, reviewedId) {
    return await ReviewSeeker.getReviews({"reviewerId": userId, "reviewedId": reviewedId})
        .then(reviews => reviews.length > 0)
} 

async function hasCompletedAJourneyWith(userAuth, reviewedId) {
    let hasCompletedAJourneyWithTheGuy = false;

    const reservations = await ReservationSeeker.getReservations({ userId: userAuth });

    for (const reserv of reservations) {
        const journey = await JourneySeeker.getOneJourney(reserv.journeyId);
        if (journey.ownerId.toString() === reviewedId && journey.state === "d") {
            hasCompletedAJourneyWithTheGuy = true;
            break;
        }
    }
    return hasCompletedAJourneyWithTheGuy;
}


/**
 * Vérifie que l'utilisateur a déjà fait une journey terminée avec la personne évaluée,
 * puis que cette dernière ne l'a pas déjà évalué
 * @param {object} reqRev 
 */
exports.getCreationError = async (reqRev) => {
    // Présence des attributs:
    if (reqRev == undefined
        || reqRev.reviewedId == undefined
        || reqRev.punctualityRating == undefined
        || reqRev.securityRating == undefined
        || reqRev.comfortRating == undefined
        || reqRev.courtesyRating == undefined
    ) return new ErrorReport(true, errorTable["missingArg"])

    // Format:
    if (
        typeof(reqRev.punctualityRating) !== "number"
        || typeof(reqRev.securityRating) !== "number"
        || typeof(reqRev.comfortRating) !== "number"
        || typeof(reqRev.courtesyRating) !== "number"
        || (reqRev.message != undefined && typeof(reqRev.message) !== "string")
    ) return new ErrorReport(true, errorTable["typeError"])

    const idError = GeneralErrorManager.isValidId(reqRev.reviewedId, "review")
    if (idError.hasError) return idError

    // Logique:
    if (
        reqRev.punctualityRating < 0 || reqRev.punctualityRating > 5
        || reqRev.securityRating < 0 || reqRev.securityRating > 5
        || reqRev.comfortRating < 0  || reqRev.comfortRating > 5
        || reqRev.courtesyRating < 0 || reqRev.courtesyRating > 5
    ) return new ErrorReport(true, errorTable["avisIncorrects"])

    return new ErrorReport(false)
} 


exports.getAuthorizedError = async (reqRev, userAuthId) => {
    // Empêche de se donner soi même un avis
    if (userAuthId === reqRev.reviewedId)
        return new ErrorReport(true, errorTable["reviewHimselfError"])

    // Vérification d'un avis possiblement déjà donné
    if (await hasAlreadyGivenReview(userAuthId, reqRev.reviewedId))
        return new ErrorReport(true, errorTable["reviewAlreadyGiven"])

    // Vérifie que l'utilisateur a bien réalisé un trajet
    //console.log(await hasCompletedAJourneyWith(userAuthId, reqRev.reviewedId))
    if (!(await hasCompletedAJourneyWith(userAuthId, reqRev.reviewedId)))
        return new ErrorReport(true, errorTable["haveNotDoneJourney"])

    return new ErrorReport(false)
}


exports.getConstraintsError = (constraints) => {
    if (constraints == undefined)
        return new ErrorReport(false)

    let idError = new ErrorReport(false)

    if (constraints.reviewerId != undefined)
        idError = GeneralErrorManager.isValidId(constraints.reviewerId.toString(), "review")

    if (constraints.reviewedId != undefined && !idError.hasError) 
        idError = GeneralErrorManager.isValidId(constraints.reviewedId.toString(), "review")

    if (constraints._id != undefined && !idError.hasError)
        idError = GeneralErrorManager.isValidId(constraints._id.toString(), "review")

    if (idError.hasError) return idError
    return new ErrorReport(false)
}


exports.getIdError = (reviewId) => {
    if (reviewId == undefined || typeof(reviewId) !== "string" || reviewId.length !== 24)
        return new ErrorReport(true, errorTable["idErrors"])
    return new ErrorReport(false)
}

exports.getNotFound = (review) => {
    if (review == undefined) return new ErrorReport(true, errorTable["notFound"])
    return new ErrorReport(false)
}

exports.getModifyPermissionError = (review, userAuthId) => {
    if (review.reviewerId.toString() !== userAuthId)
        return new ErrorReport(true, errorTable["modifyOthersReview"])
    return new ErrorReport(false)
}

exports.getModifyError = async (reqRev, review) => {
    // Présence des attributs:
    if (reqRev == undefined
        || (reqRev.punctualityRating == undefined
        && reqRev.securityRating == undefined
        && reqRev.comfortRating == undefined
        && reqRev.courtesyRating == undefined)
    ) return new ErrorReport(true, errorTable["missingArg"])

    // Format:
    if (
        (reqRev.punctualityRating != undefined && typeof(reqRev.punctualityRating) !== "number")
        || (reqRev.securityRating != undefined && typeof(reqRev.securityRating) !== "number")
        || (reqRev.comfortRating != undefined && typeof(reqRev.comfortRating) !== "number")
        || (reqRev.courtesyRating != undefined && typeof(reqRev.courtesyRating) !== "number")
        || (reqRev.message != undefined && typeof(reqRev.message) !== "string")
    ) return new ErrorReport(true, errorTable["typeError"])

    // Données invalides
    if (reqRev.reviewedId != undefined && reqRev.reviewedId != review.reviewedId)
        return new ErrorReport(true, errorTable["modifyToAnotherGuy"])

    // Logique:
    if (
        (reqRev.punctualityRating != undefined && (reqRev.punctualityRating < 0 || reqRev.punctualityRating > 5))
        || (reqRev.securityRating != undefined && (reqRev.securityRating < 0 || reqRev.securityRating > 5))
        || (reqRev.comfortRating != undefined && (reqRev.comfortRating < 0  || reqRev.comfortRating > 5))
        || (reqRev.courtesyRating != undefined && (reqRev.courtesyRating < 0 || reqRev.courtesyRating > 5))
    ) return new ErrorReport(true, errorTable["avisIncorrects"])
    
    return new ErrorReport(false)
} 