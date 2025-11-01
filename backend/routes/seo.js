const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

// Generate sitemap.xml
router.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = process.env.FRONTEND_URL || 'https://villagecrunch.me';
    
    // Static pages
    const staticPages = [
      { url: '', priority: '1.0', changefreq: 'daily' },
      { url: '/about', priority: '0.8', changefreq: 'monthly' },
      { url: '/contact', priority: '0.7', changefreq: 'monthly' },
      { url: '/products', priority: '0.9', changefreq: 'daily' },
      { url: '/shipping-policy', priority: '0.5', changefreq: 'yearly' },
      { url: '/returns-policy', priority: '0.5', changefreq: 'yearly' },
      { url: '/login', priority: '0.6', changefreq: 'monthly' },
      { url: '/register', priority: '0.6', changefreq: 'monthly' },
    ];

    // Get all products
    const products = await Product.find({ isActive: true }, '_id name updatedAt').lean();
    
    // Category pages
    const categories = [...new Set(products.map(p => p.category))];
    const categoryPages = categories.map(category => ({
      url: `/products?category=${encodeURIComponent(category)}`,
      priority: '0.8',
      changefreq: 'weekly'
    }));

    // Generate XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

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
    res.status(500).send('Error generating sitemap');
  }
});

// Generate robots.txt
router.get('/robots.txt', (req, res) => {
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
Sitemap: ${baseUrl}/api/seo/sitemap.xml

# Crawl delay (optional)
Crawl-delay: 1`;

  res.set('Content-Type', 'text/plain');
  res.send(robotsTxt);
});

module.exports = router;