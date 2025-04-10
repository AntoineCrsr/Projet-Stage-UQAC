const express = require("express")
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path');
require("dotenv").config();

const userRouter = require('./components/users/userRouter')
const journeyRouter = require('./components/journeys/journeyRouter')
const carRouter = require('./components/cars/carRouter')
const reservationRouter = require('./components/reservation/ReservationRouter')
const reviewRouter = require('./components/reviews/ReviewRouter')

mongoose.connect(process.env.MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((error) => console.log('Connexion à MongoDB échouée :' + error));

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  }
);


app.use('/api/auth', userRouter)
app.use('/api/journey', journeyRouter)
app.use('/api/car', carRouter)
app.use('/api/reservation', reservationRouter)
app.use('/api/review', reviewRouter)
app.use('/images', express.static(path.join(__dirname, 'images')))

module.exports = app