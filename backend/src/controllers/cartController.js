const Cart = require("../models/Cart");
const Artwork = require("../models/Artwork");

// Get user's cart
const getCart = async (req, res) => {
  try {
    const userId = req.params.userId;

    let cart = await Cart.findOne({ user: userId }).populate({
      path: "items.artwork",
      populate: {
        path: "artist",
        select: "username displayName",
      },
    });

    // If no cart exists, create an empty one
    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [],
      });
      await cart.save();
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const { userId, artworkId, quantity = 1 } = req.body;

    // Get artwork to fetch current price
    const artwork = await Artwork.findById(artworkId);
    if (!artwork) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    if (!artwork.available) {
      return res.status(400).json({ message: "Artwork is not available" });
    }

    let cart = await Cart.findOne({ user: userId });

    // If no cart exists, create a new one
    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [
          {
            artwork: artworkId,
            quantity,
            priceAtAdd: artwork.price,
          },
        ],
      });
    } else {
      // Check if artwork is already in cart
      const existingItem = cart.items.find(
        (item) => item.artwork.toString() === artworkId
      );

      if (existingItem) {
        // Update quantity
        existingItem.quantity += quantity;
      } else {
        // Add new item
        cart.items.push({
          artwork: artworkId,
          quantity,
          priceAtAdd: artwork.price,
        });
      }
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: "items.artwork",
      populate: {
        path: "artist",
        select: "username displayName",
      },
    });

    res.status(200).json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const { userId, artworkId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(
      (item) => item.artwork.toString() === artworkId
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    item.quantity = quantity;
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: "items.artwork",
      populate: {
        path: "artist",
        select: "username displayName",
      },
    });

    res.status(200).json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const { userId, artworkId } = req.params;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.artwork.toString() !== artworkId
    );

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: "items.artwork",
      populate: {
        path: "artist",
        select: "username displayName",
      },
    });

    res.status(200).json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({ message: "Cart cleared successfully", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
