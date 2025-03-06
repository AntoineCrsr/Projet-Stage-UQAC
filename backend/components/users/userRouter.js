const express = require('express')
const router = express.Router()
const controller = require('./userController')
const multer = require('../workspace/multer-config')

// Setup des routes

router.post('/login', controller.login)
router.post('/signup', controller.signup)

module.exports = router