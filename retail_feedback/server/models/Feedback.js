const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    location: String,
    availability: Number,
    experience: Number,
    comment: String,
});

module.exports = mongoose.model('Feedback', feedbackSchema);