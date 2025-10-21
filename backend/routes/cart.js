const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name price image images category stock');

    if (!cart) {
      return res.json({ items: [], total: 0 });
    }

    // Filter out items where product no longer exists
    const validItems = cart.items.filter(item => item.product);
    
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    const cartData = {
      items: validItems.map(item => ({
        _id: item.product._id,
        name: item.product.name,
        price: item.price,
        image: item.product.image,
        images: item.product.images,
        category: item.product.category,
        stock: item.product.stock,
        quantity: item.quantity,
        addedAt: item.addedAt,
      })),
      total: cart.getTotal(),
      lastUpdated: cart.lastUpdated,
    };

    res.json(cartData);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error while fetching cart' });
  }
});

// @route   POST /api/cart/add
// @desc    Add item to cart
// @access  Private
router.post('/add', protect, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Verify product exists and get current price
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ 
        message: `Only ${product.stock} items available in stock` 
      });
    }

    // Find or create user's cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    await cart.addItem(productId, quantity, product.price);

    // Return updated cart with populated product data
    const updatedCart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name price image images category stock');

    const cartData = {
      items: updatedCart.items.map(item => ({
        _id: item.product._id,
        name: item.product.name,
        price: item.price,
        image: item.product.image,
        images: item.product.images,
        category: item.product.category,
        stock: item.product.stock,
        quantity: item.quantity,
        addedAt: item.addedAt,
      })),
      total: updatedCart.getTotal(),
    };

    res.json({
      message: 'Item added to cart',
      cart: cartData,
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error while adding to cart' });
  }
});

// @route   PUT /api/cart/update
// @desc    Update item quantity in cart
// @access  Private
router.put('/update', protect, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({ 
        message: 'Product ID and quantity are required' 
      });
    }

    if (quantity < 0) {
      return res.status(400).json({ message: 'Quantity cannot be negative' });
    }

    // Verify product exists and check stock
    if (quantity > 0) {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      if (product.stock < quantity) {
        return res.status(400).json({ 
          message: `Only ${product.stock} items available in stock` 
        });
      }
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    await cart.updateItem(productId, quantity);

    // Return updated cart
    const updatedCart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name price image images category stock');

    const cartData = {
      items: updatedCart.items.map(item => ({
        _id: item.product._id,
        name: item.product.name,
        price: item.price,
        image: item.product.image,
        images: item.product.images,
        category: item.product.category,
        stock: item.product.stock,
        quantity: item.quantity,
        addedAt: item.addedAt,
      })),
      total: updatedCart.getTotal(),
    };

    res.json({
      message: quantity === 0 ? 'Item removed from cart' : 'Cart updated',
      cart: cartData,
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Server error while updating cart' });
  }
});

// @route   DELETE /api/cart/remove/:productId
// @desc    Remove item from cart
// @access  Private
router.delete('/remove/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    await cart.removeItem(productId);

    // Return updated cart
    const updatedCart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name price image images category stock');

    const cartData = {
      items: updatedCart.items.map(item => ({
        _id: item.product._id,
        name: item.product.name,
        price: item.price,
        image: item.product.image,
        images: item.product.images,
        category: item.product.category,
        stock: item.product.stock,
        quantity: item.quantity,
        addedAt: item.addedAt,
      })),
      total: updatedCart.getTotal(),
    };

    res.json({
      message: 'Item removed from cart',
      cart: cartData,
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Server error while removing from cart' });
  }
});

// @route   DELETE /api/cart/clear
// @desc    Clear entire cart
// @access  Private
router.delete('/clear', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.json({ message: 'Cart is already empty' });
    }

    await cart.clearCart();

    res.json({
      message: 'Cart cleared',
      cart: { items: [], total: 0 },
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Server error while clearing cart' });
  }
});

// @route   POST /api/cart/sync
// @desc    Sync local cart with database cart (merge on login)
// @access  Private
router.post('/sync', protect, async (req, res) => {
  try {
    const { localCart = [] } = req.body;

    // Find or create user's cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Merge local cart items with database cart
    for (const localItem of localCart) {
      const product = await Product.findById(localItem._id);
      if (product && product.stock >= localItem.quantity) {
        await cart.addItem(localItem._id, localItem.quantity, product.price);
      }
    }

    // Return merged cart
    const updatedCart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name price image images category stock');

    const cartData = {
      items: updatedCart.items.map(item => ({
        _id: item.product._id,
        name: item.product.name,
        price: item.price,
        image: item.product.image,
        images: item.product.images,
        category: item.product.category,
        stock: item.product.stock,
        quantity: item.quantity,
        addedAt: item.addedAt,
      })),
      total: updatedCart.getTotal(),
    };

    res.json({
      message: 'Cart synced successfully',
      cart: cartData,
    });
  } catch (error) {
    console.error('Sync cart error:', error);
    res.status(500).json({ message: 'Server error while syncing cart' });
  }
});

module.exports = router;