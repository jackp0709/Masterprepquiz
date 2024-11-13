// badges.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Badge schema to store the userId, badge name, image path, and when it was awarded
const badgeSchema = new Schema({
    userId: {
        type: String, 
        required: true
    },
    badge: {
        type: String,
        required: true
    },
    imagePath: {
        type: String, // Image path or URL to display the badge image
        required: true
    },
    awardedAt: {
        type: Date,
        default: Date.now
    }
});

// Create the Badge model using the schema
const Badge = mongoose.model('Badge', badgeSchema);

module.exports = Badge;
