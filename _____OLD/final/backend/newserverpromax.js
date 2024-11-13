const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Enable CORS for all routes
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/masterprepquiz', {
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
});

// Define the schema for a question
const questionSchema = new mongoose.Schema({
    passage: String,
    question: String,
    topic: String,
    options: [String],
    correct_option: String,
    hint: String,
    date: {
        type: Date,
        required: true
    }
});

// Create a model for dynamically fetched collections
const getQuestionsFromCollection = (collectionName) => {
    return mongoose.model(collectionName, questionSchema, collectionName);
};

const bookmarkSchema = new mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId, // Ensure this matches the model name of your Question schema
        required: true
    },
    collectionName: {
        type: String, // Include this so you know which collection the question is from
        required: true
    }
    
});

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

// API Route 1: Fetch General Questions from any specific collection
app.get('/api/questions/:collectionName', async (req, res) => {
    try {
        const collectionName = req.params.collectionName;
        const Question = getQuestionsFromCollection(collectionName);
        const questions = await Question.find();
        res.json(questions);
    } catch (err) {
        console.error('Error fetching questions:', err);
        res.status(500).json({ message: 'Server error: Unable to fetch questions' });
    }
});

// API Route 2: Fetch Question of the Day (questions for today’s date)
app.get('/api/question_of_the_day', async (req, res) => {
    try {
        const today = new Date();
        const startOfToday = new Date(today.setHours(0, 0, 0, 0));
        const endOfToday = new Date(today.setHours(23, 59, 59, 999));

        const questions = await getQuestionsFromCollection('Question_of_the_day').find({
            date: {
                $gte: startOfToday,
                $lt: endOfToday
            }
        });

        if (questions.length > 0) {
            res.json(questions);
        } else {
            res.status(404).json({ message: 'No questions found for today' });
        }
    } catch (err) {
        console.error('Error fetching questions:', err);
        res.status(500).json({ message: 'Server error: Unable to fetch questions' });
    }
});

// API Route 3: Mock Test Specific Collection (e.g., nimcet_maths)
app.post('/api/submit_exam', async (req, res) => {
    try {
        const { answers, collectionName } = req.body;

        const Question = getQuestionsFromCollection(collectionName);
        const questions = await Question.find();

        let score = 0;
        const results = [];

        answers.forEach(answer => {
            const question = questions.find(q => q._id.toString() === answer.questionId);
            const isCorrect = question && question.correct_option === answer.selectedOption;
            if (isCorrect) score += 1;

            results.push({
                questionId: answer.questionId,
                selectedOption: answer.selectedOption,
                correctOption: question.correct_option,
                isCorrect
            });
        });

        res.json({ score, results });
    } catch (err) {
        console.error('Error submitting exam:', err);
        res.status(500).json({ message: 'Server error: Unable to submit exam' });
    }
});

app.post('/api/bookmark', async (req, res) => {
    const { questionId, collectionName } = req.body;

    try {
        // Check if the question is already bookmarked
        const existingBookmark = await Bookmark.findOne({ questionId, collectionName });
        if (existingBookmark) {
           return res.status(400).send({ message: 'Question is already bookmarked' });
        } 
            // Create a new bookmark
            const bookmark = new Bookmark({ questionId, collectionName});
            const savedBookmark = await bookmark.save();
            console.log("Bookmark saved:", savedBookmark);
            return res.send({ message: 'Bookmark saved successfully' });
        
    } catch (err) {
        console.error('Error bookmarking question:', err);
        return res.status(500).send('Server error');
    }
});
// API endpoint to get all bookmarks
app.get('/api/bookmarks', async (req, res) => {
    try {
        const bookmarks = await Bookmark.find(); // Fetch bookmarks first
        const fullBookmarks = [];

        // For each bookmark, fetch the associated question from the correct collection
        for (let bookmark of bookmarks) {
            const { collectionName, questionId } = bookmark;

            // Fetch the specific question model
            const Question = getQuestionsFromCollection(collectionName);
            const question = await Question.findById(questionId); // Use findById for better clarity

            if (question) {
                fullBookmarks.push({
                    _id: bookmark._id,
                    passage: question.passage,
                    questionId: bookmark.questionId,
                    collectionName: bookmark.collectionName,
                    question: question.question,
                    options: question.options,
                    correct_option: question.correct_option,
                    hint: question.hint
                });
            }
        }

        console.log("Full Bookmarks with Questions:", fullBookmarks);
        res.json(fullBookmarks); // Send full bookmark with question details
    } catch (err) {
        console.error('Error fetching bookmarks:', err);
        res.status(500).send('Server error');
    }
});

app.delete('/api/delete_bookmark', async (req, res) => {
    const { questionId } = req.body; // Extract questionId and collectionName from request body
    
    try {
        // Delete the bookmark using Mongoose's deleteOne method
        const result = await Bookmark.deleteOne({ questionId });

        if (result.deletedCount > 0) {
            res.json({ success: true, message: 'Bookmark deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Bookmark not found' });
        }
    } catch (error) {
        console.error('Error deleting bookmark:', error);
        res.status(500).json({ success: false, error: 'Error deleting bookmark' });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
