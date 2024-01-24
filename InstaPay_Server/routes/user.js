const express = require('express');
const userRouter = express.Router();
const jwt = require('jsonwebtoken');
const zod = require('zod');
const bcrypt = require('bcrypt');
const { User } = require('../db');
require('dotenv').config();
const jwt_password = process.env.JWT_Password;

const userValidation = zod.object({
    username: zod.string().email({ message: 'Username must be a valid email' }),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string()
});


userRouter.post('/signup', async (req, res) => {
    const validationResult = userValidation.safeParse(req.body);

    if (!validationResult.success) {
        res.status(400).json({ message: 'Invalid Input', errors: validationResult.error });
        return;
    }

    try {
        const existingUser = await User.find({ username: req.body.username });

        if (existingUser.length === 0) {

            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            const createdUser = await User.create({
                username: req.body.username,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: req.body.password,
                hashedPassword: hashedPassword
            });

            const token = jwt.sign(createdUser.username, jwt_password);

            res.status(201).json({ message: 'User created successfully', token });
        }else{
            res.status(411).json({message: 'User already exists'});
        }
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

module.exports = userRouter;