const mongoose = require('mongoose');

const Clients = mongoose.model('Client', {
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

module.exports = Clients