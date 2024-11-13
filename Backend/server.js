// server.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/masterprepquiz', {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// User Model
const signupSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    phone: {
        type: String,
    },
    birthDate: {
        type: Date,
    },
}, { collection: 'User' });

const User = mongoose.model('User', signupSchema);

// Routes

// Registration route
app.post('/api/signup', async (req, res) => {
    const { username, email, password, gender } = req.body;

    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    try {
        const newUser = new User({
            username,
            email,
            password,
            gender,
        });

        await newUser.save();

        // Respond with the user data
        res.status(201).json({
            message: 'User registered successfully',
            user: { username: newUser.username, email: newUser.email, gender: newUser.gender }
        });
    } catch (error) {
        res.status(400).json({ error: 'Error registering user' });
    }
});

// Sign-in route
app.post('/api/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }

        // Plain text password check
        if (user.password !== password) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Respond with the user data
        res.status(200).json({
            message: 'Sign-in successful',
            user: { username: user.username, email: user.email, gender: user.gender }
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Profile update route
app.post('/api/profile/update', async (req, res) => {
    const { email, firstName, lastName, phone, birthDate, gender } = req.body;

    try {
        // Find the user by email and update the profile fields
        const updatedUser = await User.findOneAndUpdate(
            { email },  // Search by email
            { firstName, lastName, phone, birthDate, gender },  // Update these fields
            { new: true }  // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Send the updated user data as a response
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// Profile fetch route
app.get('/api/profile/:email', async (req, res) => {
    const email = req.params.email;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            birthDate: user.birthDate,
            gender: user.gender,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Server setup
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
