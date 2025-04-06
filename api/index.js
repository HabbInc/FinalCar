require('dotenv').config();  // Ensure dotenv is loaded to access environment variables

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const Port = process.env.PORT || 5000;  // Use port from .env or default to 5000
const session = require('express-session');
const passport = require('passport');
const passportLocalmongoose = require('passport-local-mongoose');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.SECRET;  // JWT secret from .env
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(5);
const authenticateJWT = require("./middleware/authenticateJWT");

// Middleware
app.use(express.json());  // Parses incoming requests with JSON payloads
app.use(bodyParser.urlencoded({extended: true}));  // For parsing application/x-www-form-urlencoded
app.use(cors({
    origin:"http://localhost:5173",  // Update with your frontend URL
    credentials: true,
}));
app.use(cookieParser());  // For handling cookies

// Database connection
require("./db/connect");

const Client = require('./models/clientDB');
const Reservation = require('./models/reservationDB');

// POST request to register a user
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const userExist = await Client.findOne({ username: username });
        if (userExist) {
            return res.status(422).json({ error: "email already exists" });
        } else {
            const client = new Client({
                username: username,
                password: bcrypt.hashSync(password, salt)
            });
            await client.save();
            res.json(client);
        }

    } catch (e) {
        console.log(e);
    }
});

// POST request to login a user
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const clientExist = await Client.findOne({ username });
        if (clientExist) {
            const passOk = bcrypt.compareSync(password, clientExist.password);
            if (passOk) {
                jwt.sign({
                    id: clientExist._id,
                    username: clientExist.username,
                    password: clientExist.password,
                }, jwtSecret, {}, (err, token) => {
                    if (err) throw err;
                    res.cookie('token', token).json(clientExist);
                });
            } else {
                res.json({ message: "incorrect password" });
            }
        } else {
            res.json({ message: "user not found" });
        }
    } catch (e) {
        console.log(e);
    }
});

// GET request to verify token
app.get('/api/verify', (req, res) => {
    const { token } = req.cookies;

    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, clientData) => {
            if (err) throw err;
            const client = await Client.findById(clientData.id);
            if (!client) {
                res.json({ message: "no user" });
            } else {
                const { username, _id, password } = client;
                res.json({ username, _id, password });
            }
        });
    } else {
        res.json(null);
    }
});

// POST request to create a reservation
app.post('/api/reservation', authenticateJWT, async (req, res) => {
    const { carType, pickPlace, dropPlace, pickDate, dropDate, pickTime, dropTime, firstname, lastname, age, phone, email, address, city, zipcode } = req.body;
    const clientId = req.user.id;

    try {
        const reservation = new Reservation({
            owner: clientId,
            firstname: firstname,
            lastname: lastname,
            age: age,
            phone: phone,
            email: email,
            address: address,
            city: city,
            zipcode: zipcode,
            carType: carType,
            pickPlace: pickPlace,
            dropPlace: dropPlace,
            pickDate: pickDate,
            dropDate: dropDate,
            pickTime: pickTime,
            dropTime: dropTime
        });
        await reservation.save();
        res.json(reservation);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
});

// GET request to retrieve bookings for the logged-in user
app.get('/api/bookings', authenticateJWT, async (req, res) => {
    const userId = req.user.id;
    try {
        const reservation = await Reservation.find({ owner: userId });
        if (reservation) {
            res.json(reservation);
        } else {
            res.json(null);
        }
    } catch (e) {
        res.json(e);
    }
});

// POST request to cancel a booking
app.post('/api/cancel', async (req, res) => {
    const { bookingId } = req.body;
    try {
        const reservation = await Reservation.findOneAndDelete({ _id: bookingId });
        if (reservation) {
            res.json('deleted');
        } else {
            res.json('couldn\'t delete at this stage');
        }
    } catch (e) {
        res.json(e);
    }
});

// POST request to logout
app.post('/api/logout', (req, res) => {
    res.cookie('token', '').json(true);
});

// Start the server on the specified port
app.listen(Port, () => {
    console.log(`Server started on port ${Port}...`);
});
