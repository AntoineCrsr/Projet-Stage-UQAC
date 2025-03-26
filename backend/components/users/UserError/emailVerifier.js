/**
 * Retourne vrai si l'email est valide, false sinon
 * @param {string} email 
 * @returns {Boolean}
 */
exports.verifyEmail = (email) => {
    return email.indexOf("@") >= 0
} 