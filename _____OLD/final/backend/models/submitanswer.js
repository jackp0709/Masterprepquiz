const mongoose = require('mongoose');

const submitAnswerSchema = new mongoose.Schema({
    userEmail: { type: String, required: true }, // Email of the user who submitted the answers
    answers: [
        {
            questionId: { type: mongoose.Schema.Types.ObjectId, required: true }, // ID of the question
            selectedOption: { type: String, required: true } // Option selected by the user
        }
    ],
    score: { type: Number, required: true }, // Score obtained by the user
    totalQuestions: { type: Number, required: true }, // Total questions in the quiz
    submittedAt: { type: Date, default: Date.now } // Timestamp of submission
});

module.exports = mongoose.model('submitanswers', submitAnswerSchema);
