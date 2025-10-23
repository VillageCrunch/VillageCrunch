// Test Razorpay Configuration
const razorpay = require('./config/razorpay');

async function testRazorpay() {
  console.log('🧪 Testing Razorpay Configuration...\n');
  
  if (!razorpay) {
    console.log('❌ Razorpay not configured - check your API keys in .env file');
    return;
  }
  
  try {
    // Test creating an order
    const testOrder = await razorpay.orders.create({
      amount: 100, // 1 INR in paise
      currency: 'INR',
      receipt: 'test_receipt_123',
      payment_capture: 1
    });
    
    console.log('✅ Razorpay Configuration Test Successful!');
    console.log('📋 Test Order Details:');
    console.log(`   Order ID: ${testOrder.id}`);
    console.log(`   Amount: ₹${testOrder.amount / 100}`);
    console.log(`   Currency: ${testOrder.currency}`);
    console.log(`   Status: ${testOrder.status}`);
    console.log('\n🎉 Your Razorpay integration is ready!');
    
  } catch (error) {
    console.log('❌ Razorpay Configuration Test Failed!');
    console.log('Error:', error.message);
    console.log('\n🔧 Please check:');
    console.log('   1. RAZORPAY_KEY_ID is correct');
    console.log('   2. RAZORPAY_KEY_SECRET is correct');
    console.log('   3. API keys have proper permissions');
  }
}

testRazorpay();