const mongoose = require('mongoose');

const HighlightedCommentSchema = new mongoose.Schema({
  commentId: mongoose.Schema.Types.ObjectId,
  commentText: String,
  locationText: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('HighlightedComment', HighlightedCommentSchema);