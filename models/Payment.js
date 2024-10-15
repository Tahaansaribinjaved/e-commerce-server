const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',  // References the Order model (1:1 relationship)
      required: true
    },
    payment_method: {
      type: String,  // e.g., Stripe, PayPal, etc.
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending'
    }
  }, { timestamps: true });
  
  const Payment = mongoose.model('Payment', paymentSchema);
  
  module.exports = Payment;
  