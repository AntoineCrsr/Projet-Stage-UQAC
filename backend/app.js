const express = require("express")
const bodyParser = require('body-parser')
const path = require('path');
require("dotenv").config();

const userRouter = require('./components/users/userRouter')
const journeyRouter = require('./components/journeys/journeyRouter')
const carRouter = require('./components/cars/carRouter')
const reservationRouter = require('./components/reservation/ReservationRouter')
const reviewRouter = require('./components/reviews/ReviewRouter')
const citiesRouter = require('./components/cities/citiesRouter')

if (process.env.NODE_ENV !== 'test') {
  const connectDB = require('./db');
  connectDB()
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
}
const app = express()

// Parseur JSON
app.use(bodyParser.json({
  verify: (req, res, buf, encoding) => {
    try {
      JSON.parse(buf.toString(encoding));
    } catch (e) {
      e.status = 400;
      e.bodyParsingError = true;
      throw e;
    }
  }
}));
app.use(bodyParser.urlencoded({ extended: true }))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  }
);

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  if (err.bodyParsingError) {
    return res.status(400).json({ "errors": {"internal": {"code": "bad-request", "name":"JSON mal formaté. Veuillez vérifier votre requête."}} });
  }

  console.error(err.stack);
  res.status(500).json({ error: "Erreur interne du serveur." });
});


app.use('/api/auth', userRouter)
app.use('/api/journey', journeyRouter)
app.use('/api/car', carRouter)
app.use('/api/reservation', reservationRouter)
app.use('/api/review', reviewRouter)
app.use('/api/cities', citiesRouter)
app.use('/images', express.static(path.join(__dirname, 'images')))

module.exports = app