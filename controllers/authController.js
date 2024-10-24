// server/controllers/UserController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer'); // for sending emails
const crypto = require('crypto'); 
require('dotenv').config();

// Register user
exports.register = async (req, res) => {
    try {
        const { name, email, password, role, address } = req.body;

        // Validate input
        if (!name || !email || !password || !role || !address) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already exists' });
        }

        // // Hash the password before storing it
        // const hashedPassword = await bcrypt.hash(password, 12);
        // console.log('Hashed Password:', hashedPassword); // Log hashed password for debugging

        const user = new User({ name, email,password, role, address });
        await user.save();
        console.log(user);
        
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare the plaintext password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Entered Password:', password);
        console.log('User Details:', user);
        
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email  password' });
        }

        // If the passwords match, create a token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: error.message });
    }
};


// Forgot password
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate input
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // Configure nodemailer
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL,
            subject: 'Password Reset',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
                  `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
                  `http://localhost:3000/reset-password/${token}\n\n` +
                  `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent with instructions for resetting password.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Reset password
exports.resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        // Validate input
        if (!token || !password) {
            return res.status(400).json({ message: 'Token and new password are required' });
        }

        const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
        if (!user) {
            return res.status(400).json({ message: 'Token is invalid or has expired' });
        }

        user.password = await bcrypt.hash(password, 12);
        user.resetPasswordToken = undefined; // Clear token
        user.resetPasswordExpires = undefined; // Clear expiration
        await user.save();
        res.status(200).json({ message: 'Password has been successfully reset.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
