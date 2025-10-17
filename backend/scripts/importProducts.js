require('dotenv').config();
const connectDB = require('../config/db');
const Product = require('../models/Product');
const products = require('../../frontend/src/products.json');

const importProducts = async () => {
  try {
    await connectDB();
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️ Existing products deleted');

    // Insert new products
    const insertedProducts = await Product.insertMany(products);
    console.log(`✅ Successfully imported ${insertedProducts.length} products`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error importing products:', error);
    process.exit(1);
  }
};

importProducts();