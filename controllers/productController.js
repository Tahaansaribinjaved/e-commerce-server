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

const getAllProductsUser = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, sortBy, order = 'asc', page = 1, name } = req.query;
    const query = {};

    // Filtering by category and name (case-insensitive)
    if (category) query.category = category;
    if (name) query.name = { $regex: name, $options: 'i' };

    // Price range filtering
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Pagination and sorting setup
    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    const sortCriteria = sortBy ? { [sortBy]: order === 'asc' ? 1 : -1 } : {};

    // Fetching products with filters, sorting, and pagination
    const products = await Product.find(query)
      .sort(sortCriteria)
      .skip(skip)
      .limit(pageSize);

    // Get total count for pagination metadata
    const totalProducts = await Product.countDocuments(query);

    res.status(200).json({
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / pageSize),
      totalProducts,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
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
    const products = await Product.find(({"isFeatured":true})).limit(4);
    if (!products) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(products);
  } catch (error) {
    console.log("error")
    res.status(500).json({ error: error.message });
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
