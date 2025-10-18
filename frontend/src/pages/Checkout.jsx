import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder, createPaymentOrder, verifyPayment, updateOrderToPaid } from '../utils/api';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();

  const [shippingInfo, setShippingInfo] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');

  const subtotal = getCartTotal();
  const shipping = subtotal >= 500 ? 0 : 50;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  const handleChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleCOD = async () => {
    try {
      setLoading(true);

      // Create order in database with COD payment method
      const orderData = {
        items: cartItems.map(item => ({
          product: item._id,    
          name: item.name,
          image: item.image,
          quantity: item.quantity,
          price: item.price,
          weight: item.weight,
        })),
        shippingAddress: {
          name: shippingInfo.name,
          phone: shippingInfo.phone,
          street: shippingInfo.street,
          city: shippingInfo.city,
          state: shippingInfo.state,
          pincode: shippingInfo.pincode,
        },
        paymentInfo: {
          method: 'cod',
          razorpayOrderId: null,
          razorpayPaymentId: null,
          razorpaySignature: null,
        },
        itemsPrice: subtotal,
        shippingPrice: shipping,
        taxPrice: tax,
        totalPrice: total,
      };

      console.log('Cart items structure:', cartItems);
      console.log('First item:', cartItems[0]);
      console.log('First item _id:', cartItems[0]?._id);

      try {
        const order = await createOrder(orderData);

        // Clear cart and redirect
        clearCart();
        toast.success('Order placed successfully! You can pay at delivery. 🎉');
        navigate(`/order/${order._id}`);
      } catch (error) {
        console.error('Order creation error:', error.response?.data?.message || error.message);
        toast.error(error.response?.data?.message || 'Order creation failed. Please try again.');
        throw error;
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.street || 
        !shippingInfo.city || !shippingInfo.state || !shippingInfo.pincode) {
      toast.error('Please fill all shipping details');
      return;
    }

    if (paymentMethod === 'cod') {
      handleCOD();
      return;
    }

    setLoading(true);

    try {
      // Create Razorpay order
      const paymentOrderData = await createPaymentOrder(total);

      // Razorpay options with all payment methods
      const options = {
        key: paymentOrderData.keyId,
        amount: paymentOrderData.amount,
        currency: paymentOrderData.currency,
        order_id: paymentOrderData.orderId,
        name: 'VillageCrunch',
        description: 'Premium Indian Dry Fruits & Snacks',
        image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=200&h=200&fit=crop',
        
        // Enable all payment methods
        config: {
          display: {
            blocks: {
              // UPI Payment Options
              banks: {
                name: 'All payment methods',
                instruments: [
                  {
                    method: 'upi',
                    flows: ['qr', 'collect', 'intent']
                  },
                  {
                    method: 'card'
                  },
                  {
                    method: 'netbanking'
                  },
                  {
                    method: 'wallet'
                  }
                ]
              }
            },
            sequence: ['block.banks'],
            preferences: {
              show_default_blocks: true
            }
          }
        },
        
        // Payment methods preferences
        method: {
          upi: true,           // Enable UPI
          card: true,          // Enable Credit/Debit Cards
          netbanking: true,    // Enable Internet Banking
          wallet: true,        // Enable Wallets (Paytm, PhonePe, etc.)
          emi: false,          // Disable EMI (enable if needed)
          cardless_emi: false, // Disable Cardless EMI
          paylater: false      // Disable Pay Later options
        },
        
        // Handler for successful payment
        handler: async function (response) {
          try {
            // Verify payment
            await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            // Create order in database
            const orderData = {
              items: cartItems.map(item => ({
                product: item._id,
                name: item.name,
                image: item.image,
                quantity: item.quantity,
                price: item.price,
                weight: item.weight,
              })),
              shippingAddress: shippingInfo,
              paymentInfo: {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                method: 'Razorpay',
              },
              itemsPrice: subtotal,
              shippingPrice: shipping,
              taxPrice: tax,
              totalPrice: total,
            };

            const order = await createOrder(orderData);

            // Update order payment status
            await updateOrderToPaid(order._id, {
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            });

            // Clear cart and redirect
            clearCart();
            toast.success('Order placed successfully! 🎉');
            navigate(`/order/${order._id}`);
          } catch (error) {
            console.error('Order creation error:', error);
            toast.error('Order creation failed. Please contact support.');
          }
        },
        
        // Prefill customer details
        prefill: {
          name: shippingInfo.name,
          email: user?.email || '',
          contact: shippingInfo.phone,
        },
        
        // Notes for reference
        notes: {
          address: `${shippingInfo.street}, ${shippingInfo.city}, ${shippingInfo.state} - ${shippingInfo.pincode}`,
          customer_name: shippingInfo.name,
        },
        
        // Theme customization
        theme: {
          color: '#D4AF37', // Desi Gold color
          backdrop_color: '#F5E6D3'
        },
        
        // Modal options
        modal: {
          ondismiss: function() {
            toast.error('Payment cancelled');
            setLoading(false);
          },
          escape: true,
          backdropclose: false
        },
        
        // Retry options
        retry: {
          enabled: true,
          max_count: 3
        }
      };

      const razorpay = new window.Razorpay(options);
      
      // Open Razorpay checkout
      razorpay.open();

      // Handle payment failure
      razorpay.on('payment.failed', function (response) {
        toast.error('Payment failed. Please try again.');
        console.error('Payment failed:', response.error);
        setLoading(false);
      });

    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment initialization failed. Please try again.');
      setLoading(false);
    } finally {
      // Reset loading if payment modal is dismissed
      setTimeout(() => setLoading(false), 1000);
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Shipping Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handlePayment} className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={shippingInfo.name}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={shippingInfo.street}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={shippingInfo.pincode}
                    onChange={handleChange}
                    required
                    pattern="[0-9]{6}"
                    className="input-field"
                  />
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
                <div className="space-y-4">
                  <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-desi-brown focus:ring-desi-brown"
                    />
                    <div>
                      <p className="font-medium">Online Payment</p>
                      <p className="text-sm text-gray-500">Pay securely with UPI, Card, or Net Banking</p>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-desi-brown focus:ring-desi-brown"
                    />
                    <div>
                      <p className="font-medium">Cash on Delivery</p>
                      <p className="text-sm text-gray-500">Pay with cash when your order arrives</p>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-8 btn-primary flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    {paymentMethod === 'cod' ? 'Place Order - Cash on Delivery' : `Pay ₹${total.toFixed(2)}`}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2 mb-4">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-desi-brown">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;