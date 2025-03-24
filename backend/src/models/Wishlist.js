const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WishlistSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  artworks: [{
    type: Schema.Types.ObjectId,
    ref: 'Artwork'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('wishlists', WishlistSchema);