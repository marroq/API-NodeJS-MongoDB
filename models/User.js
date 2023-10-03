const mongoose = require('mongoose');

const Users = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        minLength: 3
    },
    lastName: {
        type: String,
        required: true, 
        minLength: 2
    }
})

module.exports = Users