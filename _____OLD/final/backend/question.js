const mongoose = require('mongoose');

// Define the schema for a single question
const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true 
    },

    options:[String],
    correct_option: {
        type: String,
        required: true 
    },
    hint: {
        type: String,
        default: "" 
    }
}
);

/*const subQuestionSchema = new mongoose.Schema({
    subQuestion: {
      type: String,
      required: true
    },
    options: {
      a: { type: String, required: true },
      b: { type: String, required: true },
      c: { type: String, required: true },
      d: { type: String, required: true }
    },
    correctAnswer: {
      type: String, 
      required: true
    }
  });

  const questionSchema = new mongoose.Schema({
    question: {
      type: String,
      required: true
    },
    
    subQuestions: [subQuestionSchema],
    topic: {
      type: String,
      required: true
    }
  });
   */
  


const getQuestionsFromCollection = async (collectionName) => {
    // Dynamically create or get a model for the collection
    const Question = mongoose.model(collectionName, questionSchema, collectionName);
    return Question.find();
};

module.exports = getQuestionsFromCollection;