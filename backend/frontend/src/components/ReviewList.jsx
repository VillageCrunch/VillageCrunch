import { useState, useEffect } from 'react';
import { Star, ThumbsUp, Camera, ChevronDown, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ReviewList = ({ productId, onWriteReview }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0 });
  const [sortBy, setSortBy] = useState('newest');
  const [expandedReviews, setExpandedReviews] = useState(new Set());
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productId, sortBy, pagination.current]);

  const fetchReviews = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/products/${productId}/reviews?page=${page}&sortBy=${sortBy}&limit=10`
      );
      const data = await response.json();
      
      if (response.ok) {
        setReviews(data.reviews);
        setStats(data.stats);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleHelpfulVote = async (reviewId, helpful) => {
    if (!user) {
      toast.error('Please login to vote');
      return;
    }

    try {
      const response = await fetch(
        `/api/products/${productId}/reviews/${reviewId}/helpful`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ helpful })
        }
      );

      const data = await response.json();
      
      if (response.ok) {
        // Update the review in the list
        setReviews(prev => prev.map(review => 
          review._id === reviewId 
            ? { 
                ...review, 
                helpful: data.helpful,
                helpfulUsers: helpful 
                  ? [...(review.helpfulUsers || []), user._id]
                  : (review.helpfulUsers || []).filter(id => id !== user._id)
              }
            : review
        ));
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Failed to vote');
    }
  };

  const toggleReviewExpansion = (reviewId) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
  };

  const openImageModal = (images, startIndex = 0) => {
    setSelectedImages(images);
    setImageModalOpen(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isReviewHelpfulByUser = (review) => {
    return user && review.helpfulUsers?.includes(user._id);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-100 rounded-xl p-6 h-32"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Review Statistics */}
      {stats && (
        <div className="bg-gradient-to-r from-desi-cream to-yellow-50 rounded-xl p-6 border border-desi-gold/20">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-desi-brown">{stats.average}</div>
                  <div className="flex text-desi-gold justify-center mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < Math.floor(stats.average) ? 'fill-current' : ''}`} />
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">{stats.total} reviews</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(rating => {
                const count = stats.distribution[rating];
                const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                
                return (
                  <div key={rating} className="flex items-center space-x-3">
                    <span className="text-sm font-medium w-8">{rating}★</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-desi-gold h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Sort and Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-xl font-bold text-gray-900">
          Customer Reviews {stats && `(${stats.total})`}
        </h3>
        
        <div className="flex items-center space-x-3">
          <Filter className="w-5 h-5 text-gray-500" />
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-desi-gold focus:border-transparent"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="helpful">Most Helpful</option>
            <option value="rating">Highest Rating</option>
          </select>
          
          {onWriteReview && (
            <button
              onClick={onWriteReview}
              className="bg-desi-gold text-desi-brown px-4 py-2 rounded-lg hover:bg-yellow-500 transition font-semibold text-sm"
            >
              Write Review
            </button>
          )}
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-700 mb-2">No reviews yet</h4>
          <p className="text-gray-600 mb-6">Be the first to share your experience!</p>
          {onWriteReview && (
            <button
              onClick={onWriteReview}
              className="bg-desi-gold text-desi-brown px-6 py-3 rounded-lg hover:bg-yellow-500 transition font-semibold"
            >
              Write the First Review
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => {
            const isExpanded = expandedReviews.has(review._id);
            const isLongComment = review.comment && review.comment.length > 200;
            const displayComment = isExpanded || !isLongComment 
              ? review.comment 
              : review.comment.substring(0, 200) + '...';

            return (
              <div key={review._id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                {/* Review Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-desi-gold to-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-desi-brown font-bold text-lg">
                        {review.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-gray-900">{review.name || 'Anonymous'}</h4>
                        {review.verified && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                            ✓ Verified Purchase
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-3 mt-1">
                        <div className="flex text-desi-gold">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : ''}`} />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">{formatDate(review.createdAt)}</span>
                        {review.updatedAt !== review.createdAt && (
                          <span className="text-xs text-gray-500">(edited)</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Review Content */}
                {review.comment && (
                  <div className="mb-4">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {displayComment}
                    </p>
                    {isLongComment && (
                      <button
                        onClick={() => toggleReviewExpansion(review._id)}
                        className="text-desi-gold hover:text-yellow-600 text-sm font-medium mt-2 flex items-center space-x-1"
                      >
                        <span>{isExpanded ? 'Show Less' : 'Read More'}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>
                )}

                {/* Review Images */}
                {review.images && review.images.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Camera className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Customer Photos</span>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {review.images.slice(0, 5).map((image, index) => (
                        <button
                          key={index}
                          onClick={() => openImageModal(review.images, index)}
                          className="relative aspect-square rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
                        >
                          <img
                            src={image}
                            alt={`Review image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {index === 4 && review.images.length > 5 && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                              <span className="text-white text-sm font-semibold">
                                +{review.images.length - 5}
                              </span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Review Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleHelpfulVote(review._id, !isReviewHelpfulByUser(review))}
                      disabled={!user}
                      className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition text-sm font-medium ${
                        isReviewHelpfulByUser(review)
                          ? 'bg-desi-gold text-desi-brown'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>{review.helpful || 0}</span>
                      <span className="hidden sm:inline">Helpful</span>
                    </button>
                    
                    {!user && (
                      <span className="text-xs text-gray-500">Login to vote</span>
                    )}
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Review #{review._id.slice(-6)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center space-x-4 pt-6">
          <button
            onClick={() => fetchReviews(pagination.current - 1)}
            disabled={pagination.current === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
          >
            Previous
          </button>
          
          <span className="text-sm text-gray-600">
            Page {pagination.current} of {pagination.pages}
          </span>
          
          <button
            onClick={() => fetchReviews(pagination.current + 1)}
            disabled={pagination.current === pagination.pages}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
          >
            Next
          </button>
        </div>
      )}

      {/* Image Modal */}
      {imageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setImageModalOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="w-8 h-8" />
            </button>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Review image ${index + 1}`}
                  className="w-full h-auto rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewList;