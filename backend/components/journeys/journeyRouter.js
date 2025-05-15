const express = require('express')
const journeyController = require('./journeyController')
const auth = require('../users/userAuth')
const router = express.Router()
const JourneyUpdater = require("../workspace/JourneyStateUpdater")

router.post('/', JourneyUpdater.updateJourneys, auth, journeyController.createJourney);
  
router.get('/', JourneyUpdater.updateJourneys, journeyController.getLastJourneys);
  
router.get('/:id', JourneyUpdater.updateJourneys, journeyController.getOneJourney);
  
router.put('/:id', JourneyUpdater.updateJourneys, auth, journeyController.modifyOneJourney);

router.delete('/:id', JourneyUpdater.updateJourneys, auth, journeyController.deleteOneJourney)

module.exports = router