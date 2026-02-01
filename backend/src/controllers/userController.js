const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || "artifex-secret-key",
    { expiresIn: "7d" }
  );
};

// Register new user
const register = async (req, res) => {
  try {
    const { name, username, email, password, userType } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username: username || email.split("@")[0] }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email or username" });
    }

    const newUser = new User({
      username: username || email.split("@")[0],
      email,
      password,
      userType: userType || "collector",
      displayName: name || username || email.split("@")[0],
      bio: req.body.bio || "",
      profilePicture: req.body.profilePicture || "",
      location: req.body.location || "",
      website: req.body.website || "",
      socialLinks: req.body.socialLinks || {},
    });

    const savedUser = await newUser.save();

    // Generate token
    const token = generateToken(savedUser._id);

    // Return user without password
    const userResponse = savedUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      user: userResponse,
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate token
    const token = generateToken(user._id);

    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      user: userResponse,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get current authenticated user
const getMe = async (req, res) => {
  try {
    // User is attached to request by auth middleware
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all artists
const getArtists = async (req, res) => {
  try {
    const artists = await User.find({ userType: "artist" }).select("-password");
    res.status(200).json(artists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new user (legacy - use register instead)
const createUser = async (req, res) => {
  try {
    const { username, email, password, userType } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email or username" });
    }

    const newUser = new User({
      username,
      email,
      password,
      userType,
      displayName: req.body.displayName || username,
      bio: req.body.bio || "",
      profilePicture: req.body.profilePicture || "",
      location: req.body.location || "",
      website: req.body.website || "",
      socialLinks: req.body.socialLinks || {},
    });

    const savedUser = await newUser.save();

    // Remove password from response
    const userResponse = savedUser.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    // Don't allow updates to password through this endpoint
    if (req.body.password) {
      delete req.body.password;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  getMe,
  getAllUsers,
  getUserById,
  getArtists,
  createUser,
  updateUser,
  deleteUser,
};
