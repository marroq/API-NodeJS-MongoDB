require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose');
const client = require('./controllers/client')

const PORT = 3000
const app = express()

mongoose.connect(process.env.MONGO_URI)

app.use(express.json())

app.listen(PORT, () => console.log('Server started'));
