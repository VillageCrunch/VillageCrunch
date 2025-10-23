const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// 🧩 GET USER WISHLIST
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json(user.wishlist || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🧩 ADD TO WISHLIST
router.post('/add/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if product is already in wishlist
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    // Add to wishlist
    user.wishlist.push(productId);
    await user.save();

    const updatedUser = await User.findById(req.user._id).populate('wishlist');
    res.json({
      message: 'Product added to wishlist',
      wishlist: updatedUser.wishlist
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🧩 REMOVE FROM WISHLIST
router.delete('/remove/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove from wishlist
    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();

    const updatedUser = await User.findById(req.user._id).populate('wishlist');
    res.json({
      message: 'Product removed from wishlist',
      wishlist: updatedUser.wishlist
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🧩 TOGGLE WISHLIST (ADD/REMOVE)
router.post('/toggle/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let message = '';
    const isInWishlist = user.wishlist.includes(productId);

    if (isInWishlist) {
      // Remove from wishlist
      user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
      message = 'Product removed from wishlist';
    } else {
      // Add to wishlist
      user.wishlist.push(productId);
      message = 'Product added to wishlist';
    }

    await user.save();

    const updatedUser = await User.findById(req.user._id).populate('wishlist');
    res.json({
      message,
      isInWishlist: !isInWishlist,
      wishlist: updatedUser.wishlist
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;