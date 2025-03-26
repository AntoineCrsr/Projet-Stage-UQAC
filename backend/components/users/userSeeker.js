const User = require('./userModel')


/**
 * 
 * @param {string} userId 
 * @returns {Promise}
 */
exports.getOneUser = async (userId) => {
    return await User.findOne({_id: userId})
}


/**
 * 
 * @param {string} userEmail 
 * @returns {Promise}
 */
exports.getOneUserByEmail = async (userEmail) => {
    return await User.findOne({email: userEmail})
}