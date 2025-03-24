const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Routes for users
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);




module.exports = router;