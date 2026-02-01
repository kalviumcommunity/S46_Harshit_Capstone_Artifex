const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Artwork = require("../models/Artwork");

// Get user's orders
const getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId;

    const orders = await Order.find({ user: userId })
      .populate({
        path: "items.artwork",
        select: "title images price",
      })
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate({
        path: "items.artwork",
        populate: {
          path: "artist",
          select: "username displayName",
        },
      })
      .populate("user", "username email displayName");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create order from cart
const createOrder = async (req, res) => {
  try {
    const { userId, shippingAddress, paymentMethod } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: userId }).populate("items.artwork");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate totals
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.priceAtAdd * item.quantity,
      0
    );
    const shippingCost = 0; // Free shipping or calculate based on location
    const tax = 0; // Calculate based on location
    const total = subtotal + shippingCost + tax;

    // Create order items
    const orderItems = cart.items.map((item) => ({
      artwork: item.artwork._id,
      quantity: item.quantity,
      price: item.priceAtAdd,
    }));

    // Create order
    const order = new Order({
      user: userId,
      items: orderItems,
      shippingAddress,
      subtotal,
      shippingCost,
      tax,
      total,
      paymentMethod,
      status: "pending",
      paymentStatus: "pending",
    });

    await order.save();

    // Mark artworks as unavailable (sold)
    for (const item of cart.items) {
      await Artwork.findByIdAndUpdate(item.artwork._id, { available: false });
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    const populatedOrder = await Order.findById(order._id)
      .populate({
        path: "items.artwork",
        populate: {
          path: "artist",
          select: "username displayName",
        },
      })
      .populate("user", "username email displayName");

    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;

    const updateData = { status };
    if (trackingNumber) {
      updateData.trackingNumber = trackingNumber;
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update payment status
const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus, paymentId } = req.body;

    const updateData = { paymentStatus };
    if (paymentId) {
      updateData.paymentId = paymentId;
    }

    // If payment is successful, update order status to confirmed
    if (paymentStatus === "paid") {
      updateData.status = "confirmed";
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status === "shipped" || order.status === "delivered") {
      return res.status(400).json({ message: "Cannot cancel shipped or delivered orders" });
    }

    // Make artworks available again
    for (const item of order.items) {
      await Artwork.findByIdAndUpdate(item.artwork, { available: true });
    }

    order.status = "cancelled";
    await order.save();

    res.status(200).json({ message: "Order cancelled successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
};
