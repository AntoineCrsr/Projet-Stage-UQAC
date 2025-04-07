const ReviewSeeker = require("../ReviewSeeker")
const JourneySeeker = require("../../journeys/JourneySeeker")
const ReservationSeeker = require("../../reservation/ReservationSeeker")
const ErrorReport = require("../../workspace/ErrorReport")
const errorTable = require("./ReviewErrors")

async function hasAlreadyGivenReview(userId, reviewedId) {
    return await ReviewSeeker.getReviews({"reviewerId": userId, "reviewedId": reviewedId})
        .then(reviews => reviews.length > 0)
} 

async function hasCompletedAJourneyWith(userAuth, reviewedId) {
    let hasCompletedAJourneyWithTheGuy = false
    // Obtention des réservations de y:
    await ReservationSeeker.getReservations({"userId": userAuth})
        .then(async reservations => {
            await reservations.forEach(async reserv => {
                // Pour chaque réservation, obtention de la journey:
                const journey = await JourneySeeker.getOneJourney(reserv.journeyId)
                // Recherche de la journey dont le conducteur est le reviewed, puis vérifie que la journey soit terminée
                if (journey.ownerId === reviewedId && journey.state === "d")
                    hasCompletedAJourneyWithTheGuy = true
            });
        })
    return hasCompletedAJourneyWithTheGuy
}

/**
 * Vérifie que l'utilisateur a déjà fait une journey terminée avec la personne évaluée,
 * puis que cette dernière ne l'a pas déjà évalué
 * @param {object} reqRev 
 */
exports.getCreationError = async (reqRev, userAuthId) => {
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
        typeof(reqRev.reviewedId) !== "string" 
        || reqRev.reviewedId.length !== 24
        || typeof(reqRev.punctualityRating) !== "number"
        || typeof(reqRev.securityRating) !== "number"
        || typeof(reqRev.comfortRating) !== "number"
        || typeof(reqRev.courtesyRating) !== "number"
        || (reqRev.message != undefined && typeof(reqRev.message) !== "string")
    ) return new ErrorReport(true, errorTable["typeError"])

    // Logique:
    if (
        reqRev.punctualityRating < 0 || reqRev.punctualityRating > 5
        || reqRev.securityRating < 0 || reqRev.securityRating > 5
        || reqRev.comfortRating < 0  || reqRev.comfortRating > 5
        || reqRev.courtesyRating < 0 || reqRev.courtesyRating > 5
    ) return new ErrorReport(true, errorTable["avisIncorrects"])

    // Empêche de se donner soi même un avis
    if (userAuthId === reqRev.reviewedId)
        return new ErrorReport(true, errorTable["reviewHimselfError"])

    // Vérification d'un avis possiblement déjà donné
    if (await hasAlreadyGivenReview(userAuthId, reqRev.reviewedId))
        return new ErrorReport(true, errorTable["reviewAlreadyGiven"])

    // Vérifie que l'utilisateur a bien réalisé un trajet
    if (await hasCompletedAJourneyWith(userAuthId, reqRev.reviewedId))
        return new ErrorReport(true, errorTable["haveNotDoneJourney"])
} 


exports.getConstraintsError = (constraints) => {
    if (constraints == undefined)
        return new ErrorReport(false)
    
    if ((constraints.reviewerId != undefined && constraints.reviewerId.length !== 24)
        || (constraints.reviewedId != undefined && constraints.reviewedId.length !== 24))
        return new ErrorReport(true, errorTable["idErrors"])
    
    return new ErrorReport(false)
}