require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose');
const client = require('./controllers/client')

const PORT = 3000
const app = express()

app.use(express.json())
app.use(express.static('app'))

mongoose.connect(process.env.MONGO_URI)

app.get('/', (req, res) => {
    console.log(__dirname)
    res.sendFile(`${__dirname}/index.html`)
})

app.listen(PORT, () => console.log('Server started'));
