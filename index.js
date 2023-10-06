require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const user = require('./controllers/users');
const { Auth, isAuthenticated } = require('./controllers/auth');

const PORT = 3000
const app = express()

// Used to convert the response in JSON object
app.use(express.json());
// Used to execute files within app folder
app.use(express.static('app'));

mongoose.connect(process.env.MONGO_URI);

app.get('/users', isAuthenticated, user.list);
app.get('/users/:id', isAuthenticated, user.get);
app.post('/users', isAuthenticated, user.create);
app.put('/users/:id', isAuthenticated, user.update);
app.delete('/users/:id', isAuthenticated, user.delete);

app.post('/register', Auth.register);
app.post('/login', Auth.login);

app.get('/', (request, response) => {
    response.sendFile(`${__dirname}/index.html`)
})

app.get('*', (request, response) => {
    response.status(404).send({message: "This page doesn't exist"});
})

app.listen(PORT, () => console.log('Server started'));
