const mongoose = require('mongoose');

const carSchema = mongoose.Schema({
  userId: { type: String, required: true },
  carType: {type: String, required: true},
  manufacturer: {type: String, required: true},
  year: {type: String, required: true},
  model: {type: String, required: true},
  color: {type: String, required: true},
  licensePlate: {type: String, required: true},
  airConditioner: {type: Boolean, required: true},
  name: { type: String, required: true },
  imageUrl: { type: String, required: false },
});

module.exports = mongoose.model('Car', carSchema);