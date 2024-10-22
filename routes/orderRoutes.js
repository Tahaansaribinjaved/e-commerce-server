const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  getAllOrdersAdmin,
  updateOrderStatus,
} = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware'); // Import the auth middleware

// Order Routes with Authentication
router.post('/orders', authMiddleware, createOrder);                 // Create a new order (Authenticated)
router.get('/orders/:id', authMiddleware, getOrderById);             // Get an order by ID (Authenticated)
router.get('/orders', authMiddleware, getAllOrdersAdmin);            // Get all orders (Admin view) (Authenticated)
router.put('/orders/:id', authMiddleware, updateOrderStatus);        // Update order status (Authenticated)

module.exports = router;
