const requirements = require("./requirements.json")

/**
 * Retourne vrai si le format du téléphone est valide
 * @param {object} phone 
 * @returns {Boolean}
 */
exports.verifyPhone = (phone) => {
    // Présence des attributs
    if (phone.prefix == undefined || phone.number == undefined) return false

    // Vérification du préfixe
    if (!requirements.phone.prefix.includes(phone.prefix)) return false

    // Format du numéro
    if (phone.number.length < requirements.phone.number.sizeMin
        || phone.number.length > requirements.phone.number.sizeMax
        || isNaN(phone.number)
    ) return false

    return true
} 