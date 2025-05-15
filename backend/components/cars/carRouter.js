const express = require('express')
const carController = require('./carController')
const auth = require('../users/userAuth')
const multer = require('../workspace/multer-config')
const router = express.Router()
const JourneyUpdater = require("../workspace/JourneyStateUpdater")

// Besoin du multer après l'auth pour générer le nom de fichier d'image
router.post('/', JourneyUpdater.updateJourneys, auth, multer, carController.createCar);
  
router.get('/', JourneyUpdater.updateJourneys, auth, carController.getAllCars);
  
router.get('/:id', JourneyUpdater.updateJourneys, auth, carController.getOneCar);
  
router.put('/:id', JourneyUpdater.updateJourneys, auth, multer, carController.modifyOneCar);

router.delete('/:id', JourneyUpdater.updateJourneys, auth, carController.deleteOneCar)

module.exports = router

