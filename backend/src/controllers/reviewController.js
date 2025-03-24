const Review = require('../models/Review');
const Artwork = require('../models/Artwork');

// Get all reviews for an artwork
const getReviewsByArtwork = async (req, res) => {
  try {
    const reviews = await Review.find({ artwork: req.params.artworkId })
      .populate('user', 'username displayName profilePicture')
      .sort({ createdAt: -1 });
    
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




module.exports = {
    getReviewsByArtwork
  };