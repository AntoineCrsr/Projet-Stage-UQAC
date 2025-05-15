const express = require('express')
const reservationController = require('./ReservationController')
const auth = require('../users/userAuth')
const router = express.Router()
const JourneyUpdater = require("../workspace/JourneyStateUpdater")

router.post('/', JourneyUpdater.updateJourneys, auth, reservationController.createReservation);
  
router.get('/', JourneyUpdater.updateJourneys, reservationController.getReservations);
    
router.delete('/:id', JourneyUpdater.updateJourneys, auth, reservationController.deleteReservation);

module.exports = router