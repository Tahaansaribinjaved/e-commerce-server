const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCart, removeFromCart } = require('../controllers/cartController');
const { isAuthenticated } = require('../middleware/authMiddleware');

// Cart Routes (protected with authMiddleware for authenticated users)
router.get('/cart', isAuthenticated, getCart);         // Get the user's cart
router.post('/cart', isAuthenticated, addToCart);      // Add item to cart
router.put('/cart/:id', isAuthenticated, updateCart);  // Update cart item by ID
router.delete('/cart/:id', isAuthenticated, removeFromCart); // Remove cart item by ID

module.exports = router;
