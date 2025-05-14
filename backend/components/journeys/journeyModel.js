const mongoose = require('mongoose')
const validator = require('mongoose-unique-validator')

const journey = mongoose.Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    carId: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true},
    starting: {
        city: { type: String, required: true },
        address: { type: String, required: true }
    },
    arrival: {
        city: { type: String, required: true },
        address: { type: String, required: true }
    },
    date: { type: String, required: true },
    seats: {
        total: { type: Number, required: true },
        left: { type: Number, required: true },
    },
    price: { type: Number, required: true },
    state: { type: String, required: true }
})

journey.plugin(validator)

module.exports = mongoose.model("Journey", journey)