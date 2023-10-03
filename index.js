require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose');
const user = require('./controllers/users')

const PORT = 3000
const app = express()

app.use(express.json())
app.use(express.static('app'))

mongoose.connect(process.env.MONGO_URI)

app.get('/users', user.list);
app.get('/users/:id', user.get);
app.post('/users', user.create);
app.put('/users/:id', user.update);
app.delete('/users/:id', user.delete);

app.get('/', (request, response) => {
    response.sendFile(`${__dirname}/index.html`)
})

app.get('*', (request, response) => {
    response.status(404).send({message: "This page doesn't exist"});
})

app.listen(PORT, () => console.log('Server started'));
