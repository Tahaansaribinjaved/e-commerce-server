const Cart = require('../models/Cart'); // Assuming you have a Cart model
const Product = require('../models/Product'); // Assuming you have a Product model

// Get Cart
exports.getCart = async (req, res) => {
    console.log('User:', req.user); // Log the user object
    try {
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.status(200).json(cart);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching cart', error });
    }
};

// Add to Cart
exports.addToCart = async (req, res) => {
    const { user, products } = req.body; // Destructure user and products from req.body

    try {
        let cart = await Cart.findOne({ user }); // Get the user's cart

        if (!cart) {
            // Create a new cart if it doesn't exist
            cart = new Cart({ user, products: [], total_price: 0 });
        }

        // Iterate over each product to update the cart
        for (const { product, quantity } of products) {
            const existingItemIndex = cart.products.findIndex(item => item.product.toString() === product);

            if (existingItemIndex > -1) {
                // If the product exists, update the quantity
                cart.products[existingItemIndex].quantity += quantity;
            } else {
                // If it doesn't exist, add a new item
                cart.products.push({ product, quantity });
            }
        }

        // Fetch product details and recalculate the total price
        let totalPrice = 0;

        // Using for...of loop to use await inside
        for (const cartProduct of cart.products) {
            const productDetails = await Product.findById(cartProduct.product); // Fetch product details
            if (productDetails) {
                totalPrice += productDetails.price * cartProduct.quantity;
            } else {
                return res.status(404).json({ message: `Product ${cartProduct.product} not found` });
            }
        }

        cart.total_price = totalPrice;

        await cart.save(); // Save the updated cart to the database
        res.status(200).json({ message: 'Items added to cart', cart });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Error adding to cart', error });
    }
};

// Update Cart
exports.updateCart = async (req, res) => {
    const { user, products } = req.body; // Get user and products from req.body

    if (!user) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        const cart = await Cart.findOne({ user }); // Use the user ID from req.body

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Update the quantities of existing products
        for (const { product, quantity } of products) {
            const itemIndex = cart.products.findIndex(item => item.product.toString() === product);

            if (itemIndex > -1) {
                // Update the quantity if the product exists
                cart.products[itemIndex].quantity = quantity;
            } else {
                return res.status(404).json({ message: `Product ${product} not found in cart` });
            }
        }

        // Recalculate the total price
        let totalPrice = 0;

        for (const cartProduct of cart.products) {
            const productDetails = await Product.findById(cartProduct.product);
            if (!productDetails) {
                return res.status(404).json({ message: `Product ${cartProduct.product} not found` });
            }
            totalPrice += productDetails.price * cartProduct.quantity;
        }

        cart.total_price = totalPrice;

        await cart.save(); // Save the updated cart to the database
        res.status(200).json({ message: 'Cart updated successfully', cart }); // Respond with the updated cart
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ message: 'Error updating cart', error });
    }
};


// Remove Item from Cart
exports.removeFromCart = async (req, res) => {
    const { user, productId } = req.body; // Get user ID and product ID from req.body

    if (!user || !productId) {
        return res.status(400).json({ message: 'User ID and Product ID are required' });
    }

    try {
        const cart = await Cart.findOne({ user }); // Find the user's cart

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Find the index of the product to remove
        const itemIndex = cart.products.findIndex(item => item.product.toString() === productId);

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        // Remove the item from the cart
        cart.products.splice(itemIndex, 1);

        // Recalculate total price after removal
        let totalPrice = 0;
        for (const cartProduct of cart.products) {
            const productDetails = await Product.findById(cartProduct.product);
            if (productDetails) {
                totalPrice += productDetails.price * cartProduct.quantity;
            }
        }

        cart.total_price = totalPrice;

        await cart.save(); // Save the updated cart to the database
        res.status(200).json({ message: 'Item removed from cart', cart }); // Respond with the updated cart
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ message: 'Error removing item from cart', error });
    }
};
