const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    location: String,
    availability: Number,
    staff: String,
    cleanliness: Number,
    satisfaction: Number,
    comment: String,
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Feedback', feedbackSchema);