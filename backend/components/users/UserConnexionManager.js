const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

/**
 * 
 * @param {User} user 
 * @param {string} reqPassword 
 * @returns {?object}
 */
exports.getToken = async (user, reqPassword) => {
    return await bcrypt.compare(reqPassword, user.password)
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