const Artwork = require("../models/Artwork");
const Review = require("../models/Review");

// Get all artworks with filters
const getAllArtworks = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, medium, artist } = req.query;
    const filter = {};

    // Apply filters if provided
    if (category) filter.category = category;
    if (medium) filter.medium = medium;
    if (artist) filter.artist = artist;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const artworks = await Artwork.find(filter)
      .populate("artist", "username displayName profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json(artworks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get artwork by ID
const getArtworkById = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id).populate(
      "artist",
      "username displayName profilePicture bio"
    );

    if (!artwork) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    // Increment view count
    artwork.views += 1;
    await artwork.save();

    res.status(200).json(artwork);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get artworks by artist ID
const getArtworksByArtist = async (req, res) => {
  try {
    const artworks = await Artwork.find({ artist: req.params.artistId }).sort({
      createdAt: -1,
    });

    res.status(200).json(artworks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search artworks
const searchArtworks = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const artworks = await Artwork.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { medium: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
      ],
    }).populate("artist", "username displayName");

    res.status(200).json(artworks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
    getAllArtworks,
    getArtworkById,
    getArtworksByArtist,
    searchArtworks
  };