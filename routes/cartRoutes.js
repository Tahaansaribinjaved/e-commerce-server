const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCart, removeFromCart } = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware'); // Import your auth middleware

// Cart Routes (protected with authMiddleware)
router.get('/cart', authMiddleware, getCart); // Protect this route
router.post('/cart', authMiddleware, addToCart); // Protect this route
router.put('/cart/:id', authMiddleware, updateCart); // Protect this route
router.delete('/cart/:id', authMiddleware, removeFromCart); // Protect this route

module.exports = router;
