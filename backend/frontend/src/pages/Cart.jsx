import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, Tag, CheckCircle, XCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { validatePromocode, calculateOrderTotal, getSettings } from '../utils/api';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Promocode state
  const [promocodeInput, setPromocodeInput] = useState('');
  const [appliedPromocode, setAppliedPromocode] = useState(null);
  const [promocodeLoading, setPromocodeLoading] = useState(false);
  const [promocodeStatus, setPromocodeStatus] = useState(null); // For showing status messages
  const [orderTotals, setOrderTotals] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const subtotal = getCartTotal();

  // Fetch settings and calculate order totals
  useEffect(() => {
    const fetchSettingsAndCalculate = async () => {
      try {
        setLoading(true);
        
        // Fetch settings
        const settingsData = await getSettings();
        setSettings(settingsData);

        if (cartItems.length > 0) {
          // Calculate order totals with current cart
          const cartProducts = cartItems.map(item => ({
            productId: item._id,
            quantity: item.quantity,
            price: item.price,
            category: item.category
          }));

          const totals = await calculateOrderTotal(cartProducts, 'standard', appliedPromocode);
          setOrderTotals(totals);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        // Use fallback values if settings fetch fails
        setSettings({
          pricing: {
            taxRate: 18,
            shippingCharges: {
              standard: {
                rate: 50,
                freeShippingThreshold: 500
              }
            },
            codCharges: 25
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettingsAndCalculate();
  }, [cartItems, appliedPromocode]);

  // Use calculated order totals if available, otherwise fallback to settings-based calculation
  const shipping = orderTotals?.shipping?.cost ?? 
    (settings?.pricing?.shippingCharges?.standard?.freeShippingThreshold && subtotal >= settings.pricing.shippingCharges.standard.freeShippingThreshold ? 0 : 
     settings?.pricing?.shippingCharges?.standard?.rate ?? 50);
  
  const tax = orderTotals?.tax?.amount ?? 
    (subtotal * (settings?.pricing?.taxRate ?? 18) / 100);
  
  const promocodeDiscount = orderTotals?.discount?.amount ?? 0;
  
  const total = orderTotals?.total ?? (subtotal + shipping + tax - promocodeDiscount);

  // Apply promocode
  const applyPromocode = async () => {
    if (!promocodeInput.trim()) {
      setPromocodeStatus({ type: 'error', message: 'Please enter a promocode' });
      return;
    }

    try {
      setPromocodeLoading(true);
      
      // Prepare cart items for validation
      const cartProducts = cartItems.map(item => ({
        productId: item._id,
        quantity: item.quantity,
        price: item.price,
        category: item.category
      }));

      // Validate promocode
      const validation = await validatePromocode(
        promocodeInput.toUpperCase(),
        subtotal,
        cartProducts,
        [...new Set(cartItems.map(item => item.category))], // unique categories
        user?._id
      );

      if (validation.valid) {
        // Calculate new order total with promocode object
        const promocodeData = {
          code: promocodeInput.toUpperCase(),
          type: validation.promocode.type || validation.promocode.discountType,
          discount: validation.discount
        };
        
        const orderCalculation = await calculateOrderTotal(
          cartProducts,
          'standard', // shipping method
          promocodeData
        );

        setAppliedPromocode({
          code: promocodeInput.toUpperCase(),
          description: validation.promocode.description,
          discount: validation.discount,
          discountType: validation.promocode.type || validation.promocode.discountType // Handle both field names
        });
        setOrderTotals(orderCalculation);
        setPromocodeInput('');
        setPromocodeStatus(null); // Clear any previous status
        
        toast.success(`Promocode applied! You saved ₹${Number(validation.discount).toFixed(2)}`);
      } else {
        // Handle validation failure (valid: false)
        let statusMessage = '';
        
        if (validation.amountNeeded && validation.minOrderValue) {
          // Use the exact values from backend
          statusMessage = `Add ₹${validation.amountNeeded.toFixed(2)} more to use this promocode (minimum: ₹${validation.minOrderValue})`;
        } else if (validation.message) {
          statusMessage = validation.message;
        } else {
          statusMessage = 'Cannot apply this promocode';
        }
        
        setPromocodeStatus({ type: 'error', message: statusMessage });
      }
    } catch (error) {
      console.error('Promocode validation error:', error);
      
      // Enhanced error messaging
      const errorData = error.response?.data;
      const errorMessage = errorData?.message;
      let statusMessage = '';
      
      if (errorData && !errorData.valid) {
        // Handle specific validation errors from backend
        if (errorMessage && errorMessage.includes('Minimum order value should be ₹')) {
          // Extract minimum amount and calculate how much more is needed
          const match = errorMessage.match(/₹([\d,]+(?:\.\d{2})?)/);
          if (match) {
            const minAmount = parseFloat(match[1].replace(/,/g, ''));
            const currentAmount = subtotal;
            const needAmount = minAmount - currentAmount;
            statusMessage = `Add ₹${needAmount.toFixed(2)} more to use this promocode (minimum: ₹${minAmount})`;
          } else {
            statusMessage = 'Minimum order value not met for this promocode';
          }
        } else if (errorMessage && (errorMessage.includes('already used') || errorMessage.includes('usage limit') || errorMessage.includes('exceeded'))) {
          statusMessage = 'You have already used this promocode';
        } else if (errorMessage && errorMessage.includes('not applicable')) {
          // Enhanced messaging for product/category specific promocodes
          if (errorMessage.includes('cart items')) {
            statusMessage = 'This promocode is only valid for specific products/categories not in your cart';
          } else {
            statusMessage = 'This promocode is not applicable to your current selection';
          }
        } else if (errorMessage && (errorMessage.includes('expired') || errorMessage.includes('not valid') || errorMessage.includes('does not exist'))) {
          statusMessage = 'Invalid or expired promocode';
        } else if (errorMessage) {
          statusMessage = errorMessage;
        } else {
          statusMessage = 'Cannot apply this promocode';
        }
      } else if (error.response?.status === 404) {
        statusMessage = 'Invalid promocode code';
      } else {
        statusMessage = 'Unable to validate promocode. Please try again.';
      }
      
      setPromocodeStatus({ type: 'error', message: statusMessage });
    } finally {
      setPromocodeLoading(false);
    }
  };

  // Remove promocode
  const removePromocode = async () => {
    try {
      // Recalculate without promocode
      const cartProducts = cartItems.map(item => ({
        productId: item._id,
        quantity: item.quantity,
        price: item.price,
        category: item.category
      }));

      const orderCalculation = await calculateOrderTotal(cartProducts, 'standard', null);
      
      setAppliedPromocode(null);
      setPromocodeStatus(null); // Clear status when removing promocode
      setOrderTotals(orderCalculation);
      toast.success('Promocode removed');
    } catch (error) {
      console.error('Error removing promocode:', error);
      // Fallback to basic calculation
      setAppliedPromocode(null);
      setOrderTotals(null);
    }
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=/checkout');
    } else {
      // Pass applied promocode to checkout
      navigate('/checkout', { 
        state: { 
          appliedPromocode,
          orderTotals 
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-desi-gold"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 mx-auto text-gray-400 mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some delicious items to get started!</p>
          <Link to="/products" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Shopping Cart</h1>

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          

          
          {/* Cart Items - Shows second on mobile */}
          <div className="lg:col-span-2 lg:order-1 order-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {cartItems.map((item) => (
                <div
                  key={user ? item._id : item.cartItemId}
                  className="p-3 md:p-6 border-b last:border-b-0 hover:bg-gray-50 transition"
                >
                  {/* Mobile-First Responsive Layout */}
                  <div className="space-y-3 md:space-y-0 md:flex md:items-center">
                    
                    {/* Product Image and Info Section */}
                    <div className="flex items-start space-x-3 md:space-x-4 flex-1">
                      <Link to={`/product/${item._id}`} className="flex-shrink-0">
                        <img
                          src={item.image || (item.images && item.images[0]) || '/placeholder-image.jpg'}
                          alt={item.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover rounded-lg"
                        />
                      </Link>
                      
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${item._id}`}
                          className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 hover:text-desi-gold transition block"
                        >
                          <span className="line-clamp-2">{item.name}</span>
                        </Link>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">{item.weight}</p>
                        <p className="text-sm sm:text-base md:text-lg font-bold text-desi-brown mt-1">
                          ₹{item.price}
                        </p>
                        
                        {/* Mobile: Show item subtotal under product info */}
                        <p className="text-sm font-semibold text-gray-700 mt-2 md:hidden">
                          Subtotal: ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      
                      {/* Remove button - always visible on the right */}
                      <button
                        onClick={() => removeFromCart(user ? item._id : item.cartItemId)}
                        className="text-red-500 hover:text-red-700 transition p-1 flex-shrink-0"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>

                    {/* Quantity Controls and Desktop Subtotal */}
                    <div className="flex items-center justify-between md:justify-end md:space-x-6 md:ml-4">
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-1 sm:space-x-2 bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(user ? item._id : item.cartItemId, item.quantity - 1)}
                          className="p-1 sm:p-2 hover:bg-gray-200 rounded transition flex-shrink-0"
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <span className="w-6 sm:w-8 text-center font-semibold text-sm sm:text-base">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(user ? item._id : item.cartItemId, item.quantity + 1)}
                          className="p-1 sm:p-2 hover:bg-gray-200 rounded transition flex-shrink-0"
                          disabled={item.quantity >= item.stock}
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>

                      {/* Desktop Subtotal - hidden on mobile */}
                      <div className="hidden md:block w-20 lg:w-24 text-right">
                        <span className="font-bold text-gray-900 text-sm lg:text-base">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/products"
              className="inline-block mt-4 sm:mt-6 text-desi-gold hover:text-yellow-600 font-semibold transition text-sm sm:text-base"
            >
              ← Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 md:p-6 lg:sticky lg:top-24">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Order Summary</h2>

              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div className="flex justify-between text-gray-700">
                  <span className="text-sm sm:text-base">Subtotal ({cartItems.length} items)</span>
                  <span className="font-semibold text-sm sm:text-base">₹{subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-gray-700">
                  <span className="text-sm sm:text-base">Shipping</span>
                  <span className="font-semibold text-sm sm:text-base">
                    {shipping === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `₹${Number(shipping).toFixed(2)}`
                    )}
                  </span>
                </div>

                {shipping > 0 && settings?.pricing?.shippingCharges?.standard?.freeShippingThreshold && (
                  <div className="text-xs sm:text-sm text-desi-gold bg-yellow-50 p-2 rounded">
                    Add ₹{(settings.pricing.shippingCharges.standard.freeShippingThreshold - subtotal).toFixed(2)} more for free shipping!
                  </div>
                )}

                {settings?.pricing?.taxRate > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-sm sm:text-base">Tax ({settings.pricing.taxRate}% GST)</span>
                    <span className="font-semibold text-sm sm:text-base">₹{Number(tax).toFixed(2)}</span>
                  </div>
                )}

                {/* Promocode Discount */}
                {appliedPromocode && (
                  <div className="flex justify-between py-2 text-green-600">
                    <span className="flex items-center text-sm sm:text-base">
                      <Tag className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      <span className="truncate">Promocode ({appliedPromocode.code})</span>
                    </span>
                    <span className="font-semibold text-sm sm:text-base">-₹{Number(promocodeDiscount).toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t pt-3 sm:pt-4">
                  <div className="flex justify-between text-base sm:text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-desi-brown">₹{Number(total).toFixed(2)}</span>
                  </div>
                  {appliedPromocode && (
                    <div className="text-xs sm:text-sm text-green-600 mt-1">
                      You saved ₹{Number(promocodeDiscount).toFixed(2)} with {appliedPromocode.code}!
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full btn-primary mb-3 sm:mb-4 py-3 sm:py-2 text-base font-semibold"
              >
                Proceed to Checkout
              </button>

              <div className="text-center text-xs sm:text-sm text-gray-600">
                <p>🔒 Secure checkout</p>
              </div>

              {/* Promocode Section */}
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t">
                <h3 className="font-semibold mb-3 flex items-center text-sm sm:text-base">
                  <Tag className="w-4 h-4 mr-2" />
                  Have a promocode?
                </h3>
                
                {appliedPromocode ? (
                  // Applied Promocode Display
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center min-w-0 flex-1">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-green-800 text-sm sm:text-base truncate">{appliedPromocode.code}</div>
                          <div className="text-xs sm:text-sm text-green-600 truncate">{appliedPromocode.description}</div>
                        </div>
                      </div>
                      <button
                        onClick={removePromocode}
                        className="text-red-600 hover:text-red-800 p-1 ml-2 flex-shrink-0"
                        title="Remove promocode"
                      >
                        <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  // Promocode Input
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <input
                        type="text"
                        placeholder="Enter promocode"
                        value={promocodeInput}
                        onChange={(e) => {
                          setPromocodeInput(e.target.value.toUpperCase());
                          setPromocodeStatus(null); // Clear status when typing
                        }}
                        onKeyPress={(e) => e.key === 'Enter' && applyPromocode()}
                        className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-desi-gold focus:border-desi-gold text-sm"
                        disabled={promocodeLoading}
                      />
                      <button 
                        onClick={applyPromocode}
                        disabled={promocodeLoading || !promocodeInput.trim()}
                        className="bg-desi-gold text-desi-brown px-4 py-2 rounded-lg hover:bg-yellow-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm"
                      >
                        {promocodeLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-desi-brown"></div>
                            <span className="hidden sm:inline">Validating...</span>
                          </>
                        ) : (
                          <span>Apply</span>
                        )}
                      </button>
                    </div>
                    
                    {/* Promocode Status Message */}
                    {promocodeStatus && (
                      <div className={`p-3 rounded-lg text-xs sm:text-sm mt-3 ${
                        promocodeStatus.type === 'error' 
                          ? 'bg-red-50 border border-red-200 text-red-700'
                          : 'bg-blue-50 border border-blue-200 text-blue-700'
                      }`}>
                        <div className="flex items-start space-x-2">
                          {promocodeStatus.type === 'error' ? (
                            <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          ) : (
                            <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          )}
                          <span className="leading-relaxed">{promocodeStatus.message}</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500">
                      💡 Tip: Promocodes are automatically applied at the best available rate
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;