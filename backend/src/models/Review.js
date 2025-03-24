const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  artwork: {
    type: Schema.Types.ObjectId,
    ref: 'Artwork',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Prevent duplicate reviews from the same user on the same artwork
ReviewSchema.index({ artwork: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('reviews', ReviewSchema);