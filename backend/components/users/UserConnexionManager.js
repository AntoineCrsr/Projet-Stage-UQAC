const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

/**
 * 
 * @param {string} registredPassword 
 * @param {string} reqPassword 
 * @returns {?object}
 */
exports.getToken = async (registredPassword, reqPassword) => {
    return await bcrypt.compare(registredPassword, reqPassword)
        .then(valid => {
            if (!valid) {
                return null
            }
            else {
                return jwt.sign(
                        {userId: user._id},
                        process.env.JWT_KEY, 
                        { expiresIn: '24h' })

            }
        })
        .catch(error => null)
}