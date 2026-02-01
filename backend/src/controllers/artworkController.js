const Artwork = require("../models/Artwork");
const Review = require("../models/Review");

// Get all artworks with filters
const getAllArtworks = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, medium, artist, featured, limit } = req.query;
    const filter = {};

    // Apply filters if provided
    if (category) filter.category = category;
    if (medium) filter.medium = medium;
    if (artist) filter.artist = artist;
    if (featured === "true") filter.isFeatured = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    let query = Artwork.find(filter)
      .populate("artist", "username displayName profilePicture")
      .sort({ createdAt: -1 });

    // Apply limit if provided
    if (limit) {
      query = query.limit(parseInt(limit, 10));
    }

    const artworks = await query;
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
    const { query, limit } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    let searchQuery = Artwork.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { medium: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
      ],
    }).populate("artist", "username displayName");

    if (limit) {
      searchQuery = searchQuery.limit(parseInt(limit, 10));
    }

    const artworks = await searchQuery;
    res.status(200).json(artworks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new artwork
const createArtwork = async (req, res) => {
  try {
    const newArtwork = new Artwork({
      ...req.body,
      views: 0,
      averageRating: 0,
    });

    const savedArtwork = await newArtwork.save();
    res.status(201).json(savedArtwork);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update artwork
const updateArtwork = async (req, res) => {
  try {
    // Don't allow updates to views or averageRating through this endpoint
    if (req.body.views) delete req.body.views;
    if (req.body.averageRating) delete req.body.averageRating;

    const updatedArtwork = await Artwork.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedArtwork) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    res.status(200).json(updatedArtwork);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete artwork
const deleteArtwork = async (req, res) => {
  try {
    const deletedArtwork = await Artwork.findByIdAndDelete(req.params.id);

    if (!deletedArtwork) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    // Delete all reviews associated with this artwork
    await Review.deleteMany({ artwork: req.params.id });

    res.status(200).json({ message: "Artwork deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllArtworks,
  getArtworkById,
  getArtworksByArtist,
  searchArtworks,
  createArtwork,
  updateArtwork,
  deleteArtwork,
};
