const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlistController");

// Routes for wishlist
router.get("/:userId", wishlistController.getUserWishlist);

// Add to wishlist (body params - legacy)
router.post("/", wishlistController.addToWishlist);

// Add to wishlist (URL params - frontend compatible)
router.post("/:userId/:artworkId", wishlistController.addToWishlistByParams);

// Remove from wishlist
router.delete("/:userId/:artworkId", wishlistController.removeFromWishlist);

module.exports = router;
