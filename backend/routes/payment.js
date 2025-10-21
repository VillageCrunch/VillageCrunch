const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const razorpay = require('../config/razorpay');
const { protect } = require('../middleware/auth');

// @route   POST /api/payment/create-order
// @desc    Create Razorpay order with all payment methods enabled
// @access  Private
router.post('/create-order', protect, async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(503).json({ 
        message: 'Payment service not configured. Please contact administrator.' 
      });
    }
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // amount in paise (e.g., 1000 INR = 100000 paise)
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1, // Auto capture payment
      notes: {
        user_id: req.user._id.toString(),
        user_name: req.user.name,
      }
    };

    const order = await razorpay.orders.create(options);
    
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({ 
      message: 'Error creating payment order',
      error: error.message 
    });
  }
});

// @route   POST /api/payment/verify
// @desc    Verify Razorpay payment signature
// @access  Private
router.post('/verify', protect, async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpaySignature) {
      res.json({
        success: true,
        message: 'Payment verified successfully',
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment verification failed',
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Error verifying payment' });
  }
});

// @route   GET /api/payment/key
// @desc    Get Razorpay key
// @access  Public
router.get('/key', (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID });
});

module.exports = router;