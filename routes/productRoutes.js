const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProductsAdmin,
  updateProduct,
  deleteProduct,
  getAdminSummary,
  getAllProductsUser,
  getProductById,
  getFeaturedProducts,
} = require('../controllers/productController');

// Admin Routes
router.post('/admin/products', createProduct);             // Create a product
router.get('/admin/products', getAllProductsAdmin);        // Get all products (Admin view)
router.put('/admin/products/:id', updateProduct);          // Update a product
router.delete('/admin/products/:id', deleteProduct);       // Delete a product
router.get('/admin/summary', getAdminSummary);             // Get dashboard summary

// User Routes
router.get('/products', getAllProductsUser);               // Get all products (User view)
router.get('/products/:id', getProductById);               // Get a single product by ID
router.get('/products?limit=4', getFeaturedProducts);      // Get featured products (for Home page)

module.exports = router;
