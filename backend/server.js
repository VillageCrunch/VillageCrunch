require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const connectDB = require('./config/db');

// Initialize app
const app = express();

// Connect to MongoDB
connectDB();

// --- Middleware ---
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- CORS Configuration ---
app.use(
  cors({
    origin: [
      'http://localhost:5173',       // local dev
      'http://192.168.1.2:5173',     // network access
      'https://villagecrunch.me',    // production
      process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true
  })
);

// --- API Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/promocodes', require('./routes/promocodes'));
app.use('/api/campaigns', require('./routes/campaigns'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/addresses', require('./routes/addresses'));
app.use('/api/wishlist', require('./routes/wishlist'));

// --- Health Check ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// --- Serve React Frontend (dist inside backend/frontend) ---
const __dirnameFull = path.resolve();
app.use(express.static(path.join(__dirnameFull, 'frontend/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirnameFull, 'frontend/dist/index.html'));
});

// --- Error Handling Middleware ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// --- Start Server ---
const PORT = process.env.PORT || 8080; // DO App Platform exposes 8080
app.listen(PORT, '0.0.0.0', (err) => {
  if (err) {
    console.error('❌ Server failed to start:', err);
    process.exit(1);
  }
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
