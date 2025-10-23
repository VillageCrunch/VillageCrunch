require('dotenv').config();
const Razorpay = require('razorpay');

let razorpayInstance = null;

// Only initialize if keys are provided
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  console.log('✅ Razorpay initialized');
} else {
  console.log('⚠️ Razorpay not configured - payment features will be disabled');
}

module.exports = razorpayInstance;