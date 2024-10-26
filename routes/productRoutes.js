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
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

// Admin Routes (restricted to admins)
router.post('/admin/products', isAuthenticated, isAdmin, createProduct); // Create a product
router.get('/admin/products', isAuthenticated, isAdmin, getAllProductsAdmin); // Get all products (Admin view)
router.put('/admin/products/:id', isAuthenticated, isAdmin, updateProduct); // Update a product
router.delete('/admin/products/:id', isAuthenticated, isAdmin, deleteProduct); // Delete a product
router.get('/admin/summary', isAuthenticated, isAdmin, getAdminSummary); // Get dashboard summary

// User Routes (accessible by authenticated users)
router.get('/products', isAuthenticated, getAllProductsUser); // Get all products (User view)
router.get('/products/:id', isAuthenticated, getProductById); // Get a single product by ID
router.get('/products/featured', isAuthenticated, getFeaturedProducts); // Get featured products (for Home page)

module.exports = router;
