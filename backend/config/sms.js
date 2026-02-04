const axios = require('axios');

// SMS service configuration
// You can use services like Twilio, AWS SNS, or any Indian SMS provider
// For now, I'll create a template that works with multiple providers

const sendSMS = async (phone, message) => {
  try {
    // Option 1: Using TextLocal (Indian SMS Service)
    if (process.env.SMS_SERVICE === 'textlocal' && process.env.TEXTLOCAL_API_KEY) {
      const response = await axios.post('https://api.textlocal.in/send/', new URLSearchParams({
        apikey: process.env.TEXTLOCAL_API_KEY,
        numbers: phone,
        message: message,
        sender: 'VLGCRH' // 6-character sender ID
      }), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      
      console.log('✅ SMS sent via TextLocal:', response.data);
      return { success: true, provider: 'textlocal', response: response.data };
    }
    
    // Option 2: Using Twilio
    if (process.env.SMS_SERVICE === 'twilio' && process.env.TWILIO_ACCOUNT_SID) {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const client = require('twilio')(accountSid, authToken);
      
      const result = await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+91${phone}`
      });
      
      console.log('✅ SMS sent via Twilio:', result.sid);
      return { success: true, provider: 'twilio', messageId: result.sid };
    }
    
    // Option 3: Using Fast2SMS (Indian SMS Service)
    if (process.env.SMS_SERVICE === 'fast2sms' && process.env.FAST2SMS_API_KEY) {
      const response = await axios.post('https://www.fast2sms.com/dev/bulkV2', {
        route: 'v3',
        sender_id: 'VLGCRH',
        message: message,
        numbers: phone
      }, {
        headers: {
          'authorization': process.env.FAST2SMS_API_KEY,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ SMS sent via Fast2SMS:', response.data);
      return { success: true, provider: 'fast2sms', response: response.data };
    }
    
    console.log('⚠️ No SMS service configured. Add SMS_SERVICE and corresponding API keys to .env');
    return { success: false, error: 'No SMS service configured' };
    
  } catch (error) {
    console.error('❌ SMS sending failed:', error.message);
    return { success: false, error: error.message };
  }
};

// Send order notification SMS to admin
const sendAdminOrderSMS = async (orderData, userData) => {
  try {
    const adminPhone = '6203009518'; // Admin phone number
    
    const message = `🚨 NEW ORDER ALERT 🚨
Order: #${orderData.orderNumber}
Customer: ${userData.name}
Amount: ₹${orderData.totalPrice}
Payment: ${orderData.paymentInfo.method.toUpperCase()}
Items: ${orderData.items.length}
Phone: ${userData.phone}
City: ${orderData.shippingAddress.city}
Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

Check admin panel for full details.
- VillageCrunch`;

    const result = await sendSMS(adminPhone, message);
    
    if (result.success) {
      console.log('✅ Admin SMS notification sent successfully');
    } else {
      console.log('❌ Admin SMS notification failed:', result.error);
    }
    
    return result;
  } catch (error) {
    console.error('❌ Error sending admin SMS notification:', error);
    return { success: false, error: error.message };
  }
};

// Send order confirmation SMS to customer
const sendCustomerOrderSMS = async (phone, orderData) => {
  try {
    const message = `✅ Order Confirmed!
Order #${orderData.orderNumber}
Amount: ₹${orderData.totalPrice}
Payment: ${orderData.paymentInfo.method.toUpperCase()}
Track your order at villagecrunch.com
Thank you! - VillageCrunch`;

    const result = await sendSMS(phone, message);
    return result;
  } catch (error) {
    console.error('❌ Error sending customer SMS:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendSMS,
  sendAdminOrderSMS,
  sendCustomerOrderSMS
};