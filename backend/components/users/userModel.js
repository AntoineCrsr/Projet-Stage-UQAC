const mongoose = require('mongoose')
const validator = require('mongoose-unique-validator')

const user = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    isStudent: {type: Boolean, required: true},
    dateBirthday: {type: Date, required: true}, // type ?
    phoneType: {type: String, required: true}, // type object ? interface ? (type: mobile, work, pager, other) + prefix (+1, +33...)
    phonePrefix: {type: String, required: true},
    phoneNumber: {type: String, required: true},
    publicName: {type: String, required: true},
    showAgePublically: {type: Boolean, required: true},
    showEmailPublically: {type: Boolean, required: true},
    showPhonePublically: {type: Boolean, required: true},
    sendNewsletter: {type: Boolean, required: true},
    remindEvaluations: {type: Boolean, required: true}, // Envoie un mail pour rappeler d'évaluer un trajet qu'on a eu
    remindDeparture: {type: Boolean, required: true}, // Envoie un mail pour vérifier l'identité de nos passagers avant d'embarquer
    preferredLangage: {type: String, required: true},
    nbRidesCompleted: {type: Number, required: true},
    nbKmTravelled: {type: Number, required: true},
    nbPeopleTravelledWith: {type: Number, required: true},
    nbTonsOfCO2Saved: {type: Number, required: true},
    password: {type: String, required: true},
    firstName: {type: String, required: true, unique: false},
    lastName: {type: String, required: true, unique: false},
    // Not required:
    aboutMe: {type: String, required: false},
    alternameEmail: {type: String, required: false},
    testimonial: {type: String, required: false},
    nonce: {type: String, required: false},
    punctualityRating: {type: Number, required: false},
    securityRating: {type: Number, required: false},
    comfortRating: {type: Number, required: false},
    courtesyRating: {type: Number, required: false},
})

// Gestion du code de vérification nonce pour téléphone ?
// Gestion myCars
// Settings (preferedLangage...)
// Invoices
// Bank account linked, solde
// Credit report
// Statistics: rating, nbRides, nbMiles, nbPeopleTraveledWith, co2Saved

user.plugin(validator)

module.exports = mongoose.model("User", user)