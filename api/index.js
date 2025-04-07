require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const authenticateJWT = require('./middleware/authenticateJWT');

const PORT = process.env.PORT || 5000;
const jwtSecret = process.env.SECRET;
const salt = bcrypt.genSaltSync(5);

// Middleware setup
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:5173", // Update to your frontend URL
    credentials: true
}));
app.use(cookieParser());

// MongoDB Connection
require('./db/connect');

// Models
const Client = require('./models/clientDB');
const Reservation = require('./models/reservationDB');

// ======================= ROUTES ======================= //

// Register Route
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const userExist = await Client.findOne({ username });
        if (userExist) {
            return res.status(422).json({ error: "Email already exists" });
        }

        const hashedPassword = bcrypt.hashSync(password, salt);
        const client = new Client({ username, password: hashedPassword });
        await client.save();

        res.status(201).json(client);
    } catch (e) {
        console.error("Register Error:", e);
        res.status(500).json({ error: "Server error during registration" });
    }
});

// Login Route
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const client = await Client.findOne({ username });
        if (!client) return res.status(404).json({ message: "User not found" });

        const passOk = bcrypt.compareSync(password, client.password);
        if (!passOk) return res.status(401).json({ message: "Incorrect password" });

        const token = jwt.sign({
            id: client._id,
            username: client.username
        }, jwtSecret);

        res.cookie('token', token, { httpOnly: true }).json(client);
    } catch (e) {
        console.error("Login Error:", e);
        res.status(500).json({ error: "Server error during login" });
    }
});

// Verify Auth Route
app.get('/api/verify', (req, res) => {
    const { token } = req.cookies;
    if (!token) return res.json(null);

    jwt.verify(token, jwtSecret, {}, async (err, clientData) => {
        if (err) return res.status(401).json({ message: "Token invalid" });

        const client = await Client.findById(clientData.id);
        if (!client) return res.status(404).json({ message: "User not found" });

        const { username, _id } = client;
        res.json({ username, _id });
    });
});

// Create Reservation
app.post('/api/reservation', authenticateJWT, async (req, res) => {
    const { carType, pickPlace, dropPlace, pickDate, dropDate, pickTime, dropTime, firstname, lastname, age, phone, email, address, city, zipcode } = req.body;
    const clientId = req.user.id;

    try {
        const reservation = new Reservation({
            owner: clientId,
            firstname, lastname, age, phone, email,
            address, city, zipcode, carType,
            pickPlace, dropPlace, pickDate, dropDate,
            pickTime, dropTime
        });

        await reservation.save();
        res.status(201).json(reservation);
    } catch (error) {
        console.error("Reservation Error:", error);
        res.status(500).json({ error: "Failed to create reservation" });
    }
});

// Get User Bookings
app.get('/api/bookings', authenticateJWT, async (req, res) => {
    const userId = req.user.id;
    try {
        const reservations = await Reservation.find({ owner: userId });
        res.json(reservations);
    } catch (e) {
        console.error("Booking Fetch Error:", e);
        res.status(500).json({ error: "Failed to fetch bookings" });
    }
});

// Cancel Booking
app.post('/api/cancel', authenticateJWT, async (req, res) => {
    const { bookingId } = req.body;
    try {
        const reservation = await Reservation.findOneAndDelete({ _id: bookingId, owner: req.user.id });
        if (!reservation) return res.status(404).json({ message: "Booking not found" });

        res.json({ message: "Booking cancelled successfully" });
    } catch (e) {
        console.error("Cancel Error:", e);
        res.status(500).json({ error: "Failed to cancel booking" });
    }
});

// Logout
app.post('/api/logout', (req, res) => {
    res.cookie('token', '', { httpOnly: true }).json({ message: "Logged out" });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
