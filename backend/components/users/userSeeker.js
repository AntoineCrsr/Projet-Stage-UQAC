const User = require('./userModel')


exports.getOneUser = async (userId) => {
    return await User.findOne({_id: userId})
}