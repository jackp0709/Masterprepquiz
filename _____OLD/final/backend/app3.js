// /app.js (or your main backend file)
const express = require('express');
const app = express();
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/masterprepquiz')//, { useNewUrlParser: true, useUnifiedTopology: true });

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// Question fetching API
app.get('/api/questions/:collectionName', (req, res) => {
    const collectionName = req.params.collectionName;
    mongoose.connection.db.collection(collectionName, (err, collection) => {
        if (err) throw err;
        collection.find({}).toArray((err, questions) => {
            if (err) throw err;
            res.json(questions);
        });
    });
});

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
