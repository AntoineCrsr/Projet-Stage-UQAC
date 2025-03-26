/**
 * Retourne vrai si le format du téléphone est valide
 * @param {object} phone 
 * @returns {Boolean}
 */
exports.verifyPhone = (phone) => {
    // Présence des attributs
    if (phone.prefix == undefined || phone.number == undefined) return false

    // Vérification du préfixe
    if (phone.prefix.length < 2
        || phone.prefix.length > 4
        || phone.prefix.indexOf("+") !== 0
        || isNaN(phone.prefix.substring(1))
    ) return false

    // Format du numéro
    if (phone.number.length < 9
        || phone.number.length > 11
        || isNaN(phone.number)
    ) return false

    return true
} 