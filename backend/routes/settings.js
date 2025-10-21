const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const { protect, admin } = require('../middleware/auth');

// @route   GET /api/settings
// @desc    Get all settings
// @access  Public (for basic settings like currency, tax) / Private (for sensitive settings)
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    
    // Return only public settings if not admin
    if (!req.user || !req.user.isAdmin) {
      return res.json({
        pricing: {
          currency: settings.pricing.currency,
          currencySymbol: settings.pricing.currencySymbol,
          taxRate: settings.pricing.taxRate,
          shippingCharges: settings.pricing.shippingCharges,
          codCharges: settings.pricing.codCharges,
        },
        business: {
          companyName: settings.business.companyName,
          phone: settings.business.phone,
          email: settings.business.email,
        }
      });
    }

    // Return all settings for admin
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/settings
// @desc    Update settings
// @access  Private/Admin
router.put('/', protect, admin, async (req, res) => {
  try {
    console.log('Settings update request body:', JSON.stringify(req.body, null, 2));
    
    // Save data directly as sent from frontend - SIMPLIFIED
    const settings = await Settings.updateSettings(req.body);
    console.log('Settings updated successfully');
    res.json(settings);
  } catch (error) {
    console.error('Settings update error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/settings/pricing
// @desc    Get pricing settings (public)
// @access  Public
router.get('/pricing', async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    res.json(settings.pricing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/settings/pricing
// @desc    Update pricing settings
// @access  Private/Admin
router.put('/pricing', protect, admin, async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    settings.pricing = { ...settings.pricing, ...req.body };
    await settings.save();
    res.json(settings.pricing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/settings/business
// @desc    Get business settings
// @access  Private/Admin
router.get('/business', protect, admin, async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    res.json(settings.business);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/settings/business
// @desc    Update business settings
// @access  Private/Admin
router.put('/business', protect, admin, async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    settings.business = { ...settings.business, ...req.body };
    await settings.save();
    res.json(settings.business);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/settings/calculate-order-total
// @desc    Calculate order total with current settings
// @access  Public
router.post('/calculate-order-total', async (req, res) => {
  try {
    const { items, shippingMethod = 'standard', promocode } = req.body;
    const settings = await Settings.getSettings();
    
    // Calculate subtotal
    let subtotal = 0;
    const processedItems = items.map(item => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      return {
        ...item,
        total: itemTotal
      };
    });

    // Calculate shipping using simplified structure
    let shippingCost = 0;
    const shippingConfig = settings.pricing.shippingCharges[shippingMethod] || settings.pricing.shippingCharges.standard;
    
    if (subtotal < shippingConfig.freeShippingThreshold) {
      shippingCost = shippingConfig.rate;
    }

    // Calculate tax on subtotal + shipping
    const taxableAmount = subtotal + shippingCost;
    const taxAmount = (taxableAmount * settings.pricing.taxRate) / 100;

    // Calculate total before discount
    const totalBeforeDiscount = subtotal + shippingCost + taxAmount;

    // Apply promocode discount (if provided)
    let discount = 0;
    let discountDetails = null;
    if (promocode) {
      discountDetails = {
        code: promocode.code,
        type: promocode.type,
        amount: promocode.discount || 0
      };
      discount = promocode.discount || 0;
    }

    const finalTotal = Math.max(0, totalBeforeDiscount - discount);

    res.json({
      items: processedItems,
      subtotal: Math.round(subtotal),
      shipping: {
        method: shippingMethod,
        cost: Math.round(shippingCost),
        freeShippingThreshold: shippingConfig.freeShippingThreshold,
        qualifiesForFreeShipping: subtotal >= shippingConfig.freeShippingThreshold
      },
      tax: {
        rate: settings.pricing.taxRate,
        amount: Math.round(taxAmount)
      },
      discount: {
        applied: !!promocode,
        amount: Math.round(discount),
        details: discountDetails
      },
      total: Math.round(finalTotal),
      currency: settings.pricing.currency
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/settings/shipping-options
// @desc    Get shipping options with current pricing
// @access  Public
router.get('/shipping-options', async (req, res) => {
  try {
    const { orderValue } = req.query;
    const settings = await Settings.getSettings();
    
    const orderVal = parseFloat(orderValue) || 0;
    const standardFreeShippingEligible = orderVal >= settings.pricing.shippingCharges.standard.freeShippingThreshold;
    const expressFreeShippingEligible = orderVal >= settings.pricing.shippingCharges.express.freeShippingThreshold;

    const shippingOptions = [
      {
        id: 'standard',
        name: 'Standard Delivery',
        description: '5-7 business days',
        cost: standardFreeShippingEligible ? 0 : settings.pricing.shippingCharges.standard.rate,
        estimatedDays: '5-7',
        free: standardFreeShippingEligible
      },
      {
        id: 'express',
        name: 'Express Delivery', 
        description: '2-3 business days',
        cost: expressFreeShippingEligible ? 0 : settings.pricing.shippingCharges.express.rate,
        estimatedDays: '2-3',
        free: expressFreeShippingEligible
      }
    ];

    res.json({
      options: shippingOptions,
      freeShippingThreshold: settings.pricing.shippingCharges.standard.freeShippingThreshold,
      qualifiesForFreeShipping: standardFreeShippingEligible,
      currency: settings.pricing.currency
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;