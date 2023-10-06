require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserLogin = require('../models/UserLogin');
const { expressjwt: expressJwt } = require('express-jwt');

const validateJwt = expressJwt({
    secret: process.env.SECRET,
    algorithms: ['HS256']
});

const signToken = (_id) => jwt.sign(
    { _id }, 
    process.env.SECRET, {
        expiresIn: 60,
});

const assignUser = async (request, response, next) => {
    try {
        const user = await UserLogin.findById(request.auth._id);
        if (!user) {
            return response.status(401).end();
        }

        request.user = user;
        next();
    } catch(err) {
        next(err);
    }
}

const isAuthenticated = express.Router().use(validateJwt, assignUser);

const Auth = {
    register: async (request, response) => {
        const { body } = request;

        try {
            const isUser = await UserLogin.findOne({ username: body.username });
            if (isUser) {
                return response.send({ message: 'User already exists'})
            }

            const salt = await bcrypt.genSalt();
            const hash = await bcrypt.hash(body.password, salt);
            const user = await UserLogin.create({ username: body.username, password: hash })

            const signed = signToken(user._id);
            response.status(200).send({ message: `User ${body.username} created successfully` });
        } catch(err) {
            response.status(500).send({ err: err.mesasge });
        }
    },
    login: async (request, response) => {
        const { body } = request

        try {
            const user = await UserLogin.findOne({ username: body.username });
            if (!user) {
                return response.status(401).send({ message: 'Invalid user or password'});
            }

            const isMatch = await bcrypt.compare(body.password, user.password);
            if (isMatch) {
                const signed = signToken(user._id);
                response.status(200).send({ jwt: signed });
            } else {
                response.status(401).send({ message: 'Invalid user or password'});
            }
        } catch(err) {
            console.log(err)
            response.status(500).send({ err: err.message });
        }
    }
}

module.exports = { isAuthenticated, Auth }