const mongoose = require('mongoose');

const UserLogin = mongoose.model('UserLogin', {
    username: { type: String, required: true, minLength: 5},
    password: { type: String, required: true, minLength: 5},
})

module.exports = UserLogin;
