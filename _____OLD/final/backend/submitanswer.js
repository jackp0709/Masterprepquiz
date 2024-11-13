const mongoose = require('mongoose');

// Define schema for submitted answers
const submitAnswerSchema = new mongoose.Schema({
    answers: [
        {
            questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
            selectedOption: { type: String, required: true }
            
        }
    ],
    score: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    submittedAt: { type: Date, default: Date.now }
});


// Create a model for submitted answers
const SubmitAnswer = mongoose.model('SubmitAnswer', submitAnswerSchema);

module.exports = SubmitAnswer;
