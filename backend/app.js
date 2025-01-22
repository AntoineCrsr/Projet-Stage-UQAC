const express = require("express")
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path');

const userRouter = require('./routes/user')

mongoose.connect('mongodb+srv://api:wWk7QFVWsMiAzbF7@cluster0.jsudq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((error) => console.log('Connexion à MongoDB échouée :' + error));

const app = express()

app.use(bodyParser.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  }
);


app.use('/api/auth', userRouter)
//app.use('/images', express.static(path.join(__dirname, 'images')))

module.exports = app