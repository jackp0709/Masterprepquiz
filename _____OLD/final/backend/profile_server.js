// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors =require('cors');

// Create an Express application
const app = express();
const PORT = process.env.PORT || 6001;

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/masterprepquiz', {
    //useNewUrlParser: true,
    //useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// User model schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, required: true },
    //dob: { type: Date } // Date of birth
});

const User = mongoose.model('signup', userSchema, 'signup');

// Profile route to fetch user details
app.get('/profile', async (req, res) => {
    const email = req.query.email;
    try {
        const user = await User.findOne({ email: email });
        if (user) {
            res.json({
                name: user.name,
                email: user.email,
                gender: user.gender,
                //dob: user.dob // Ensure dob is a field in your user schema
            });
        } else {
            res.status(404).json({ msg: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
