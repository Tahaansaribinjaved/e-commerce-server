const express = require('express');
const { 
  createOrderFromCart, 
  getOrderById, 
  getAllOrders, 
  updateOrderStatus, 
  cancelOrder, 
  modifyOrder, 
  markAsDelivered 
} = require('../controllers/orderController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware'); 
const router = express.Router();

// Create a new order
router.post('/orders', isAuthenticated, createOrderFromCart);

// Get an order by ID
router.get('/orders/:id', isAuthenticated, getOrderById);

// Get all orders (admins see all, users see their own)
router.get('/orders', isAuthenticated, getAllOrders);

// Update order status (Admin only)
router.put('/orders/:id/status', isAuthenticated, isAdmin, updateOrderStatus);

// Cancel an order
router.put('/orders/:id/cancel', isAuthenticated, cancelOrder);

// Modify an order (Admin only)
router.put('/orders/:id/modify', isAuthenticated, isAdmin, modifyOrder);

// Mark an order as delivered (Admin only)
router.post('/orders/:id/deliver', isAuthenticated, isAdmin, markAsDelivered);

module.exports = router;
