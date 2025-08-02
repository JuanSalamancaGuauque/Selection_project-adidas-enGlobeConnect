/*
*******************************
Name: Mongoose schema for storing store feedback.
Function: Receives data such as location, availability, staff service, cleanliness, satisfaction, and comments.
Result: Sends and stores this data to the 'feedbacks' collection in MongoDB.
*******************************
*/

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