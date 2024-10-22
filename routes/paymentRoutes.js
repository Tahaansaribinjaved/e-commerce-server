const express = require('express');
const router = express.Router();
const {
    createPayment,
    getPaymentByOrderId
} = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware'); // Import the auth middleware

// Payment Routes with Authentication
router.post('/payment', authMiddleware, createPayment);  // To process a payment
router.get('/payment/order/:orderId', authMiddleware, getPaymentByOrderId);  // To get payment details by order ID

module.exports = router;
