const Order = require('../models/Order');
const Payment = require('../models/payment');
const Cart = require('../models/Cart'); // Import Cart model
const User = require('../models/User'); // Import User model



// Create a new order based on Cart
exports.createOrderFromCart = async (req, res) => {
  try {
    const { _id: userId } = req.user; // Extract user ID from the request

    // Fetch cart data for the user
    const cart = await Cart.findOne({ user: userId })
      .populate('products.product', 'name price')
      .populate('user', 'name email');

    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found for user' });

    // Extract cart data to initialize order
    const newOrder = new Order({
      user: cart.user,
      products: cart.products,
      total_price: cart.total_price,
      payment_method: 'COD',
      status: 'pending',
      delivery_status: 'pending',
    });

    // Save the new order
    const savedOrder = await newOrder.save();

    // Add the new order to the user's order history
    await User.findByIdAndUpdate(userId, { $push: { orderHistory: savedOrder._id } });

    // Clear the user's cart after creating the order
    await Cart.deleteOne({ user: userId });

    res.status(201).json({ success: true, order: savedOrder, message: 'Order created successfully from cart.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create order from cart', error: error.message });
  }
};

// Get an order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('products.product', 'name price');

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch order', error: error.message });
  }
};

// Admin: Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const query = req.user.role=='admin' ? {} : { user: req.user._id };

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('products.product', 'name price');

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders', error: error.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, delivery_status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (status) order.status = status;
    if (delivery_status) order.delivery_status = delivery_status;

    const updatedOrder = await order.save();

    res.json({ success: true, order: updatedOrder, message: 'Order status updated successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update order status', error: error.message });
  }
};

// Cancel an order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.status = 'canceled';

    const canceledOrder = await order.save();
    res.json({ success: true, order: canceledOrder, message: 'Order canceled successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to cancel order', error: error.message });
  }
};

// Modify an order
exports.modifyOrder = async (req, res) => {
  try {
    const { products, total_price } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (products) order.products = products;
    if (total_price) order.total_price = total_price;

    const modifiedOrder = await order.save();
    res.json({ success: true, order: modifiedOrder, message: 'Order modified successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to modify order', error: error.message });
  }
};

// Mark as Delivered and Record Payment
exports.markAsDelivered = async (req, res) => {
  try {
    const { amount } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.delivery_status = 'delivered';
    order.status = 'completed';

    const updatedOrder = await order.save();

    const newPayment = await Payment.create({
      order: order._id,
      payment_method: order.payment_method,
      amount,
    });

    res.status(200).json({ success: true, order: updatedOrder, payment: newPayment, message: 'Order delivered and payment recorded.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to mark order as delivered', error: error.message });
  }
};
