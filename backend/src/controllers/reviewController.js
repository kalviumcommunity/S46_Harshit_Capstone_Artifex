const Review = require("../models/Review");
const Artwork = require("../models/Artwork");

// Get all reviews for an artwork
const getReviewsByArtwork = async (req, res) => {
  try {
    const reviews = await Review.find({ artwork: req.params.artworkId })
      .populate("user", "username displayName profilePicture")
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
      user: userId,
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this artwork" });
    }

    const newReview = new Review({
      artwork: artworkId,
      user: userId,
      rating,
      comment,
    });

    const savedReview = await newReview.save();

    // Update artwork average rating
    await updateArtworkRating(artworkId);

    const populatedReview = await Review.findById(savedReview._id).populate(
      "user",
      "username displayName profilePicture"
    );

    res.status(201).json(populatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update review
const updateReview = async (req, res) => {
  try {
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate("user", "username displayName profilePicture");

    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Update artwork average rating
    await updateArtworkRating(updatedReview.artwork);

    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete review
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Store artwork ID before deleting the review
    const artworkId = review.artwork;

    await Review.deleteOne({ _id: req.params.id });

    // Update artwork average rating
    await updateArtworkRating(artworkId);

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to update artwork average rating
const updateArtworkRating = async (artworkId) => {
  try {
    const reviews = await Review.find({ artwork: artworkId });

    if (reviews.length === 0) {
      await Artwork.findByIdAndUpdate(artworkId, { averageRating: 0 });
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    await Artwork.findByIdAndUpdate(artworkId, {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
    });
  } catch (error) {
    console.error("Error updating artwork rating:", error);
  }
};

module.exports = {
  getReviewsByArtwork,
  createReview,
  updateReview,
  deleteReview,
};
