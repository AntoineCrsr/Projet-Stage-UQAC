const mongoose = require('mongoose')
const validator = require('mongoose-unique-validator')

const user = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    isStudent: {type: Boolean, required: true},
    dateBirthday: {type: Date, required: true}, 
    aboutMe: {type: String, required: false},
    alternateEmail: {type: String, required: false},
    testimonial: {type: String, required: false},
    nonce: {type: String, required: false},
    imageUrl: {type: String, required: false},

    name: {
        publicName: {type: String, required: true},
        firstName: {type: String, required: true, unique: false},
        lastName: {type: String, required: true, unique: false},
    },

    phone: {
        // Vérification du préfixe et du type avec des enums
        type: { type: String, required: true, enum: { values: ["mobile", "work", "pager", "other"], message: '{VALUE} is not valid answer'}},
        prefix: { type: String, required: true, enum: { values: ["+1", "+33"], message: '{VALUE} is not yet supported'} },
        number: { type: String, required: true, unique: true },
        phoneExt: {type: String, required: false},
        phoneDescription: {type: String, required: false},
    },

    rating: {
        punctualityRating: {type: Number, required: false, min: 0, max: 5},
        securityRating: {type: Number, required: false, min: 0, max: 5},
        comfortRating: {type: Number, required: false, min: 0, max: 5},
        courtesyRating: {type: Number, required: false, min: 0, max: 5},
        nbRating: {type: Number, required: false, min: 0}
    },

    parameters: {
        show: {
            showAgePublically: {type: Boolean, required: true},
            showEmailPublically: {type: Boolean, required: true},
            showPhonePublically: {type: Boolean, required: true},
        },
        notification: {
            sendNewsletter: {type: Boolean, required: true},
            remindEvaluations: {type: Boolean, required: true}, // Envoie un mail pour rappeler d'évaluer un trajet qu'on a eu
            remindDeparture: {type: Boolean, required: true}, // Envoie un mail pour vérifier l'identité de nos passagers avant d'embarquer
        },
        preferredLangage: {type: String, required: true}
    },

    statistics: {
        nbRidesCompleted: {type: Number, required: true, min: 0},
        nbKmTravelled: {type: Number, required: true, min: 0},
        nbPeopleTravelledWith: {type: Number, required: true, min: 0},
        nbTonsOfCO2Saved: {type: Number, required: true, min: 0},
    },
})

user.plugin(validator)

module.exports = mongoose.model("User", user)