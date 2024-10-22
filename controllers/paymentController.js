const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Make sure to set your Stripe secret key in your environment variables
const Payment = require('../models/payment');


// Create Payment
exports.createPayment = async (req, res) => {
    const { orderId, payment_method, amount } = req.body;
    if (!orderId || !payment_method || !amount) {
        return res.status(400).json({ message: 'Order ID, payment method, and amount are required.' });
    }

    try {
        // Create a new payment intent with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Convert to cents
            currency: 'usd', // Change to your desired currency
            payment_method: payment_method,
            confirm: true, // Automatically confirm the payment
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never' // Disallow redirects
            },
        });

        // Create a new payment record in your database
        const payment = new Payment({
            order: orderId,
            payment_method: payment_method,
            stripe_payment_id: paymentIntent.id, // Store the payment ID from Stripe
            amount: paymentIntent.amount / 100, // Store amount in dollars
        });

        await payment.save();
        res.status(201).json(payment);
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({ message: 'Error processing payment', error: error.message });
    }
};

// Get Payment by Order ID
exports.getPaymentByOrderId = async (req, res) => {
    try {
        const payment = await Payment.findOne({ order: req.params.orderId });
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payment', error });
    }
};
