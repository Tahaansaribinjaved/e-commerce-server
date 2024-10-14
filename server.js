const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes'); // Import product routes
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
app.use('/api/auth', userRoutes);

// Use product routes
app.use('/api', productRoutes);  // Add product routes

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
