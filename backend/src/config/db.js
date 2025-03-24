const mongoose = require('mongoose');
require('dotenv').config();     

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
.then(() => {
  console.log('Connected to MongoDB successfully');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

module.exports = mongoose.connection;