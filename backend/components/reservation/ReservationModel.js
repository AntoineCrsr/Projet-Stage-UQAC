const mongoose = require('mongoose')
const validator = require('mongoose-unique-validator')

const reservation = mongoose.Schema({
    journeyId: { type: mongoose.Schema.Types.ObjectId, ref: "Journey", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
})

reservation.plugin(validator)

module.exports = mongoose.model("Reservation", reservation)