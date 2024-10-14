const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  }, 
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String, // (admin/customer)
    required: true
  },
  address: {
    type: String,
    required: true
  },
  orderHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'  // References the Order model
  }],
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart'  // References the Cart model (1:1 relationship)
  }
  ,resetPasswordToken: {type:String}, // Add this field
  resetPasswordExpires: {type:Date}, // Add this field
}, { timestamps: true });

// Hash the password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12); // Hash password with salt rounds
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
