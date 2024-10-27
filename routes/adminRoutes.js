const express = require('express');
const { getAllProducts, getAllOrders, getAllUsers } = require('../controllers/adminController');
const {isAuthenticated,isAdmin} = require("../middleware/authMiddleWare")
const router = express.Router();

router.get('/products',isAuthenticated,isAdmin, getAllProducts);
router.get('/orders',isAuthenticated,isAdmin,getAllOrders);
router.get('/users',isAuthenticated,isAdmin,getAllUsers);

module.exports = router;
