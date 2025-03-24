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


// Create new review
const createReview = async (req, res) => {
    try {
      const { artworkId, rating, comment } = req.body;
      const userId = req.body.userId;
      
      // Check if user has already reviewed this artwork
      const existingReview = await Review.findOne({
        artwork: artworkId,
        user: userId
      });
      
      if (existingReview) {
        return res.status(400).json({ message: 'You have already reviewed this artwork' });
      }
      
      const newReview = new Review({
        artwork: artworkId,
        user: userId,
        rating,
        comment
      });
      
      const savedReview = await newReview.save();
      
      // Update artwork average rating
      await updateArtworkRating(artworkId);
      
      const populatedReview = await Review.findById(savedReview._id)
        .populate('user', 'username displayName profilePicture');
      
      res.status(201).json(populatedReview);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };



module.exports = {
    getReviewsByArtwork,
    createReview,
  };