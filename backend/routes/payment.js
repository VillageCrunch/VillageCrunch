const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const razorpay = require('../config/razorpay');
const { protect } = require('../middleware/auth');
const { paymentRateLimit, securityMonitor, validatePrices } = require('../middleware/security');

// @route   POST /api/payment/create-order
// @desc    Create Razorpay order with all payment methods enabled
// @access  Private
router.post('/create-order', protect, paymentRateLimit, securityMonitor, validatePrices, async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(503).json({ 
        message: 'Payment service not configured. Please contact administrator.' 
      });
    }
    
    const { amount, cartItems } = req.body;
    
    // 🔒 CRITICAL SECURITY: Validate payment amount against cart items
    if (cartItems && cartItems.length > 0) {
      const Product = require('../models/Product');
      let calculatedAmount = 0;
      
      console.log('🔍 PAYMENT SECURITY: Validating payment amount');
      console.log('🔍 User:', req.user._id);
      console.log('🔍 Submitted amount:', amount);
      console.log('🔍 Cart items:', cartItems);
      
      // Validate each cart item price
      for (let item of cartItems) {
        const product = await Product.findById(item.productId || item._id);
        if (!product) {
          console.log('❌ PAYMENT SECURITY: Product not found:', item.productId || item._id);
          return res.status(400).json({ message: 'Invalid product in cart' });
        }
        
        // Validate price match
        if (parseFloat(item.price) !== parseFloat(product.price)) {
          console.log('🚨 PAYMENT SECURITY ALERT: Price mismatch detected!');
          console.log('🚨 Product:', product.name);
          console.log('🚨 Database price:', product.price);
          console.log('🚨 Submitted price:', item.price);
          
          return res.status(400).json({ 
            message: 'Price validation failed. Please refresh your cart.',
            code: 'PAYMENT_PRICE_MISMATCH'
          });
        }
        
        calculatedAmount += parseFloat(product.price) * parseInt(item.quantity);
      }
      
      // Add basic shipping and tax (simplified calculation)
      const shipping = calculatedAmount >= 500 ? 0 : 50;
      const tax = calculatedAmount * 0.18;
      const expectedTotal = calculatedAmount + shipping + tax;
      
      // Allow 1% tolerance for different calculation methods
      if (Math.abs(parseFloat(amount) - expectedTotal) > (expectedTotal * 0.01)) {
        console.log('🚨 PAYMENT SECURITY ALERT: Amount validation failed!');
        console.log('🚨 Expected amount:', expectedTotal);
        console.log('🚨 Submitted amount:', amount);
        console.log('🚨 User:', req.user._id, req.user.email);
        
        return res.status(400).json({ 
          message: 'Payment amount validation failed. Please try again.',
          code: 'PAYMENT_AMOUNT_MISMATCH'
        });
      }
      
      console.log('✅ PAYMENT SECURITY: Amount validation passed');
    }

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