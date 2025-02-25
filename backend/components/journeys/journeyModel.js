const mongoose = require('mongoose')
const validator = require('mongoose-unique-validator')

const journey = mongoose.Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    starting: {
        city: { type: String, required: true },
        adress: { type: String, required: true }
    },
    arrival: {
        city: { type: String, required: true },
        adress: { type: String, required: true }
    },
    date: { type: String, required: true },
    seats: {
        total: { type: Number, required: true },
        left: { type: Number, required: true },
    },
    price: { type: Number, required: true },
    passengers: [
        { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    ]
    // Maybe add payment type one day
    // Also considering the preferences such as smoking, animals etc.
    // Desc / commentaire
    // Maybe also driver license ?
})

journey.plugin(validator)

module.exports = mongoose.model("Journey", journey)