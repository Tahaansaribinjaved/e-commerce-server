const express = require('express');
const router = express.Router();
const { createPayment, getPaymentByOrderId } = require('../controllers/paymentController');

// Payment Routes
router.post('/payment', createPayment);  // To process a payment
router.get('/payment/order/:orderId', getPaymentByOrderId);  // To get payment details by order ID

module.exports = router;
