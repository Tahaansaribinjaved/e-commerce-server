const Payment = require('../models/payment');

// Create Payment
exports.createPayment = async (req, res) => {
    const { orderId, payment_method } = req.body;
    try {
        const payment = new Payment({ order: orderId, payment_method });
        await payment.save();
        res.status(201).json(payment);
    } catch (error) {
        res.status(500).json({ message: 'Error processing payment', error });
    }
};

// Get Payment by Order ID
exports.getPaymentByOrderId = async (req, res) => {
    try {
        const payment = await Payment.findOne({ order: req.params.orderId });
        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payment', error });
    }
};
