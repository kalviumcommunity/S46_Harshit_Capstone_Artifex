const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    enum: ['artist', 'collector', 'enthusiast'],
    required: true
  },
  displayName: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    default: ''
  },
  profilePicture: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  socialLinks: {
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
    facebook: { type: String, default: '' }
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', UserSchema);
module.exports = User;