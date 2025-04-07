const express = require('express')
const ReviewController = require('./ReviewController')
const auth = require('../users/userAuth')
const router = express.Router()

router.post('/', auth, ReviewController.createReview);
  
router.get('/', ReviewController.getReviews);
  
// router.get('/:id', journeyController.getOneJourney);
  
// router.delete('/:id', auth, reservationController.deleteReservation);

module.exports = router