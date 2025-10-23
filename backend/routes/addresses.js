const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// 🧩 GET ALL USER ADDRESSES
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('addresses');
    res.json(user.addresses || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🧩 ADD NEW ADDRESS
router.post('/', protect, async (req, res) => {
  try {
    const { street, city, state, pincode, phone, isDefault } = req.body;

    // Validate required fields
    if (!street || !city || !state || !pincode || !phone) {
      return res.status(400).json({ message: 'All address fields including phone are required' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If this is set as default or if it's the first address, make it default
    if (isDefault || user.addresses.length === 0) {
      // Remove default flag from other addresses
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    // Add new address
    const newAddress = {
      street,
      city,
      state,
      pincode,
      phone,
      isDefault: isDefault || user.addresses.length === 0
    };

    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json({
      message: 'Address added successfully',
      address: newAddress,
      addresses: user.addresses
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🧩 UPDATE ADDRESS
router.put('/:addressId', protect, async (req, res) => {
  try {
    const { street, city, state, pincode, phone, isDefault } = req.body;
    const { addressId } = req.params;

    // Validate required fields
    if (!street || !city || !state || !pincode || !phone) {
      return res.status(400).json({ message: 'All address fields including phone are required' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find address by ID
    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
    if (addressIndex === -1) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // If setting as default, remove default flag from other addresses
    if (isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    // Update address
    user.addresses[addressIndex] = {
      ...user.addresses[addressIndex].toObject(),
      street,
      city,
      state,
      pincode,
      phone,
      isDefault: isDefault || false
    };

    await user.save();

    res.json({
      message: 'Address updated successfully',
      address: user.addresses[addressIndex],
      addresses: user.addresses
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🧩 DELETE ADDRESS
router.delete('/:addressId', protect, async (req, res) => {
  try {
    const { addressId } = req.params;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has more than one address
    if (user.addresses.length <= 1) {
      return res.status(400).json({ message: 'You must have at least one address' });
    }

    // Find address by ID
    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
    if (addressIndex === -1) {
      return res.status(404).json({ message: 'Address not found' });
    }

    const wasDefault = user.addresses[addressIndex].isDefault;

    // Remove address
    user.addresses.splice(addressIndex, 1);

    // If deleted address was default, make the first remaining address default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.json({
      message: 'Address deleted successfully',
      addresses: user.addresses
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🧩 SET DEFAULT ADDRESS
router.put('/:addressId/default', protect, async (req, res) => {
  try {
    const { addressId } = req.params;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find address by ID
    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
    if (addressIndex === -1) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // Remove default flag from all addresses
    user.addresses.forEach(addr => addr.isDefault = false);
    
    // Set selected address as default
    user.addresses[addressIndex].isDefault = true;

    await user.save();

    res.json({
      message: 'Default address updated successfully',
      addresses: user.addresses
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🧩 SAVE ADDRESS FROM CHECKOUT (Auto-save new addresses)
router.post('/save-from-checkout', protect, async (req, res) => {
  try {
    const { street, city, state, pincode, phone, saveAddress = true } = req.body;

    // If user doesn't want to save address, just return success
    if (!saveAddress) {
      return res.json({ message: 'Address not saved as requested' });
    }

    // Validate required fields (phone is optional for checkout compatibility)
    if (!street || !city || !state || !pincode) {
      return res.status(400).json({ message: 'All address fields are required' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if this address already exists
    const existingAddress = user.addresses.find(addr => 
      addr.street === street && 
      addr.city === city && 
      addr.state === state && 
      addr.pincode === pincode &&
      addr.phone === (phone || user.phone)
    );

    if (existingAddress) {
      return res.json({ 
        message: 'Address already exists in saved addresses',
        address: existingAddress
      });
    }

    // Add new address (not as default if user already has addresses)
    const newAddress = {
      street,
      city,
      state,
      pincode,
      phone: phone || user.phone, // Use provided phone or fallback to user's main phone
      isDefault: user.addresses.length === 0 // Only default if it's the first address
    };

    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json({
      message: 'Address saved successfully for future use',
      address: newAddress,
      addresses: user.addresses
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;