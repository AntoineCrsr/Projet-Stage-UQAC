const requirements = require("./requirements.json")

/**
 * Retourne vrai si le genre correspond à ceux disponibles dans requirements, faux sinon
 * @param {String} gender 
 * @returns {Boolean}
 */
exports.verifyGender = (gender) => {
    isValid = false
    requirements.genders.forEach(g => {
        if (g.toLowerCase() === gender.toLowerCase()){
            isValid = true
            return
        }
    })
    return isValid
}