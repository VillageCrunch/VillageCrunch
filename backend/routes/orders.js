const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');

// Generate unique order number
const generateOrderNumber = () => {
  const prefix = 'ORD';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
};

// @route   POST /api/orders
// @desc    Create new order and link to user
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentInfo,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      promocode,
      promocodeDiscount,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Validate required fields
    if (!shippingAddress || !shippingAddress.name || !shippingAddress.phone) {
      return res.status(400).json({ message: 'Shipping address name and phone are required' });
    }

    if (!paymentInfo || !paymentInfo.method) {
      return res.status(400).json({ message: 'Payment method is required' });
    }

    // Validate items structure
    for (let item of items) {
      if (!item.product || !item.quantity || !item.price) {
        return res.status(400).json({ message: 'Invalid item structure' });
      }
    }

    const orderData = {
      user: req.user._id,
      orderNumber: generateOrderNumber(),
      items,
      shippingAddress,
      paymentInfo,
      itemsPrice: itemsPrice || 0,
      shippingPrice: shippingPrice || 0,
      taxPrice: taxPrice || 0,
      totalPrice: totalPrice || 0,
      promocode: promocode || null,
      promocodeDiscount: promocodeDiscount || 0,
    };

    // Handle COD orders
    if (paymentInfo.method === 'cod') {
      orderData.status = 'confirmed';
      orderData.isPaid = false;
      orderData.codVerified = false;
    } else {
      // Online payment - mark as paid
      orderData.isPaid = true;
      orderData.status = 'confirmed';
      orderData.paidAt = new Date();
    }

    // ✅ Create the order
    const order = await Order.create(orderData);

    // ✅ Link the order to the user
    await User.findByIdAndUpdate(req.user._id, { $push: { orders: order._id } });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ 
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// @route   GET /api/orders/myorders
// @desc    Get logged in user's orders
// @access  Private
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name image')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name image');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // ✅ Only the user who created the order can view it
    if (order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// @route   PUT /api/orders/:id/pay
// @desc    Update order to paid
// @access  Private
router.put('/:id/pay', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.isPaid = true;
    order.paidAt = Date.now();
    order.status = 'confirmed';
    order.paymentInfo = {
      ...order.paymentInfo,
      ...req.body,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/orders
// @desc    Get all orders (Admin)
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status (Admin)
// @access  Private/Admin
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = req.body.status;

    if (req.body.status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    if (req.body.trackingNumber) {
      order.trackingNumber = req.body.trackingNumber;
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
