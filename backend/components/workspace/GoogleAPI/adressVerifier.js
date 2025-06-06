const ErrorReport = require("../ErrorReport");
const errorTable = require("../GeneralError/GeneralErrors.json")
require("dotenv").config();


/**
 * 
 * @param {Array} addressLines 
 * @param {string} regionCode 
 * @param {string} locality 
 * @returns 
 */
exports.getCorrectAddress = async (addressLines, locality) => {
    const regionCode = "CA"
    // Pré-vérification des attributs
    if (!Array.isArray(addressLines)) {
        return null
    }
    // Requete API 
    return await fetch(process.env.ADRESS_VERIF_URL, {
        method: "POST",
        headers: { 
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
            "address": {
                "regionCode": regionCode,
                "locality": locality,
                "addressLines": addressLines
            }
        })
      })
        .then(async (res) => {
            const response = await res.json()
            if (!(
                // Ceci vérifie que l'adresse ait au moins une précision de l'ordre d'un batiment
                response.result.verdict.inputGranularity === "PREMISE" 
                || response.result.verdict.inputGranularity === "SUB_PREMISE"
                || response.result.verdict.inputGranularity === "PREMISE_PROXIMITY"
            ))
                return null // Adresse invalide ou trop imprécise
            if (!(
                // Qualité de l'adresse
                response.result.verdict.validationGranularity === "PREMISE"
                || response.result.verdict.validationGranularity === "SUB_PREMISE"
            ))
                // return new ErrorReport(true, errorTable["adressInv"]) // Niveau de détail trop faible
                return null
            return response.result.address.formattedAddress
        })
        .catch(e => null)
}

/*
"address": {
    "regionCode": "US", // Facultatif mais recommandé = Pays
    "locality": "Mountain View", // Facultatif = Ville
    "addressLines": ["1600 Amphitheatre Pkwy"]
}

More info:
https://developers.google.com/maps/documentation/address-validation/requests-validate-address?hl=fr#try_it
*/