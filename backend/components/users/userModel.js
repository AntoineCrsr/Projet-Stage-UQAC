const mongoose = require('mongoose')
const validator = require('mongoose-unique-validator')

const user = mongoose.Schema({
    email: {type: String, required: true, unique: true}, // Clé primaire
    password: {type: String, required: true},
    isStudent: {type: Boolean, required: true},
    dateBirthday: {type: Date, required: true}, 
    aboutMe: {type: String, required: false},
    alternateEmail: {type: String, required: false},
    testimonial: {type: String, required: false},
    nonce: {type: String, required: false},

    name: {
        publicName: {type: String, required: true},    
        firstName: {type: String, required: true, unique: false},
        lastName: {type: String, required: true, unique: false},
    },

    phone: {
        // Vérification du préfixe et du type avec des enums
        type: { type: String, required: true, enum: ["mobile", "work", "pager", "other"]},
        prefix: { type: String, required: true, enum: ["+1", "+33"] },
        number: { type: String, required: true },
        phoneExt: {type: String, required: false},
        phoneDescription: {type: String, required: false},
    },

    rating: {
        punctualityRating: {type: Number, required: false},
        securityRating: {type: Number, required: false},
        comfortRating: {type: Number, required: false},
        courtesyRating: {type: Number, required: false},
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
        nbRidesCompleted: {type: Number, required: true},
        nbKmTravelled: {type: Number, required: true},
        nbPeopleTravelledWith: {type: Number, required: true},
        nbTonsOfCO2Saved: {type: Number, required: true},
    },
})

user.plugin(validator)

module.exports = mongoose.model("User", user)