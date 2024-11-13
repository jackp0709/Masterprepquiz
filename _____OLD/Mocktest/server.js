const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Enable CORS for all routes
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/masterprepquiz', {
  //useNewUrlParser: true,
  //useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
});

// API route to get all questions from a specific collection
app.get('/api/questions/:collectionName', async (req, res) => {
  const { collectionName } = req.params; // Fetch collection name from URL parameter
  try { 
    // Dynamically create a model based on the collectionName
    const dynamicQuestionModel = mongoose.model(collectionName, new mongoose.Schema({
      passage: String,
      question: String,
      topic: String,
      options: [String],
      correct_option: String,
      hint: String
    }), collectionName);  // The third argument specifies the collection name

    const questions = await dynamicQuestionModel.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: 'Server error: Unable to fetch questions' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
