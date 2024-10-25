const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');  // Ensure auth is imported

// Create a new order (Authenticated)
router.post('/orders', authMiddleware, orderController.createOrder); 

// Get an order by ID (Authenticated)
router.get('/orders/:id', authMiddleware, orderController.getOrderById); 

// Admin: Get all orders (Authenticated)
router.get('/orders', authMiddleware, orderController.getAllOrdersAdmin); 

// Update order status (Authenticated)
router.put('/orders/:id', authMiddleware, orderController.updateOrderStatus); 

// Create COD Order (Authenticated)
router.post('/orders/cod', authMiddleware, orderController.createCODOrder);

// Cancel Order (Authenticated)
router.put('/orders/:orderId/cancel', authMiddleware, orderController.cancelOrder);

// Modify Order (Authenticated)
router.put('/orders/:orderId/modify', authMiddleware, orderController.modifyOrder);

// Mark as Delivered and Record Payment (Authenticated)
router.put('/orders/:orderId/delivered', authMiddleware, orderController.markAsDelivered);

module.exports = router;
