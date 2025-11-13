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
// Use helmet but customize Content Security Policy to allow Razorpay script
app.use(
  helmet({
    // Keep default protections, but override CSP
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://checkout.razorpay.com"],
        scriptSrcElem: ["'self'", "https://checkout.razorpay.com"],
        connectSrc: ["'self'", 'https://api.razorpay.com', 'https://lumberjack.razorpay.com'],
        frameSrc: ["'self'", 'https://checkout.razorpay.com', 'https://api.razorpay.com'],
        imgSrc: ["'self'", 'data:', 'https://*'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
      }
    }
  })
);
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

// --- Serve Static Files (for image uploads) ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
app.use('/api/seo', require('./routes/seo'));
app.use('/api/support', require('./routes/support'));

// --- Health Check ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// --- SEO Routes (at root level for better crawling) ---
// Direct implementation to avoid routing issues
app.get('/sitemap.xml', async (req, res) => {
  try {
    const Product = require('./models/Product');
    const baseUrl = process.env.FRONTEND_URL || 'https://villagecrunch.me';
    
    // Static pages
    const staticPages = [
      { url: '', priority: '1.0', changefreq: 'daily' },
      { url: '/about', priority: '0.8', changefreq: 'monthly' },
      { url: '/contact', priority: '0.7', changefreq: 'monthly' },
      { url: '/products', priority: '0.9', changefreq: 'daily' },
      { url: '/shipping-policy', priority: '0.5', changefreq: 'yearly' },
      { url: '/returns-policy', priority: '0.5', changefreq: 'yearly' },
    ];

    // Get all products
    const products = await Product.find({ isActive: true }, '_id name category updatedAt').lean();
    
    // Category pages
    const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
    const categoryPages = categories.map(category => ({
      url: `/products?category=${encodeURIComponent(category)}`,
      priority: '0.8',
      changefreq: 'weekly'
    }));

    // Generate XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Add static pages
    staticPages.forEach(page => {
      sitemap += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    });

    // Add category pages
    categoryPages.forEach(page => {
      sitemap += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    });

    // Add product pages
    products.forEach(product => {
      const lastmod = product.updatedAt ? 
        new Date(product.updatedAt).toISOString().split('T')[0] : 
        new Date().toISOString().split('T')[0];
      
      sitemap += `
  <url>
    <loc>${baseUrl}/product/${product._id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

    sitemap += `
</urlset>`;

    res.set('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).set('Content-Type', 'application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://villagecrunch.me</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`);
  }
});

app.get('/robots.txt', (req, res) => {
  const baseUrl = process.env.FRONTEND_URL || 'https://villagecrunch.me';
  
  const robotsTxt = `User-agent: *
Allow: /

# Disallow admin and user-specific pages
Disallow: /admin
Disallow: /cart
Disallow: /checkout
Disallow: /profile
Disallow: /orders
Disallow: /wishlist
Disallow: /login
Disallow: /register
Disallow: /forgot-password
Disallow: /reset-password

# Allow important pages
Allow: /
Allow: /products
Allow: /product/
Allow: /about
Allow: /contact
Allow: /shipping-policy
Allow: /returns-policy

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Crawl delay (optional)
Crawl-delay: 1`;

  res.set('Content-Type', 'text/plain');
  res.send(robotsTxt);
});

// --- Serve React Frontend (dist inside backend/frontend) ---
const __dirnameFull = path.resolve();
app.use(express.static(path.join(__dirnameFull, 'frontend/dist')));

// Catch-all handler: send back React's index.html file (but exclude API and SEO routes)
app.get('*', (req, res) => {
  // Don't serve React app for API or SEO routes
  if (req.path.startsWith('/api/') || req.path === '/sitemap.xml' || req.path === '/robots.txt') {
    return res.status(404).json({ error: 'Route not found' });
  }
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
