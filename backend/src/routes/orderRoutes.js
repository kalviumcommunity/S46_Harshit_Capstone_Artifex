const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// Get user's orders
router.get("/user/:userId", orderController.getUserOrders);

// Get order by ID
router.get("/:id", orderController.getOrderById);

// Create order from cart
router.post("/", orderController.createOrder);

// Update order status
router.put("/:id/status", orderController.updateOrderStatus);

// Update payment status
router.put("/:id/payment", orderController.updatePaymentStatus);

// Cancel order
router.put("/:id/cancel", orderController.cancelOrder);

module.exports = router;
