const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Stripe API
const Payment = require('../models/payment');
const axios = require('axios'); // For Easypaisa API requests

// Create Payment
exports.createPayment = async (req, res) => {
    const { orderId, payment_method, amount, paymentType } = req.body;

    if (!orderId || !payment_method || !amount || !paymentType) {
        return res.status(400).json({ message: 'Order ID, payment method, amount, and payment type are required.' });
    }

    try {
        let payment;
        let paymentResponse;

        // Handle Stripe payment
        if (paymentType === 'stripe') {
            // Create a new payment intent with Stripe
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount * 100, // Convert to cents
                currency: 'usd', // Change to your desired currency
                payment_method: payment_method,
                confirm: true, // Automatically confirm the payment
                automatic_payment_methods: {
                    enabled: true,
                },
            });

            // Save Stripe payment to the database
            payment = new Payment({
                order: orderId,
                payment_method: payment_method,
                stripe_payment_id: paymentIntent.id,
                amount: paymentIntent.amount / 100, // Store amount in dollars
                status: paymentIntent.status,
                payment_type: 'Stripe',
            });
            paymentResponse = paymentIntent.status;

        } 
        // Handle Easypaisa payment
        else if (paymentType === 'easypaisa') {
            const easypaisaResponse = await axios.post('https://easypaisa-api-endpoint.com/createPayment', {
                orderId: orderId,
                amount: amount,
                payment_method: payment_method,
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.EASYPAISA_CLIENT_SECRET}`
                }
            });

            if (easypaisaResponse.status === 200) {
                // Save Easypaisa payment to the database
                payment = new Payment({
                    order: orderId,
                    payment_method: payment_method,
                    easypaisa_payment_id: easypaisaResponse.data.transactionId, // Easypaisa Transaction ID
                    amount: easypaisaResponse.data.amount,
                    status: 'success',
                    payment_type: 'Easypaisa',
                });
                paymentResponse = 'success';
            } else {
                return res.status(500).json({ message: 'Easypaisa payment failed' });
            }

        } 
        // Handle Cash on Delivery (COD) payment
        else if (paymentType === 'cod') {
            // Save CoD payment to the database as pending
            payment = new Payment({
                order: orderId,
                payment_method: 'COD',
                amount: amount,
                status: 'pending', // Set status to pending until delivery
                payment_type: 'Cash on Delivery',
            });
            paymentResponse = 'pending';
        }

        // Save payment record to the database
        await payment.save();
        res.status(201).json({ payment, status: paymentResponse });

    } catch (error) {
        console.error('Payment processing error:', error);
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
