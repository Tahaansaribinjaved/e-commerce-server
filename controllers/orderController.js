const Order = require('../models/Order');
const Payment = require('../models/payment');

// Create a new order (Generalized for any order creation)
exports.createOrder = async (req, res) => {
  try {
    const { user, products, total_price, payment_method = 'COD' } = req.body;

    const newOrder = new Order({
      user,
      products,
      total_price,
      payment_method,
      status: 'pending', // Setting a default status for all new orders
      delivery_status: 'pending'
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ success: true, order: savedOrder, message: 'Order created successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create order', error: error.message });
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

// Admin: Get all orders (can be reused for user-specific order fetching too)
exports.getAllOrders = async (req, res) => {
  try {
    const query = req.user.isAdmin ? {} : { user: req.user._id };  // Admin fetches all, user fetches own orders

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('products.product', 'name price');

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders', error: error.message });
  }
};

// Update order status (Generalized for status and delivery status updates)
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

// Cancel an order (Reused similar logic with status)
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

// Modify an order (Same controller handles both product and price modifications)
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

// Mark as Delivered and Record Payment (Generalized controller)
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
