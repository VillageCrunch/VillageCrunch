require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const users = [
  {
    name: 'Admin User',
    username: 'admin',
    email: 'admin@villagecrunch.com',
    password: 'admin123',
    phone: '9876543210',
    role: 'admin',
    addresses: [{
      street: '123 Admin Street',
      city: 'Patna',
      state: 'Bihar',
      pincode: '800001',
      isDefault: true
    }]
  },
  {
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    password: 'john123',
    phone: '9876543211',
    addresses: [{
      street: '456 Main Street',
      city: 'Patna',
      state: 'Bihar',
      pincode: '800002',
      isDefault: true
    }]
  },
  {
    name: 'Jane Smith',
    username: 'janesmith',
    email: 'jane@example.com',
    password: 'jane123',
    phone: '9876543212',
    addresses: [{
      street: '789 Oak Road',
      city: 'Gaya',
      state: 'Bihar',
      pincode: '823001',
      isDefault: true
    }]
  }
];

const importUsers = async () => {
  try {
    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://sauravsinghking9876_db_user:Saurav867882@villagecluster.d9ah8fv.mongodb.net/', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Clear existing users
    await User.deleteMany({});
    console.log('🗑️ Existing users deleted');

    // Insert new users
    const createdUsers = await User.insertMany(users);
    console.log(`✅ Successfully imported ${createdUsers.length} users`);
    
    // Print user IDs for reference in orders
    console.log('\nUser IDs for reference:');
    createdUsers.forEach(user => {
      console.log(`${user.name}: ${user._id}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error importing users:', error);
    process.exit(1);
  }
};

importUsers();