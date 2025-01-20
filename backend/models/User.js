const mongoose = require('mongoose')
const validator = require('mongoose-unique-validator')

const user = mongoose.Schema({
    email: {type: String, required: true, unique: true },
    phone: {type: String, required: true, unique: true },
    verifiedPermit: {type: Boolean, required: true },
    password: { type: String, required: true }
})

user.plugin(validator)

module.exports = mongoose.model("User", user)