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
      'https://villagecrunch.me',    // production domain
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
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

// --- Health Check ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// --- Serve Frontend Build (React) ---
const __dirnameFull = path.resolve();
app.use(express.static(path.join(__dirnameFull, '../frontend/dist'))); 
// Note: Adjust path if your frontend is not sibling to backend

// --- React Router Fallback (Prevents 404 on reload) ---
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirnameFull, '../frontend/dist/index.html'));
});

// --- Error Handling Middleware ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// --- Start Server ---
const PORT = process.env.PORT || 8080; // DO App Platform typically exposes 8080
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
