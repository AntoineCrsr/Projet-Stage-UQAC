const express = require('express')
const journeyController = require('./journeyController')
const auth = require('../users/userAuth')
const router = express.Router()

router.post('/', auth, journeyController.createJourney);
  
router.get('/', journeyController.getLastJourneys);
  
router.get('/:id', journeyController.getOneJourney);
  
router.put('/:id', auth, journeyController.modifyOneJourney);

router.delete('/:id', auth, journeyController.deleteOneJourney)

module.exports = router