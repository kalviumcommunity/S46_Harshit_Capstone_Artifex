const express = require("express");
const router = express.Router();
const artworkController = require("../controllers/artworkController");

// Routes for artworks
router.get("/", artworkController.getAllArtworks);
router.get("/search", artworkController.searchArtworks);
router.get("/artist/:artistId", artworkController.getArtworksByArtist);
router.get("/:id", artworkController.getArtworkById);
router.post("/", artworkController.createArtwork);
router.put("/:id", artworkController.updateArtwork);
router.delete("/:id", artworkController.deleteArtwork);

module.exports = router;
