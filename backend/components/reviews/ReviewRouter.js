const express = require('express')
const ReviewController = require('./ReviewController')
const auth = require('../users/userAuth')
const router = express.Router()
const JourneyUpdater = require("../workspace/JourneyStateUpdater")

router.post('/', JourneyUpdater.updateJourneys, auth, ReviewController.createReview);
  
router.get('/', JourneyUpdater.updateJourneys, ReviewController.getReviews);

router.get('/:id', JourneyUpdater.updateJourneys, ReviewController.getOneReview);
  
router.put('/:id', JourneyUpdater.updateJourneys, auth, ReviewController.modifyReview);
  
router.delete('/:id', JourneyUpdater.updateJourneys, auth, ReviewController.deleteReview);

module.exports = router