const Product = require('../models/Product'); // Assuming Product model is in models folder
const User = require('../models/User');
const Order = require('../models/Order')
// Admin: Create a New Product
const createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Fetch All Products (Admin View)
const getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Update a Product
const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Delete a Product
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Get Dashboard Summary
const getAdminSummary = async (req, res) => {
  try {
    const productsCount = await Product.countDocuments();
    // Assuming you have Order and User models to count orders and users
    const ordersCount = await Order.countDocuments();
    const usersCount = await User.countDocuments();

    res.status(200).json({
      productsCount,
      ordersCount,
      usersCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User: Fetch All Products (User View with Pagination, Filtering, Sorting)
const getAllProductsUser = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, sortBy, page = 1 } = req.query;
    const query = {};

    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = minPrice;
      if (maxPrice) query.price.$lte = maxPrice;
    }

    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const products = await Product.find(query)
      .sort(sortBy ? { price: sortBy === 'price' ? 1 : -1 } : {})
      .skip(skip)
      .limit(pageSize);

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User: Fetch Product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Home Page: Fetch Featured Products (Limit 4)
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true }).limit(4);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export all controllers
module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminSummary,
  getAllProductsAdmin,
  getAllProductsUser,
  getProductById,
  getFeaturedProducts,
};
