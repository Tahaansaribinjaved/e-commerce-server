const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // References the User model (1:1 relationship)
      required: true
    },
    products: [{
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'  // References the Product model
      },
      quantity: {
        type: Number,
        required: true
      }
    }],
    total_price: {
      type: Number,
      required: true
    }
  }, { timestamps: true });
  
  const Cart = mongoose.model('Cart', cartSchema);
  
  module.exports = Cart;
  