const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Security logging middleware
const logSecurityEvent = (req, eventType, details) => {
  const timestamp = new Date().toISOString();
  const userInfo = req.user ? {
    id: req.user._id,
    email: req.user.email,
    role: req.user.role
  } : 'Anonymous';
  
  console.log(`🛡️ SECURITY LOG [${timestamp}]:`);
  console.log(`🛡️ Event: ${eventType}`);
  console.log(`🛡️ User: ${JSON.stringify(userInfo)}`);
  console.log(`🛡️ IP: ${req.ip}`);
  console.log(`🛡️ User-Agent: ${req.get('User-Agent')}`);
  console.log(`🛡️ Path: ${req.method} ${req.originalUrl}`);
  if (details) {
    console.log(`🛡️ Details: ${JSON.stringify(details)}`);
  }
  console.log('🛡️ =====================================');
};

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }
    
    if (!process.env.JWT_SECRET) {
      console.error('🚨 CRITICAL ERROR: JWT_SECRET not configured');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next();
  } catch (error) {
    console.log('❌ AUTH ERROR:', error.message);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') next();
  else res.status(403).json({ message: 'Not authorized as admin' });
};

module.exports = { protect, admin, logSecurityEvent };
