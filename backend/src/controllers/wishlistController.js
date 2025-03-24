const Wishlist = require("../models/Wishlist");

// Get user's wishlist
const getUserWishlist = async (req, res) => {
  try {
    const userId = req.params.userId;

    let wishlist = await Wishlist.findOne({ user: userId }).populate({
      path: "artworks",
      populate: {
        path: "artist",
        select: "username displayName",
      },
    });

    // If no wishlist exists, create an empty one
    if (!wishlist) {
      wishlist = new Wishlist({
        user: userId,
        artworks: [],
      });
      await wishlist.save();
    }

    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add artwork to wishlist
const addToWishlist = async (req, res) => {
  try {
    const { userId, artworkId } = req.body;

    let wishlist = await Wishlist.findOne({ user: userId });

    // If no wishlist exists, create a new one
    if (!wishlist) {
      wishlist = new Wishlist({
        user: userId,
        artworks: [artworkId],
      });
    } else {
      // Check if artwork is already in the wishlist
      if (wishlist.artworks.includes(artworkId)) {
        return res
          .status(400)
          .json({ message: "Artwork is already in the wishlist" });
      }

      // Add artwork to wishlist
      wishlist.artworks.push(artworkId);
    }

    await wishlist.save();

    const populatedWishlist = await Wishlist.findById(wishlist._id).populate({
      path: "artworks",
      populate: {
        path: "artist",
        select: "username displayName",
      },
    });

    res.status(200).json(populatedWishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove artwork from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { userId, artworkId } = req.params;

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    // Remove artwork from wishlist
    wishlist.artworks = wishlist.artworks.filter(
      (artwork) => artwork.toString() !== artworkId
    );

    await wishlist.save();

    const populatedWishlist = await Wishlist.findById(wishlist._id).populate({
      path: "artworks",
      populate: {
        path: "artist",
        select: "username displayName",
      },
    });

    res.status(200).json(populatedWishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserWishlist,
  addToWishlist,
  removeFromWishlist,
};
