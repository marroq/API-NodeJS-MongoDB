const express = require('express')
const client = require('./Controllers/client')

const app = express()

app.use(express.json())

app.listen(3000, () => console.log('Servidor iniciado'));
