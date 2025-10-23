import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { createReview, toggleWishlist, getWishlist } from '../utils/api';
import toast from 'react-hot-toast';

const ProductCard = ({ product, showQuickRating = false, userCanRate = false, onRatingSubmit }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

  // Check if product is in wishlist on component mount
  useEffect(() => {
    if (user && product._id) {
      checkWishlistStatus();
    }
  }, [user, product._id]);

  const checkWishlistStatus = async () => {
    try {
      const wishlistItems = await getWishlist();
      setIsInWishlist(wishlistItems.some(item => item._id === product._id));
    } catch (error) {
      console.error('Failed to check wishlist status:', error);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please login to add to wishlist');
      return;
    }

    if (!product._id) {
      toast.error('Cannot add this product to wishlist');
      return;
    }

    setIsTogglingWishlist(true);
    try {
      await toggleWishlist(product._id);
      setIsInWishlist(!isInWishlist);
      toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist');
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
      toast.error('Failed to update wishlist');
    } finally {
      setIsTogglingWishlist(false);
    }
  };

  const handleQuickRating = async (e, rating) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please login to rate products');
      return;
    }

    if (!userCanRate) {
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
      if (onRatingSubmit) onRatingSubmit();
    } catch (error) {
      toast.error('Failed to submit rating');
    } finally {
      setIsSubmittingRating(false);
      setHoveredRating(0);
    }
  };

  // Calculate average rating from actual reviews
  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const averageRating = calculateAverageRating(product.reviews);
  const reviewCount = product.reviews?.length || 0;

  // Generate a fallback ID if _id is missing (for products from JSON file)
  const productId = product._id || product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  return (
    <Link to={`/product/${productId}`} className="card group">
      <div className="relative overflow-hidden h-64">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {product.originalPrice && (
          <div className="absolute top-4 left-4 bg-desi-terracotta text-white px-3 py-1 rounded-full text-sm font-semibold">
            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
          </div>
        )}
        
        {/* Wishlist button */}
        {user && product._id && (
          <button
            onClick={handleToggleWishlist}
            disabled={isTogglingWishlist}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all duration-300 shadow-md disabled:opacity-50"
            title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {isTogglingWishlist ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
            ) : (
              <Heart 
                className={`w-5 h-5 transition-colors ${
                  isInWishlist 
                    ? 'text-red-500 fill-current' 
                    : 'text-gray-400 hover:text-red-500'
                }`} 
              />
            )}
          </button>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-xl">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="p-5">
        {/* Rating display - interactive if user can rate, otherwise just display */}
        {(reviewCount > 0 || (showQuickRating && userCanRate)) && (
          <div className="flex items-center mb-2">
            {showQuickRating && userCanRate ? (
              // Interactive rating for users who can rate
              <div className="flex items-center space-x-1">
                <div 
                  className="flex"
                  onMouseLeave={() => setHoveredRating(0)}
                >
                  {[1, 2, 3, 4, 5].map((starNum) => (
                    <button
                      key={starNum}
                      onClick={(e) => handleQuickRating(e, starNum)}
                      onMouseEnter={() => setHoveredRating(starNum)}
                      disabled={isSubmittingRating}
                      className="focus:outline-none hover:scale-110 transition-transform disabled:opacity-50"
                      title={`Rate ${starNum} star${starNum !== 1 ? 's' : ''}`}
                    >
                      <Star
                        className={`w-5 h-5 transition-colors ${
                          starNum <= (hoveredRating || averageRating)
                            ? 'text-desi-gold fill-current' 
                            : 'text-gray-300'
                        } ${hoveredRating > 0 ? 'hover:text-desi-gold' : ''}`}
                      />
                    </button>
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {hoveredRating > 0 ? `Rate ${hoveredRating} star${hoveredRating !== 1 ? 's' : ''}` : 
                   reviewCount > 0 ? `(${averageRating}) • ${reviewCount} review${reviewCount !== 1 ? 's' : ''}` : 
                   'Click to rate'}
                </span>
              </div>
            ) : (
              // Display-only rating
              <div className="flex items-center">
                <div className="flex text-desi-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(averageRating) ? 'fill-current' : ''
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  ({averageRating}) • {reviewCount} review{reviewCount !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        )}

        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {product.name}
        </h3>

        <p className="text-sm text-gray-600 mb-3">{product.weight}</p>

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
    </Link>
  );
};

export default ProductCard;