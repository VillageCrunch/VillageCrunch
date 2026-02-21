const express = require('express');
const router = express.Router();
const LiveOrder = require('../models/LiveOrder');
const LiveOrderManager = require('../scripts/liveOrderManager');
const { protect, admin } = require('../middleware/auth');

// @route   GET /api/live-orders
// @desc    Get all live orders (admin only)
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const { status, limit = 20, page = 1 } = req.query;
    const skip = (page - 1) * parseInt(limit);
    
    const filter = status ? { status } : {};
    
    const orders = await LiveOrder.find(filter)
      .populate('user', 'name email phone')
      .populate('cartItems.productId', 'name price category weight')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);
    
    const total = await LiveOrder.countDocuments(filter);
    
    res.json({
      orders,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        totalOrders: total
      }
    });
  } catch (error) {
    console.error('Error fetching live orders:', error);
    res.status(500).json({ message: 'Error fetching live orders' });
  }
});

// @route   GET /api/live-orders/stats
// @desc    Get live order statistics (admin only)
// @access  Private/Admin
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const stats = await LiveOrderManager.getOrderStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching live order stats:', error);
    res.status(500).json({ message: 'Error fetching order statistics' });
  }
});

// @route   GET /api/live-orders/user/:userId
// @desc    Get live orders for specific user (admin only)
// @access  Private/Admin
router.get('/user/:userId', protect, admin, async (req, res) => {
  try {
    const orders = await LiveOrderManager.getOrdersByUser(req.params.userId);
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user live orders:', error);
    res.status(500).json({ message: 'Error fetching user orders' });
  }
});

// @route   GET /api/live-orders/razorpay/:orderId
// @desc    Get live order by Razorpay order ID (admin only)
// @access  Private/Admin
router.get('/razorpay/:orderId', protect, admin, async (req, res) => {
  try {
    const order = await LiveOrderManager.getOrderByRazorpayId(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Live order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching live order by Razorpay ID:', error);
    res.status(500).json({ message: 'Error fetching live order' });
  }
});

// @route   PUT /api/live-orders/:id/status
// @desc    Update live order status (admin only)
// @access  Private/Admin
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['created', 'payment_pending', 'payment_failed', 'paid', 'cancelled', 'converted_to_order'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const order = await LiveOrderManager.updateOrderStatus(req.params.id, status);
    
    if (!order) {
      return res.status(404).json({ message: 'Live order not found' });
    }
    
    res.json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error('Error updating live order status:', error);
    res.status(500).json({ message: 'Error updating order status' });
  }
});

// @route   POST /api/live-orders/:id/convert
// @desc    Convert live order to full order (admin only)
// @access  Private/Admin
router.post('/:id/convert', protect, admin, async (req, res) => {
  try {
    const { shippingAddress } = req.body;
    
    const result = await LiveOrderManager.convertToFullOrder(req.params.id, shippingAddress);
    
    res.json({ 
      message: 'Live order converted to full order successfully',
      liveOrder: result.liveOrder,
      fullOrder: result.fullOrder
    });
  } catch (error) {
    console.error('Error converting live order:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/live-orders/cleanup
// @desc    Cleanup expired orders (admin only)
// @access  Private/Admin
router.post('/cleanup', protect, admin, async (req, res) => {
  try {
    const cleanedCount = await LiveOrderManager.cleanupExpiredOrders();
    res.json({ 
      message: `Successfully cleaned up ${cleanedCount} expired orders`,
      cleanedCount 
    });
  } catch (error) {
    console.error('Error cleaning up expired orders:', error);
    res.status(500).json({ message: 'Error cleaning up expired orders' });
  }
});

// @route   GET /api/live-orders/my-orders
// @desc    Get current user's live orders
// @access  Private
router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await LiveOrderManager.getOrdersByUser(req.user._id);
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user live orders:', error);
    res.status(500).json({ message: 'Error fetching your orders' });
  }
});

module.exports = router;