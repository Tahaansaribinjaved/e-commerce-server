const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  getAllOrdersAdmin,
  updateOrderStatus,
} = require('../controllers/orderController');

// Order Routes
router.post('/orders', createOrder);                    // Create a new order
router.get('/orders/:id', getOrderById);                // Get an order by ID
router.get('/orders', getAllOrdersAdmin);               // Get all orders (Admin)
router.put('/orders/:id', updateOrderStatus);           // Update order status

module.exports = router;
