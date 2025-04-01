const requirements = require("./requirements.json")
/**
 * Retourne vrai si l'email est valide, false sinon
 * @param {string} email 
 * @returns {Boolean}
 */
exports.verifyEmail = (email) => {
    let isSyntaxCorrect = true
    requirements.email.containsAtLeast.forEach(elt => {
        if (!email.includes(elt)) isSyntaxCorrect = false
    })

    let emailTable = email.split(".")
    let emailSuffix = emailTable[emailTable.length-1]

    let hasCorrectSuffix = false
    requirements.email.suffix.forEach(elt => {
        if (emailSuffix === elt) hasCorrectSuffix = true
    })

    return isSyntaxCorrect && hasCorrectSuffix
} 