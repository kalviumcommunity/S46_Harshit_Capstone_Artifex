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

module.exports = {
  getUserWishlist,
};
