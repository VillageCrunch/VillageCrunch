require('dotenv').config();
const { sendAdminOrderNotification } = require('./config/email');
const { sendAdminOrderSMS } = require('./config/sms');

// Test data simulating a new order
const testOrderData = {
  orderNumber: 'TEST001',
  createdAt: new Date(),
  totalPrice: 1250,
  paymentInfo: {
    method: 'online'
  },
  status: 'confirmed',
  items: [
    {
      name: 'Premium Almonds',
      quantity: 2,
      price: 450,
      weight: '1kg'
    },
    {
      name: 'Cashew Nuts',
      quantity: 1,
      price: 350,
      weight: '500g'
    }
  ],
  shippingAddress: {
    name: 'Test Customer',
    phone: '9876543210',
    street: '123 Test Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001'
  }
};

const testUserData = {
  name: 'Test Customer',
  email: 'test@example.com',
  phone: '9876543210'
};

async function testNotifications() {
  console.log('🧪 Testing Admin Notifications System...\n');
  
  console.log('📧 Testing Admin Email Notification...');
  try {
    const emailResult = await sendAdminOrderNotification(testOrderData, testUserData);
    if (emailResult.success) {
      console.log('✅ Admin email notification sent successfully!');
      console.log('📧 Check admin email: sauravsinghking9876@gmail.com');
    } else {
      console.log('❌ Admin email notification failed:', emailResult.error);
    }
  } catch (error) {
    console.log('❌ Admin email error:', error.message);
  }
  
  console.log('\n📱 Testing Admin SMS Notification...');
  try {
    const smsResult = await sendAdminOrderSMS(testOrderData, testUserData);
    if (smsResult.success) {
      console.log('✅ Admin SMS notification sent successfully!');
      console.log('📱 Check admin phone: 6203009518');
    } else {
      console.log('⚠️ Admin SMS notification result:', smsResult.error);
      if (smsResult.error === 'No SMS service configured') {
        console.log('💡 To enable SMS: Configure SMS_SERVICE in .env file');
      }
    }
  } catch (error) {
    console.log('❌ Admin SMS error:', error.message);
  }
  
  console.log('\n📋 Summary:');
  console.log('- Admin Email:', process.env.EMAIL_USER);
  console.log('- Admin Phone: 6203009518');
  console.log('- Email Service: Configured ✅');
  console.log('- SMS Service: Not configured ⚠️');
  
  console.log('\n🎯 Notification Flow:');
  console.log('New Order → Admin Email ✅ + Admin SMS ⚠️');
  
  console.log('\n🛠 To Test Real Orders:');
  console.log('1. Place an order through your website');
  console.log(`2. Check ${process.env.EMAIL_USER} for email notification`);
  console.log('3. Configure SMS service for phone notifications');
}

testNotifications().catch(console.error);