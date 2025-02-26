const express = require('express')
const carController = require('./carController')
const auth = require('../users/userAuth')
const multer = require('../workspace/multer-config')
const router = express.Router()

// Besoin du multer après l'auth pour générer le nom de fichier d'image
router.post('/', auth, multer, carController.createCar);
  
router.get('/', carController.getAllCars);
  
router.get('/:id', carController.getOneCar);
  
router.put('/:id', auth, multer, carController.modifyOneCar);

router.delete('/:id', auth, carController.deleteOneCar)

module.exports = router