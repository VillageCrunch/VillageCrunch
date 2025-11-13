require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const updateThekuaWeight = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    
    if (!mongoUri) {
      console.error('❌ MONGODB_URI or MONGO_URI not found in environment variables');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Find all thekua products
    const thekuaProducts = await Product.find({ category: 'thekua' });
    
    console.log(`\n📦 Found ${thekuaProducts.length} thekua product(s)\n`);

    // Display current products
    console.log('Current Thekua Products:');
    thekuaProducts.forEach(product => {
      console.log(`   - ${product.name}: ${product.weight} - ₹${product.price}`);
    });

    // Update products from 500gm/500g to 250gm
    const result = await Product.updateMany(
      { 
        category: 'thekua',
        $or: [
          { weight: '500gm' },
          { weight: '500g' },
          { weight: '500 gm' },
          { weight: '500 g' }
        ]
      },
      { 
        $set: { weight: '250gm' }
      }
    );

    console.log(`\n✅ Updated ${result.modifiedCount} thekua product(s) to 250gm\n`);

    // Show updated products
    const updatedProducts = await Product.find({ category: 'thekua' });
    console.log('📦 Updated Thekua Products:');
    updatedProducts.forEach(product => {
      console.log(`   - ${product.name}: ${product.weight} - ₹${product.price}`);
    });

    console.log('\n✅ Database connection closed');
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('❌ Error updating thekua products:', error);
    process.exit(1);
  }
};

updateThekuaWeight();
