const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes'); // Import product routes
// const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const emailRoutes = require('./routes/emailRoutes');
const cors = require('cors');
dotenv.config();

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Use CORS middleware
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Use user authentication routes
app.use('/api/auth', authRoutes);

// Use product routes
app.use('/api', productRoutes);  // Add product routes

// API Routes
// app.use('/api', productRoutes);   // Product management routes
app.use('/api', cartRoutes);      // Cart management routes
app.use('/api', orderRoutes);     // Order management routes
app.use('/api', paymentRoutes);   // Payment management routes


app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/email', emailRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
