const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCart, removeFromCart } = require('../controllers/cartController');



// Cart Routes
router.get('/cart', getCart);
router.post('/cart', addToCart);
router.put('/cart/:id', updateCart);
router.delete('/cart/:id', removeFromCart);

module.exports = router;
