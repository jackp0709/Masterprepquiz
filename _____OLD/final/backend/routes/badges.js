const express = require('express');
const router = express.Router();
const Badge = require('../models/badge');
const app=express(); // Assuming you have a Badge model

// Route to post badge
app.post('/api/badges/:userId', async (req, res) => {
    const { badge, badgeImage } = req.body;
    const userId = req.params.userId;
  
    try {
        const result = await db.collection('badges').insertOne({ userId, badge, badgeImage });
        res.status(201).json({ message: 'Badge saved successfully', result });
    } catch (error) {
        res.status(500).json({ message: 'Error saving badge', error });
    }
});
