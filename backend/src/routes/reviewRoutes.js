const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

// Routes for reviews
router.get("/artwork/:artworkId", reviewController.getReviewsByArtwork);
router.post("/", reviewController.createReview);
router.put("/:id", reviewController.updateReview);
router.delete("/:id", reviewController.deleteReview);

module.exports = router;
