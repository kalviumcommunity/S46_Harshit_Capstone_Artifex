const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArtworkSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  artist: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  images: [{
    type: String,
    required: true
  }],
  category: {
    type: String,
    required: true,
    enum: ['painting', 'sculpture', 'photography', 'digital', 'mixed-media', 'other']
  },
  medium: {
    type: String,
    required: true
  },
  dimensions: {
    height: { type: Number },
    width: { type: Number },
    depth: { type: Number, default: 0 },
    unit: { type: String, default: 'cm' }
  },
  price: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  available: {
    type: Boolean,
    default: true
  },
  creationDate: {
    type: Date
  },
  tags: [{
    type: String
  }],
  views: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Artwork = mongoose.model('Artwork', ArtworkSchema);
module.exports = Artwork;
