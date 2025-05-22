const express = require('express')
const citiesController = require('./citiesController')
const router = express.Router()
const JourneyUpdater = require("../workspace/JourneyStateUpdater")

router.get('/', JourneyUpdater.updateJourneys, citiesController.getCities);
  
module.exports = router