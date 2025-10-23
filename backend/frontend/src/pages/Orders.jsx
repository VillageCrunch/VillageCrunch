import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, CheckCircle, Star, X } from 'lucide-react';
import { getMyOrders, createReview, getProduct } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [userRatings, setUserRatings] = useState({}); // Store user's ratings for products

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getMyOrders();
      setOrders(data);
      
      // Fetch user ratings for all products in orders
      await fetchUserRatings(data);
    } catch (error) {
      toast.error('Failed to load orders');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRatings = async (orders) => {
    const ratings = {};
    const productIds = new Set();

    // Collect all unique product IDs from orders
    orders.forEach(order => {
      order.items.forEach(item => {
        const productId = item.product?._id || item.product;
        if (productId) {
          productIds.add(productId);
        }
      });
    });

    // Fetch product details to get user's reviews
    for (const productId of productIds) {
      try {
        const product = await getProduct(productId);
        // Find user's review for this product
        const userReview = product.reviews?.find(review => {
          const reviewUserId = review.user._id || review.user;
          return reviewUserId === user._id;
        });
        
        if (userReview) {
          ratings[productId] = {
            rating: userReview.rating,
            comment: userReview.comment,
            hasReviewed: true
          };
        }
      } catch (error) {
        console.error(`Error fetching product ${productId}:`, error);
      }
    }

    setUserRatings(ratings);
  };

  const getUserRating = (productId) => {
    return userRatings[productId]?.rating || 0;
  };

  const hasUserReviewed = (productId) => {
    return userRatings[productId]?.hasReviewed || false;
  };

  const handleOpenRating = (product, orderId) => {
    setSelectedProduct(product);
    setSelectedOrderId(orderId);
    setShowRatingModal(true);
    
    // Set existing rating and comment if user has already reviewed
    const productId = product.product?._id || product.product || product._id;
    const existingRating = userRatings[productId];
    
    if (existingRating) {
      setRating(existingRating.rating);
      setComment(existingRating.comment || '');
    } else {
      setRating(5);
      setComment('');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !comment.trim()) {
      toast.error('Please provide a rating and comment');
      return;
    }

    setSubmittingReview(true);
    try {
      // Use the product ID from the selected product
      const productId = selectedProduct.product?._id || selectedProduct.product || selectedProduct._id;
      
      const response = await createReview(productId, {
        rating,
        comment: comment.trim()
      });

      // Update local user ratings
      setUserRatings(prev => ({
        ...prev,
        [productId]: {
          rating: rating,
          comment: comment.trim(),
          hasReviewed: true
        }
      }));

      // Show appropriate message based on backend response
      const message = response.data?.message || 'Thank you for your review!';
      toast.success(message);
      setShowRatingModal(false);
      setSelectedProduct(null);
      setSelectedOrderId(null);
      
      // Optionally refresh orders to update any UI indicators
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
      console.error('Review submission error:', error);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleQuickRating = async (product, orderId, ratingValue) => {
    try {
      const productId = product.product?._id || product.product || product._id;
      
      const response = await createReview(productId, {
        rating: ratingValue,
        comment: `Quick rating: ${ratingValue} star${ratingValue !== 1 ? 's' : ''}`
      });

      // Update local user ratings
      setUserRatings(prev => ({
        ...prev,
        [productId]: {
          rating: ratingValue,
          comment: `Quick rating: ${ratingValue} star${ratingValue !== 1 ? 's' : ''}`,
          hasReviewed: true
        }
      }));

      // Show appropriate message based on backend response
      const message = response.data?.message || 'Thank you for your rating!';
      toast.success(message);
      fetchOrders(); // Refresh to update UI
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit rating');
      console.error('Quick rating error:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || colors.pending;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'shipped':
        return <Truck className="w-5 h-5" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <Link 
            to="/rate-products"
            className="bg-desi-gold text-desi-brown px-6 py-3 rounded-lg hover:bg-yellow-500 transition transform hover:scale-105 flex items-center space-x-2 font-semibold"
          >
            <Star className="w-5 h-5" />
            <span>Rate Your Products</span>
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-md">
            <Package className="w-24 h-24 mx-auto text-gray-400 mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No orders yet</h2>
            <p className="text-gray-600 mb-8">Start shopping to see your orders here!</p>
            <Link to="/products" className="btn-primary">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-desi-cream px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Order Number</p>
                    <p className="font-bold text-desi-brown">{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Order Date</p>
                    <p className="font-semibold">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="font-bold text-lg text-desi-brown">
                      ₹{order.totalPrice.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full font-semibold ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </span>
                  </div>
                </div>

                {/* Consumption Reminder for Delivered Orders */}
                {order.status === 'delivered' && (
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-400 mx-6 p-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">🍯</span>
                      <div>
                        <p className="text-sm font-semibold text-green-700">Order Delivered Successfully!</p>
                        <p className="text-xs text-green-600">
                          Rate your products after enjoying them to help other customers make informed choices!
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    {order.items.map((item, index) => {
                      // Safe product ID generation with null checks
                      const productId = item.product?._id || item.product || 
                        item.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 
                        `product-${index}`;
                      
                      return (
                        <Link 
                          key={index} 
                          to={`/product/${productId}`}
                          className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                        >
                          <img
                            src={item.image || '/placeholder-product.jpg'}
                            alt={item.name || 'Product'}
                            className="w-20 h-20 object-cover rounded-lg group-hover:scale-105 transition-transform"
                            onError={(e) => {
                              e.target.src = '/placeholder-product.jpg';
                            }}
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 group-hover:text-desi-brown transition-colors">
                              {item.name || 'Unknown Product'}
                            </p>
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity || 1} • {item.weight || 'N/A'}
                            </p>
                            <p className="text-xs text-desi-gold mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              Click to view product →
                            </p>
                            
                            {/* Add rating option for delivered items */}
                            {order.status === 'delivered' && (
                              <div className="mt-2 flex space-x-2">
                                {/* Quick Star Rating */}
                                <div className="flex items-center space-x-1">
                                  <span className="text-xs text-gray-600">
                                    {hasUserReviewed(item.product?._id || item.product) ? 'Your rating:' : 'Quick rate:'}
                                  </span>
                                  {[1, 2, 3, 4, 5].map((star) => {
                                    const productId = item.product?._id || item.product;
                                    const userRating = getUserRating(productId);
                                    const isRated = star <= userRating;
                                    
                                    return (
                                      <button
                                        key={star}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          handleQuickRating(item, order._id, star);
                                        }}
                                        className="hover:scale-110 transition-transform"
                                        title={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                                      >
                                        <Star 
                                          className={`w-4 h-4 transition-colors ${
                                            isRated 
                                              ? 'text-desi-gold fill-current' 
                                              : 'text-gray-300 hover:text-desi-gold hover:fill-current'
                                          }`} 
                                        />
                                      </button>
                                    );
                                  })}
                                </div>
                                
                                {/* Detailed Review Button */}
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleOpenRating(item, order._id);
                                  }}
                                  className="text-xs bg-desi-gold text-desi-brown px-2 py-1 rounded hover:bg-yellow-500 transition"
                                >
                                  📝 {hasUserReviewed(item.product?._id || item.product) ? 'Update Review' : 'Write Review'}
                                </button>
                              </div>
                            )}
                          </div>
                          <p className="font-bold text-gray-900">
                            ₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                          </p>
                        </Link>
                      );
                    })}
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <Link
                      to={`/order/${order._id}`}
                      className="btn-primary"
                    >
                      View Details
                    </Link>
                    {order.trackingNumber && (
                      <button className="btn-secondary">
                        Track Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {showRatingModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {hasUserReviewed(selectedProduct.product?._id || selectedProduct.product || selectedProduct._id) 
                  ? 'Update Your Review' 
                  : 'Write a Review'}
              </h3>
              <button
                onClick={() => setShowRatingModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4">
              <img
                src={selectedProduct.image || '/placeholder-product.jpg'}
                alt={selectedProduct.name || 'Product'}
                className="w-16 h-16 object-cover rounded-lg mx-auto mb-2"
              />
              <h4 className="text-center font-semibold text-gray-800">
                {selectedProduct.name || 'Unknown Product'}
              </h4>
            </div>

            <form onSubmit={handleSubmitReview}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Rating
                </label>
                <div className="flex justify-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= rating
                            ? 'text-desi-gold fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-center text-sm text-gray-600 mt-1">
                  {rating} star{rating !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-desi-gold focus:border-transparent"
                  placeholder="Share your experience with this product..."
                  required
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={submittingReview || !comment.trim()}
                  className="flex-1 bg-desi-gold text-desi-brown py-2 px-4 rounded-lg hover:bg-yellow-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingReview 
                    ? 'Submitting...' 
                    : hasUserReviewed(selectedProduct.product?._id || selectedProduct.product || selectedProduct._id)
                      ? 'Update Review'
                      : 'Submit Review'
                  }
                </button>
                <button
                  type="button"
                  onClick={() => setShowRatingModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;