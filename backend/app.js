const express = require("express")
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path');
require("dotenv").config();

const userRouter = require('./routes/user')
const carRouter = require('./routes//car')

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
app.use('/api/car', carRouter)
app.use('/images', express.static(path.join(__dirname, 'images')))

module.exports = app