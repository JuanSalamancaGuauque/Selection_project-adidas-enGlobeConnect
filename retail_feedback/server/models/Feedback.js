const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    location: String,
    availability: Number,
    experience: Number,
    comment: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', feedbackSchema);