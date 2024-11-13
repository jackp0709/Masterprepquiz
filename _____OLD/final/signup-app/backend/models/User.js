const mongoose = require('mongoose');

const signupSchema = new mongoose.Schema({
  name: {
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
}, { collection: 'signup' }); // Specify the collection name here
const Signup = mongoose.model('Signup', signupSchema);
module.exports = Signup;



