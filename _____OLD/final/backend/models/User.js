const mongoose = require('mongoose');
const signupSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, { collection: 'signup' });  

const User = mongoose.model('User', signupSchema);

module.exports = User;

