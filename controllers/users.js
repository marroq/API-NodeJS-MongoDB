const Users = require('../models/User')

const User = {
    list: async (request, response) => {
        const users = await Users.find();
        response.status(200).send(users);
    },
    get: async (request, response) => {
        const { id } = request.params;
        const user = await Users.findOne({ _id: id})
        if (user) {
            response.status(200).send(user);
        } else {
            response.status(404).send({ message: "User doesn't exist" });
        }
    },
    create: async (request, response) => {
        const user = new Users(request.body);
        try {
            const savedUser = await user.save();
            response.status(201).send(savedUser._id);    
        } catch (err) {
            response.status(400).json({message: err.message})
        }
    },
    update: async (request, response) => {
        const { id } = request.params;
        const user = await Users.findOne({ _id: id });
        if (user) {
            Object.assign(user, request.body);
            user.save();
            response.sendStatus(204);
        } else {
            response.status(404).send({ message: "User doesn't exist" })
        }
    },
    delete: async (request, response) => {
        const { id } = request.params;
        const user = await Users.findOne({ _id: id});
        if (user) {
            user.deleteOne();
            response.sendStatus(204);
        } else {
            response.status(404).send({ message: "User doesn't exist" })
        }
    }
}

module.exports = User