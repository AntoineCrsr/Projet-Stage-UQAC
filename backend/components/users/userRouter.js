const express = require('express')
const router = express.Router()
const controller = require('./userController')
const multer = require('../workspace/multer-config')
const auth = require('../users/userAuth')
const JourneyUpdater = require("../workspace/JourneyStateUpdater")

// Setup des routes

router.get('/:id', JourneyUpdater.updateJourneys, auth, controller.getUser)

router.post('/login', JourneyUpdater.updateJourneys, controller.login)

router.post('/signup', JourneyUpdater.updateJourneys, controller.signup)

router.post('/:id/emailValidation', JourneyUpdater.updateJourneys, auth, controller.verifyEmailNonce)

router.post('/:id/phoneValidation', JourneyUpdater.updateJourneys, auth, controller.verifyPhoneNonce)

router.put('/:id', JourneyUpdater.updateJourneys, auth, multer, controller.modify)

module.exports = router