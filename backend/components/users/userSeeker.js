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

/**
 * 
 * @param {string} email 
 */
exports.emailExists = async (email) => {
    return await User.find({"email": email})
        .then(users => users.length > 0)
}

/**
 * 
 * @param {string} phone 
 */
exports.phoneExists = async (phone) => {
    return await User.find({"phone.prefix": phone.prefix, "phone.number": phone.number})
        .then(users => users.length > 0)
}