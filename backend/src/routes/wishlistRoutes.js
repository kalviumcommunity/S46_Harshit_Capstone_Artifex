const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');

// Routes for wishlist
router.get('/:userId', wishlistController.getUserWishlist);




module.exports = router;