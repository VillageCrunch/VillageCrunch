import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { createReview, getUserOrders } from '../utils/api';
import toast from 'react-hot-toast';

const RatableProductCard = ({ product, orderId }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [canRate, setCanRate] = useState(false);
  const [hasRated, setHasRated] = useState(false);

  useEffect(() => {
    checkRatingEligibility();
  }, [user, product]);

  const checkRatingEligibility = async () => {
    if (!user || !product) return;

    try {
      // Check if user has delivered orders with this product
      const orders = await getUserOrders();
      const hasDeliveredProduct = orders.some(order => 
        order.status === 'delivered' && 
        order.items.some(item => {
          const itemProductId = item.product._id || item.product;
          const currentProductId = product._id;
          return itemProductId === currentProductId;
        })
      );

      // Check if user has already reviewed this product
      const hasReviewed = product.reviews?.some(review => {
        const reviewUserId = review.user._id || review.user;
        return reviewUserId === user._id;
      });

      setCanRate(hasDeliveredProduct && !hasReviewed);
      setHasRated(hasReviewed);
    } catch (error) {
      console.error('Error checking rating eligibility:', error);
    }
  };

  const handleQuickRating = async (rating) => {
    if (!user) {
      toast.error('Please login to rate products');
      return;
    }

    if (!canRate) {
      toast.error('You can only rate products you have purchased and received');
      return;
    }

    setIsSubmittingRating(true);
    try {
      await createReview(product._id, {
        rating,
        comment: `Quick rating: ${rating} star${rating !== 1 ? 's' : ''}`
      });
      toast.success('Thank you for your rating!');
      setCanRate(false);
      setHasRated(true);
      // Refresh the product data
      window.location.reload(); // Simple refresh - could be improved with state management
    } catch (error) {
      toast.error('Failed to submit rating');
      console.error('Rating error:', error);
    } finally {
      setIsSubmittingRating(false);
      setHoveredRating(0);
    }
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const averageRating = calculateAverageRating(product.reviews);
  const reviewCount = product.reviews?.length || 0;
  const productId = product._id || product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <Link to={`/product/${productId}`} className="block">
        <div className="relative overflow-hidden h-48">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
          {product.originalPrice && (
            <div className="absolute top-4 left-4 bg-desi-terracotta text-white px-3 py-1 rounded-full text-sm font-semibold">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-bold text-xl">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-5">
        <Link to={`/product/${productId}`}>
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-desi-brown transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-gray-600 mb-3">{product.weight}</p>

        {/* Rating Section */}
        <div className="mb-4">
          {canRate ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-desi-brown">Rate this product:</p>
              <div 
                className="flex items-center space-x-1"
                onMouseLeave={() => setHoveredRating(0)}
              >
                {[1, 2, 3, 4, 5].map((starNum) => (
                  <button
                    key={starNum}
                    onClick={() => handleQuickRating(starNum)}
                    onMouseEnter={() => setHoveredRating(starNum)}
                    disabled={isSubmittingRating}
                    className="focus:outline-none hover:scale-125 transition-all disabled:opacity-50"
                    title={`Rate ${starNum} star${starNum !== 1 ? 's' : ''}`}
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        starNum <= hoveredRating
                          ? 'text-desi-gold fill-current' 
                          : starNum <= averageRating
                          ? 'text-desi-gold fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {hoveredRating > 0 ? `${hoveredRating} star${hoveredRating !== 1 ? 's' : ''}` : 'Click to rate'}
                </span>
              </div>
            </div>
          ) : reviewCount > 0 ? (
            <div className="flex items-center">
              <div className="flex text-desi-gold">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(averageRating) ? 'fill-current' : ''}`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                ({averageRating}) • {reviewCount} review{reviewCount !== 1 ? 's' : ''}
              </span>
              {hasRated && (
                <span className="ml-2 text-xs text-green-600">✓ You rated this</span>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-500">No ratings yet</div>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-desi-brown">
              ₹{product.price}
            </span>
            {product.originalPrice && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full py-2 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all ${
            product.stock === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-desi-gold text-white hover:bg-yellow-600'
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
        </button>
      </div>
    </div>
  );
};

export default RatableProductCard;