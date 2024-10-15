// cartController.js
const Cart = require('../models/Cart'); // Assuming you have a Cart model

// Get Cart
exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart', error });
    }
};

// Import necessary modules

// Add to Cart
// Add to Cart
exports.addToCart = async (req, res) => {
    const { user, products, total_price } = req.body; // Destructure user, products, and total_price from req.body

    try {
        let cart = await Cart.findOne({ user }); // Get the user's cart

        if (!cart) {
            // Create a new cart if it doesn't exist
            cart = new Cart({ user, products: [] });
        }

        // Iterate over each product to update the cart
        products.forEach(({ product, quantity }) => {
            const existingItemIndex = cart.products.findIndex(item => item.product.toString() === product);

            if (existingItemIndex > -1) {
                // If the product exists, update the quantity
                cart.products[existingItemIndex].quantity += quantity;
            } else {
                // If it doesn't exist, add a new item
                cart.products.push({ product, quantity });
            }
        });

        // Recalculate the total price based on the provided total_price
        cart.total_price = total_price;

        await cart.save();
        res.status(200).json({ message: 'Items added to cart', cart });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Error adding to cart', error });
    }
};


// Update Cart
exports.updateCart = async (req, res) => {
    const { user, products } = req.body; // Get user and products from req.body
    const { id } = req.params; // Get the cart item ID from the route parameters

    // Check if user ID is provided
    if (!user) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        const cart = await Cart.findOne({ user: user }); // Use the user ID from req.body

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Iterate over each product to update the quantities
        products.forEach(({ product, quantity }) => {
            const itemIndex = cart.products.findIndex(item => item.product.toString() === product);

            if (itemIndex > -1) {
                // Update the quantity if the product exists
                cart.products[itemIndex].quantity = quantity;
            } else {
                return res.status(404).json({ message: `Product ${product} not found in cart` });
            }
        });

        // Recalculate the total price based on the quantities
        cart.total_price = cart.products.reduce((total, item) => {
            const productPrice = 10; // Replace with actual price retrieval logic
            return total + productPrice * item.quantity;
        }, 0);

        await cart.save();
        res.status(200).json({ message: 'Cart updated successfully', cart });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ message: 'Error updating cart', error });
    }
};



// Remove from Cart
exports.removeFromCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });
        cart.items = cart.items.filter(item => item._id.toString() !== req.params.id); // Remove item
        await cart.save();
        res.status(200).json({ message: 'Item removed from cart', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error removing from cart', error });
    }
};
