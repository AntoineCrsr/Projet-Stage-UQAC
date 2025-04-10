const express = require('express')
const router = express.Router()
const controller = require('./userController')
const multer = require('../workspace/multer-config')
const auth = require('../users/userAuth')

// Setup des routes

router.get('/:id', auth, controller.getUser)

router.post('/login', controller.login)

router.post('/signup', controller.signup)

router.post('/:id/emailValidation', auth, controller.verifyEmailNonce)

router.post('/:id/phoneValidation', auth, controller.verifyPhoneNonce)

router.put('/:id', auth, multer, controller.modify)

module.exports = router