// models/payment.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    payment_method: { 
        type: String, 
        enum: ['COD', 'Stripe'],  
        required: true 
    },
    stripe_payment_id: { 
        type: String, 
        required: function() { return this.payment_method === 'Stripe'; } 
    }, 
    amount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
