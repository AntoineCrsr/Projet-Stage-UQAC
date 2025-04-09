const mongoose = require('mongoose')
const validator = require('mongoose-unique-validator')

/**
 * Review est prévu pour fonctionner de la façon suivante:
 * - Un utilisateur X réalise un voyage avec un conducteur Y au travers d'une réservation
 * - Une fois le voyage réalisé, l'application propose à Y d'évaluer X pour sa performance
 * - Y évalue donc X s'il le veut, lui donnant un score, et un commentaire s'il le veut
 * 
 * Un seul avis par conducteur par utilisateur (Y ne peut évaluer X qu'une seule fois)
 * Si à l'avenir Y refait un trajet avec X, il peut alors éditer son avis.
 * 
 * La condition afin que Y poste un avis reste que ce dernier ait fait un trajet terminé avec X
 */

const review = mongoose.Schema({
    reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reviewedId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    punctualityRating: {type: Number, required: false, min: 0, max: 5},
    securityRating: {type: Number, required: false, min: 0, max: 5},
    comfortRating: {type: Number, required: false, min: 0, max: 5},
    courtesyRating: {type: Number, required: false, min: 0, max: 5},
    message: {type: String}
})

review.plugin(validator)

module.exports = mongoose.model("Review", review)