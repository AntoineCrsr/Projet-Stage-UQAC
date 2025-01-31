const mongoose = require('mongoose');

const carSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  marque: { type: String, required: true },
  immatriculation: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

module.exports = mongoose.model('Car', carSchema);