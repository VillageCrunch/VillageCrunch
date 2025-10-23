import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, getProducts, createReview, getUserOrders, toggleWishlist, getWishlist } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Star, ShoppingCart, ArrowLeft, Heart, Truck, Shield, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [allProducts, setAllProducts] = useState([]);
  const [userOrders, setUserOrders] = useState([]);
  const [canReview, setCanReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  });
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

  useEffect(() => {
    fetchProduct();
    fetchAllProducts();
    setSelectedImage(0); // Reset image selection when product changes
  }, [id]);

  useEffect(() => {
    if (user && product) {
      checkUserCanReview();
      checkWishlistStatus();
    }
  }, [user, product]);

  const checkWishlistStatus = async () => {
    try {
      const wishlistItems = await getWishlist();
      setIsInWishlist(wishlistItems.some(item => item._id === product._id));
    } catch (error) {
      console.error('Failed to check wishlist status:', error);
    }
  };

  // Add keyboard navigation for carousel
  useEffect(() => {
    if (!product) return;
    
    const images = [];
    if (product.image) images.push(product.image);
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach(img => {
        if (img && img !== product.image) images.push(img);
      });
    }

    const handleKeyPress = (e) => {
      if (images.length > 1) {
        if (e.key === 'ArrowLeft') {
          setSelectedImage(prev => prev === 0 ? images.length - 1 : prev - 1);
        } else if (e.key === 'ArrowRight') {
          setSelectedImage(prev => prev === images.length - 1 ? 0 : prev + 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [product]);

  // Auto-play carousel when there are multiple images
  useEffect(() => {
    if (!product) return;
    
    const images = [];
    if (product.image) images.push(product.image);
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach(img => {
        if (img && img !== product.image) images.push(img);
      });
    }

    // Start auto-play if there are multiple images
    if (images.length > 1) {
      setIsAutoPlaying(true);
    }

    if (images.length > 1 && isAutoPlaying) {
      const interval = setInterval(() => {
        setSelectedImage(prev => prev === images.length - 1 ? 0 : prev + 1);
      }, 4000);
      
      return () => clearInterval(interval);
    }
  }, [product, isAutoPlaying]);

  const checkUserCanReview = async () => {
    try {
      const orders = await getUserOrders();
      setUserOrders(orders);
      
      // Check if user has purchased this product and it's delivered
      const hasPurchased = orders.some(order => 
        order.status === 'delivered' && 
        order.items.some(item => {
          const itemProductId = item.product._id || item.product;
          const currentProductId = product._id || id;
          return itemProductId === currentProductId;
        })
      );
      
      // Allow users to review if they've purchased the product (can update existing reviews)
      setCanReview(hasPurchased);
    } catch (error) {
      console.error('Error checking review eligibility:', error);
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      
      // First try to get from backend
      try {
        const data = await getProduct(id);
        setProduct(data);
        return;
      } catch (error) {
        // Try local products as fallback
      }
      
      // If not found in backend, try to find in local products by generated ID
      const allProducts = await getProducts();
      const foundProduct = allProducts.find(p => {
        const generatedId = p.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        return p._id === id || generatedId === id;
      });
      
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        toast.error('Product not found');
        navigate('/products');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Unable to fetch product details');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const data = await getProducts();
      setAllProducts(data);
    } catch (error) {
      console.error('Error fetching all products:', error);
    }
  };

  const handleAddToCart = () => {
    if (product.stock === 0) {
      toast.error('Product is out of stock');
      return;
    }
    
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success('Added to cart', { duration: 1500 });
  };

  const handleToggleWishlist = async () => {
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

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.comment.trim()) {
      toast.error('Please write a review comment');
      return;
    }

    try {
      const response = await createReview(id, reviewForm);
      // Show appropriate message based on backend response
      const message = response.data?.message || 'Review submitted successfully!';
      toast.success(message);
      setShowReviewForm(false);
      setReviewForm({ rating: 5, comment: '' });
      fetchProduct(); // Refresh product to show new review
      setCanReview(false);
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  // Swipe handlers for mobile carousel
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd || !product) return;
    
    // Calculate images array
    const images = [];
    if (product.image) images.push(product.image);
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach(img => {
        if (img && img !== product.image) images.push(img);
      });
    }
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (images.length > 1) {
      if (isLeftSwipe) {
        setSelectedImage(prev => prev === images.length - 1 ? 0 : prev + 1);
      } else if (isRightSwipe) {
        setSelectedImage(prev => prev === 0 ? images.length - 1 : prev - 1);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-desi-gold"></div>
      </div>
    );
  }

  if (!product) return null;

  // Create images array with main image and additional images
  const images = [];
  
  // Always add the main image first if it exists
  if (product.image) {
    images.push(product.image);
  }
  
  // Add all additional images (including duplicates for now)
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    product.images.forEach(img => {
      if (img) {
        images.push(img);
      }
    });
  }
  
  // If no images at all, use a placeholder
  if (images.length === 0) {
    images.push('/placeholder-product.jpg');
  }

  const relatedProducts = allProducts
    .filter(p => p.category === product.category && (p._id || p.name) !== (product._id || product.name))
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-desi-brown hover:text-desi-gold mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Products
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div>
              {/* Main Image with Navigation */}
              <div 
                className="relative mb-4 group"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => {
                  if (product && images.length > 1) {
                    setIsAutoPlaying(true);
                  }
                }}
              >
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-xl select-none"
                  onError={(e) => {
                    e.target.src = '/placeholder-product.jpg';
                  }}
                  draggable={false}
                />
                
                {/* Navigation Arrows - show on hover and only if multiple images */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage(prev => prev === 0 ? images.length - 1 : prev - 1)}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all hover:scale-110 opacity-0 group-hover:opacity-100 duration-300"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <button
                      onClick={() => setSelectedImage(prev => prev === images.length - 1 ? 0 : prev + 1)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all hover:scale-110 opacity-0 group-hover:opacity-100 duration-300"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-6 h-6 text-gray-700" />
                    </button>
                    
                    {/* Image Counter */}
                    <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 duration-300">
                      {selectedImage + 1} / {images.length}
                    </div>
                    
                    {/* Image Indicators */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            selectedImage === index ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/75'
                          }`}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              
              {/* Thumbnail Grid */}
              {images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all hover:scale-105 duration-200 ${
                        selectedImage === index 
                          ? 'border-desi-gold ring-2 ring-desi-gold/20 shadow-lg' 
                          : 'border-gray-200 hover:border-desi-gold/50'
                      }`}
                    >
                      <img 
                        src={img} 
                        alt={`${product.name} ${index + 1}`} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/placeholder-product.jpg';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <span className="inline-block bg-desi-gold text-desi-brown px-3 py-1 rounded-full text-sm font-semibold mb-2">
                  {product.category}
                </span>
                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                
                {/* Rating */}
                <div className="flex items-center mt-2">
                  <div className="flex text-desi-gold">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(calculateAverageRating(product.reviews)) ? 'fill-current' : ''}`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">
                    {product.reviews && product.reviews.length > 0 
                      ? `(${calculateAverageRating(product.reviews)})` 
                      : '(No ratings yet)'
                    }
                  </span>
                  {product.reviews && product.reviews.length > 0 && (
                    <span className="ml-2 text-gray-500">• {product.reviews.length} review{product.reviews.length !== 1 ? 's' : ''}</span>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-4">
                <span className="text-4xl font-bold text-desi-brown">₹{product.price}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">₹{product.originalPrice}</span>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-semibold">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Promocode Info */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-green-700">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 0a1 1 0 100 2h.01a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">🎉 Promotional Offers Available!</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Apply promocodes during checkout to get additional discounts on this product.
                  <span className="block mt-1 text-green-600 font-medium">
                    ✨ Check cart for available promocodes and save more!
                  </span>
                </p>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-lg mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              {/* Weight & Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600">Weight:</span>
                  <span className="ml-2 font-semibold">{product.weight}</span>
                </div>
                <div>
                  <span className="text-gray-600">Availability:</span>
                  <span className={`ml-2 font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>

              {/* Quantity Selector */}
              {product.stock > 0 && (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700 font-medium">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 font-semibold">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.stock}
                      className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Add to Cart and Wishlist Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`flex-1 py-4 px-6 rounded-xl font-semibold flex items-center justify-center space-x-3 transition-all ${
                    product.stock === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-desi-gold text-desi-brown hover:bg-yellow-500 transform hover:scale-105'
                  }`}
                >
                  <ShoppingCart className="w-6 h-6" />
                  <span>{product.stock === 0 ? 'Out of Stock' : `Add ${quantity} to Cart`}</span>
                </button>
                
                {user && product._id && (
                  <button
                    onClick={handleToggleWishlist}
                    disabled={isTogglingWishlist}
                    className={`px-6 py-4 rounded-xl border-2 transition-all transform hover:scale-105 disabled:opacity-50 ${
                      isInWishlist
                        ? 'bg-red-50 border-red-300 text-red-600 hover:bg-red-100'
                        : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
                    }`}
                    title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    {isTogglingWishlist ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current"></div>
                    ) : (
                      <Heart 
                        className={`w-6 h-6 ${isInWishlist ? 'fill-current' : ''}`} 
                      />
                    )}
                  </button>
                )}
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                <div className="text-center">
                  <Truck className="w-8 h-8 text-desi-gold mx-auto mb-2" />
                  <span className="text-sm text-gray-600">Free Delivery</span>
                </div>
                <div className="text-center">
                  <Shield className="w-8 h-8 text-desi-gold mx-auto mb-2" />
                  <span className="text-sm text-gray-600">Quality Assured</span>
                </div>
                <div className="text-center">
                  <RefreshCw className="w-8 h-8 text-desi-gold mx-auto mb-2" />
                  <span className="text-sm text-gray-600">Easy Returns</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="border-t bg-gradient-to-br from-gray-50 to-white p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-desi-brown flex items-center">
                  <Star className="w-6 h-6 text-desi-gold mr-2" />
                  Customer Reviews
                </h3>
                <div className="flex items-center mt-2 text-gray-600">
                  {product.reviews && product.reviews.length > 0 ? (
                    <>
                      <div className="flex text-desi-gold mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(calculateAverageRating(product.reviews)) ? 'fill-current' : ''}`}
                          />
                        ))}
                      </div>
                      <span className="font-semibold text-desi-brown">{calculateAverageRating(product.reviews)}</span>
                      <span className="mx-2">•</span>
                      <span>{product.reviews.length} review{product.reviews.length !== 1 ? 's' : ''}</span>
                    </>
                  ) : (
                    <span>No reviews yet - be the first to share your experience!</span>
                  )}
                </div>
              </div>
              {canReview && (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="bg-desi-gold text-desi-brown px-6 py-3 rounded-lg hover:bg-yellow-500 transition transform hover:scale-105 flex items-center space-x-2 font-semibold"
                >
                  <Star className="w-4 h-4" />
                  <span>
                    {product?.reviews?.some(review => {
                      const reviewUserId = review.user._id || review.user;
                      return reviewUserId === user?._id;
                    }) ? 'Update Review' : 'Write a Review'}
                  </span>
                </button>
              )}
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h4 className="text-lg font-semibold mb-4">
                  {product?.reviews?.some(review => {
                    const reviewUserId = review.user._id || review.user;
                    return reviewUserId === user?._id;
                  }) ? 'Update Your Review' : 'Write Your Review'}
                </h4>
                <form onSubmit={handleReviewSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-6 h-6 ${star <= reviewForm.rating ? 'fill-current text-desi-gold' : 'text-gray-300'}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                    <textarea
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-desi-gold focus:border-transparent"
                      placeholder="Share your experience with this product..."
                      required
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="bg-desi-gold text-desi-brown px-6 py-2 rounded-lg hover:bg-yellow-500 transition"
                    >
                      {product?.reviews?.some(review => {
                        const reviewUserId = review.user._id || review.user;
                        return reviewUserId === user?._id;
                      }) ? 'Update Review' : 'Submit Review'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Reviews List */}
            {product.reviews && product.reviews.length > 0 ? (
              <div className="space-y-4">
                {product.reviews.map((review, index) => (
                  <div key={index} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-desi-gold to-yellow-400 rounded-full flex items-center justify-center shadow-md">
                          <span className="text-desi-brown font-bold text-lg">
                            {review.name ? review.name.charAt(0).toUpperCase() : 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{review.name || 'Anonymous Customer'}</p>
                          <div className="flex items-center space-x-2">
                            <div className="flex text-desi-gold">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < review.rating ? 'fill-current' : ''}`}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-medium text-desi-brown">
                              ({review.rating}/5)
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                        <div className="text-xs text-green-600 font-medium mt-1">
                          ✅ Verified Purchase
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-desi-gold">
                      <p className="text-gray-700 leading-relaxed italic">"{review.comment}"</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl p-8 max-w-md mx-auto">
                  <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-gray-700 mb-2">No Reviews Yet</h4>
                  <p className="text-gray-500 mb-4">Be the first to share your experience with this product!</p>
                  {user ? (
                    <p className="text-sm text-desi-brown font-medium">
                      💡 Purchase this product to write a review
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Please login and purchase to write a review
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Benefits & Ingredients */}
          {(product.benefits || product.ingredients) && (
            <div className="border-t bg-gray-50 p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {product.benefits && (
                  <div>
                    <h3 className="text-xl font-bold text-desi-brown mb-4">Benefits</h3>
                    <ul className="space-y-2">
                      {product.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center text-gray-700">
                          <span className="w-2 h-2 bg-desi-gold rounded-full mr-3"></span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {product.ingredients && (
                  <div>
                    <h3 className="text-xl font-bold text-desi-brown mb-4">Ingredients</h3>
                    <ul className="space-y-2">
                      {product.ingredients.map((ingredient, index) => (
                        <li key={index} className="flex items-center text-gray-700">
                          <span className="w-2 h-2 bg-desi-gold rounded-full mr-3"></span>
                          {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-desi-brown mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => {
                const relatedId = relatedProduct._id || relatedProduct.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                return (
                  <div
                    key={relatedId}
                    onClick={() => navigate(`/product/${relatedId}`)}
                    className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all transform hover:scale-105"
                  >
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{relatedProduct.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-desi-brown">₹{relatedProduct.price}</span>
                        {relatedProduct.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">₹{relatedProduct.originalPrice}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
