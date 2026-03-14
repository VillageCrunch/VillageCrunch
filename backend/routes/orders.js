const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');
const { sendOrderConfirmationEmail, sendAdminOrderNotification } = require('../config/email');
const { sendAdminOrderSMS, sendCustomerOrderSMS } = require('../config/sms');
const { orderRateLimit, securityMonitor, validatePrices } = require('../middleware/security');

const isMasalaProduct = (product) => product?.category?.toLowerCase() === 'masala';
const MASALA_BLOCKED_MESSAGE = 'Masala items are coming soon and cannot be purchased yet';

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
router.post('/', protect, orderRateLimit, securityMonitor, validatePrices, async (req, res) => {
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

    // 🔒 CRITICAL SECURITY: SERVER-SIDE PRICE VALIDATION
    console.log('🔍 SECURITY: Starting price validation for order creation');
    console.log('🔍 User:', req.user._id, 'IP:', req.ip);
    console.log('🔍 Submitted items:', JSON.stringify(items, null, 2));
    console.log('🔍 Submitted totals:', { itemsPrice, totalPrice, shippingPrice, taxPrice });
    
    // Validate items structure
    for (let item of items) {
      if (!item.product || !item.quantity || !item.price) {
        console.log('❌ SECURITY ALERT: Invalid item structure detected');
        return res.status(400).json({ message: 'Invalid item structure' });
      }
    }

    // 🔒 CRITICAL: Validate all item prices against database
    const Product = require('../models/Product');
    let calculatedItemsPrice = 0;
    const validatedItems = [];
    
    for (let item of items) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        console.log('❌ SECURITY ALERT: Product not found:', item.product);
        return res.status(400).json({ message: `Product ${item.product} not found` });
      }

      if (isMasalaProduct(product)) {
        return res.status(400).json({ message: MASALA_BLOCKED_MESSAGE });
      }
      
      // Check stock availability
      if (product.stock < item.quantity) {
        console.log('❌ SECURITY ALERT: Insufficient stock for product:', item.product);
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}` 
        });
      }
      
      // 🔒 CRITICAL: Validate submitted price matches database price
      if (parseFloat(item.price) !== parseFloat(product.price)) {
        console.log('🚨 CRITICAL SECURITY ALERT: Price manipulation detected!');
        console.log('🚨 Product:', product.name);
        console.log('🚨 Database price:', product.price);
        console.log('🚨 Submitted price:', item.price);
        console.log('🚨 User:', req.user._id, req.user.email);
        console.log('🚨 IP Address:', req.ip);
        console.log('🚨 User Agent:', req.get('User-Agent'));
        
        // Log for security monitoring
        console.log('🚨 POTENTIAL FRAUD ATTEMPT BLOCKED');
        
        return res.status(400).json({ 
          message: 'Price validation failed. Please refresh and try again.',
          code: 'PRICE_VALIDATION_ERROR'
        });
      }
      
      // Calculate actual item total
      const itemTotal = parseFloat(product.price) * parseInt(item.quantity);
      calculatedItemsPrice += itemTotal;
      
      // Store validated item with actual database price
      validatedItems.push({
        product: item.product,
        name: product.name,
        quantity: parseInt(item.quantity),
        price: parseFloat(product.price), // Use database price, not submitted price
        image: product.image,
        weight: product.weight
      });
    }
    
    // 🔒 CRITICAL: Validate submitted itemsPrice matches calculated total
    const submittedItemsPrice = parseFloat(itemsPrice);
    if (Math.abs(submittedItemsPrice - calculatedItemsPrice) > 0.01) { // Allow 1 paisa tolerance for rounding
      console.log('🚨 CRITICAL SECURITY ALERT: Items price manipulation detected!');
      console.log('🚨 Calculated items price:', calculatedItemsPrice);
      console.log('🚨 Submitted items price:', submittedItemsPrice);
      console.log('🚨 User:', req.user._id, req.user.email);
      
      return res.status(400).json({ 
        message: 'Order total validation failed. Please refresh and try again.',
        code: 'TOTAL_VALIDATION_ERROR'
      });
    }
    
    // 🔒 Validate shipping and tax calculations (basic validation)
    const expectedShipping = calculatedItemsPrice >= 500 ? 0 : 50; // Basic rule
    const expectedTax = calculatedItemsPrice * 0.18; // 18% GST
    
    if (Math.abs(parseFloat(shippingPrice) - expectedShipping) > 0.01 && paymentInfo.method !== 'cod') {
      console.log('⚠️ WARNING: Shipping price discrepancy detected');
      console.log('⚠️ Expected shipping:', expectedShipping, 'Submitted:', shippingPrice);
    }
    
    // 🔒 Final total validation
    const expectedTotal = calculatedItemsPrice + parseFloat(shippingPrice) + parseFloat(taxPrice) - (parseFloat(promocodeDiscount) || 0);
    if (Math.abs(parseFloat(totalPrice) - expectedTotal) > 0.01) {
      console.log('🚨 CRITICAL SECURITY ALERT: Total price manipulation detected!');
      console.log('🚨 Calculated total:', expectedTotal);
      console.log('🚨 Submitted total:', totalPrice);
      
      return res.status(400).json({ 
        message: 'Final order total validation failed. Please refresh and try again.',
        code: 'FINAL_TOTAL_VALIDATION_ERROR'
      });
    }
    
    console.log('✅ SECURITY: All price validations passed');
    console.log('✅ Validated items price:', calculatedItemsPrice);
    console.log('✅ Final total:', expectedTotal);

    // 🔒 Use validated data for order creation
    const orderData = {
      user: req.user._id,
      orderNumber: generateOrderNumber(),
      items: validatedItems, // Use server-validated items
      shippingAddress,
      paymentInfo,
      itemsPrice: calculatedItemsPrice, // Use server-calculated price
      shippingPrice: parseFloat(shippingPrice) || 0,
      taxPrice: parseFloat(taxPrice) || 0,
      totalPrice: parseFloat(totalPrice) || 0,
      promocode: promocode || null,
      promocodeDiscount: parseFloat(promocodeDiscount) || 0,
    };
    
    // 🔒 Additional security logging
    console.log('📦 Creating order with validated data:', {
      user: req.user._id,
      orderNumber: orderData.orderNumber,
      itemsCount: validatedItems.length,
      itemsPrice: calculatedItemsPrice,
      totalPrice: parseFloat(totalPrice)
    });

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

    // 📧📱 Send notifications (don't let notification failures affect order creation)
    try {
      // Send confirmation to customer
      const populatedOrder = await Order.findById(order._id).populate('items.product', 'name image');
      
      // Email to customer
      await sendOrderConfirmationEmail(req.user.email, populatedOrder);
      console.log('✅ Customer confirmation email sent to:', req.user.email);

      // SMS to customer (if they have phone number)
      if (req.user.phone) {
        await sendCustomerOrderSMS(req.user.phone, populatedOrder);
        console.log('✅ Customer confirmation SMS sent to:', req.user.phone);
      }

      // Email notification to admin
      await sendAdminOrderNotification(populatedOrder, {
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone
      });
      console.log('✅ Admin email notification sent for order:', order.orderNumber);

      // SMS notification to admin
      await sendAdminOrderSMS(populatedOrder, {
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone
      });
      console.log('✅ Admin SMS notification sent for order:', order.orderNumber);

    } catch (notificationError) {
      console.error('❌ Notification sending failed:', notificationError.message);
      // Continue with order creation even if notifications fail
    }

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
      .populate('items.product', 'name image price');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is admin or order owner
    const isAdmin = req.user.role === 'admin';
    const isOrderOwner = order.user._id.toString() === req.user._id.toString();
    
    if (!isAdmin && !isOrderOwner) {
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
      .populate('user', 'name email phone')
      .populate('items.product', 'name image price')
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
