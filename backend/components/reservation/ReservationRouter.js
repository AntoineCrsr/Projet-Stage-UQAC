const express = require('express')
const reservationController = require('./ReservationController')
const auth = require('../users/userAuth')
const router = express.Router()

router.post('/', auth, reservationController.createReservation);
  
router.get('/', reservationController.getReservations);
  
// router.get('/:id', journeyController.getOneJourney);
  
router.put('/:id', auth, reservationController.modifyReservation);

router.delete('/:id', auth, reservationController.deleteReservation);

module.exports = router