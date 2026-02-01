const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/auth");

// Auth routes (public)
router.post("/register", userController.register);
router.post("/login", userController.login);

// Current user route (protected)
router.get("/me", authMiddleware, userController.getMe);

// Artists route (public)
router.get("/artists", userController.getArtists);

// User management routes
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
