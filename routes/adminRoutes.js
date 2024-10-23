const express = require('express');
const { getAllProducts, getAllOrders, getAllUsers } = require('../controllers/adminController');

const router = express.Router();

router.get('/products', getAllProducts);
router.get('/orders', getAllOrders);
router.get('/users', getAllUsers);

module.exports = router;
