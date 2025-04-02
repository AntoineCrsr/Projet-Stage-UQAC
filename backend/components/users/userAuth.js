require("dotenv").config();
const jwt = require('jsonwebtoken')

/**
 * Décode la requete incluant un token JWT et stocke
 * l'id utilisateur dans req.auth, puis lance le prochain middleware
 * @param {object} req 
 * @param {object} res 
 * @param {Function} next 
 */
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = jwt.decode(token, process.env.JWT_KEY)
        const userId = decodedToken.userId
        req.auth = {
            userId: userId
        }
        next()
    } catch (error) {
        next()
    }
}