const Order = require('../models/Order.js');

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { user, products, total_price } = req.body;

    const newOrder = new Order({
      user,
      products,
      total_price
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get an order by ID
const getOrderById = async (req, res) => {
  try {
    // Find the order by ID and populate user and product details
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email') // Populating only the name and email from User
      .populate('products.product', 'name price'); // Populating only name and price from Product

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders (Admin view)
const getAllOrdersAdmin = async (req, res) => {
  try {
    // Fetch all orders and populate user and product details
    const orders = await Order.find()
      .populate('user', 'name email') // Populating name and email from User
      .populate('products.product', 'name price'); // Populating name and price from Product

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getAllOrdersAdmin,
  updateOrderStatus,
};
