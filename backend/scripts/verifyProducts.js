require('dotenv').config();
const connectDB = require('../config/db');
const Product = require('../models/Product');

const verifyProducts = async () => {
  try {
    await connectDB();
    
    // Get all products
    const products = await Product.find({});
    console.log('\n=== Products Summary ===');
    console.log(`Total products: ${products.length}`);
    
    // Categories summary
    const categories = {};
    products.forEach(product => {
      categories[product.category] = (categories[product.category] || 0) + 1;
    });
    
    console.log('\n=== Categories ===');
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`${category}: ${count} products`);
    });
    
    // Featured products
    const featuredCount = products.filter(p => p.featured).length;
    console.log('\n=== Featured Products ===');
    console.log(`Featured products: ${featuredCount}`);
    
    // Sample product details
    const sampleProduct = products[0];
    console.log('\n=== Sample Product Details ===');
    console.log('Name:', sampleProduct.name);
    console.log('Price:', sampleProduct.price);
    console.log('Stock:', sampleProduct.stock);
    console.log('Benefits:', sampleProduct.benefits.length);
    console.log('Ingredients:', sampleProduct.ingredients.length);

    process.exit(0);
  } catch (error) {
    console.error('Error verifying products:', error);
    process.exit(1);
  }
};

verifyProducts();