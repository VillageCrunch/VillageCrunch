import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Package, ShoppingBag } from 'lucide-react';
import { getUserOrders, getProducts, createReview } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const RateProducts = () => {
  const { user } = useAuth();
  const [deliveredProducts, setDeliveredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingRating, setSubmittingRating] = useState({});

  useEffect(() => {
    if (user) {
      fetchDeliveredProducts();
    }
  }, [user]);

  const fetchDeliveredProducts = async () => {
    try {
      const [orders, allProducts] = await Promise.all([
        getUserOrders(),
        getProducts()
      ]);

      // Get all delivered products that user hasn't rated yet
      const deliveredItems = [];
      
      orders.forEach(order => {
        if (order.status === 'delivered') {
          order.items.forEach(item => {
            // Find full product details
            const fullProduct = allProducts.find(p => p._id === (item.product._id || item.product));
            if (fullProduct) {
              // Check if user hasn't rated this product yet
              const hasRated = fullProduct.reviews?.some(review => 
                (review.user._id || review.user) === user._id
              );

              if (!hasRated) {
                // Check if product is already in the list (user might have ordered same product multiple times)
                const existingProduct = deliveredItems.find(dp => dp._id === fullProduct._id);
                if (!existingProduct) {
                  deliveredItems.push({
                    ...fullProduct,
                    orderDate: order.createdAt,
                    orderId: order._id
                  });
                }
              }
            }
          });
        }
      });

      setDeliveredProducts(deliveredItems);
    } catch (error) {
      console.error('Error fetching delivered products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickRating = async (productId, rating) => {
    setSubmittingRating(prev => ({ ...prev, [productId]: true }));
    
    try {
      await createReview(productId, {
        rating,
        comment: `Quick rating: ${rating} star${rating !== 1 ? 's' : ''}`
      });
      
      toast.success('Thank you for your rating!');
      
      // Remove the product from the list since it's now rated
      setDeliveredProducts(prev => prev.filter(p => p._id !== productId));
    } catch (error) {
      toast.error('Failed to submit rating');
      console.error('Rating error:', error);
    } finally {
      setSubmittingRating(prev => ({ ...prev, [productId]: false }));
    }
  };

  const StarRating = ({ productId, onRate, isSubmitting }) => {
    const [hoveredRating, setHoveredRating] = useState(0);

    return (
      <div 
        className="flex items-center space-x-1"
        onMouseLeave={() => setHoveredRating(0)}
      >
        {[1, 2, 3, 4, 5].map((starNum) => (
          <button
            key={starNum}
            onClick={() => onRate(productId, starNum)}
            onMouseEnter={() => setHoveredRating(starNum)}
            disabled={isSubmitting}
            className="focus:outline-none hover:scale-125 transition-all disabled:opacity-50"
            title={`Rate ${starNum} star${starNum !== 1 ? 's' : ''}`}
          >
            <Star
              className={`w-7 h-7 transition-colors ${
                starNum <= hoveredRating
                  ? 'text-desi-gold fill-current' 
                  : 'text-gray-300 hover:text-desi-gold'
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {hoveredRating > 0 ? `${hoveredRating} star${hoveredRating !== 1 ? 's' : ''}` : 'Click to rate'}
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-desi-gold"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Rate Your Purchased Products</h1>
          <p className="text-gray-600">
            Help other customers by rating products you've received. Your feedback matters!
          </p>
        </div>

        {deliveredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-md">
            <Package className="w-24 h-24 mx-auto text-gray-400 mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">All caught up!</h2>
            <p className="text-gray-600 mb-8">
              You've either rated all your delivered products or haven't made any purchases yet.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/products" className="btn-primary flex items-center space-x-2">
                <ShoppingBag className="w-5 h-5" />
                <span>Browse Products</span>
              </Link>
              <Link to="/orders" className="btn-secondary">
                View Orders
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deliveredProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <Link to={`/product/${product._id}`} className="block">
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </Link>

                <div className="p-5">
                  <Link to={`/product/${product._id}`}>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-desi-brown transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  <p className="text-sm text-gray-600 mb-2">{product.weight}</p>
                  <p className="text-xs text-gray-500 mb-4">
                    Delivered: {new Date(product.orderDate).toLocaleDateString()}
                  </p>

                  <div className="space-y-3">
                    <p className="text-sm font-medium text-desi-brown">Rate this product:</p>
                    <StarRating
                      productId={product._id}
                      onRate={handleQuickRating}
                      isSubmitting={submittingRating[product._id]}
                    />
                    
                    <Link
                      to={`/product/${product._id}#reviews`}
                      className="block text-center text-sm text-desi-gold hover:text-yellow-600 transition-colors"
                    >
                      Or write a detailed review →
                    </Link>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-desi-brown">
                        ₹{product.price}
                      </span>
                      <Link
                        to={`/product/${product._id}`}
                        className="text-sm text-desi-gold hover:text-yellow-600 transition-colors"
                      >
                        View Product →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RateProducts;