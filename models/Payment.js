const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    payment_method: { type: String, required: true },
    stripe_payment_id: { type: String, required: true }, // Store Stripe payment ID
    amount: { type: Number, required: true }, // Store the amount
    createdAt: { type: Date, default: Date.now },
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
