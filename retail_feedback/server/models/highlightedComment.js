/*
*******************************
Name: Mongoose schema for storing highlighted comments from feedback.
Fuction: Receives the original comment ID, comment text, location, and creation date.
Result: Sends and stores this data to the 'highlightedcomments' MongoDB collection.
*******************************
*/

const mongoose = require('mongoose');

const HighlightedCommentSchema = new mongoose.Schema({
  commentId: mongoose.Schema.Types.ObjectId,
  commentText: String,
  location: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('HighlightedComment', HighlightedCommentSchema);