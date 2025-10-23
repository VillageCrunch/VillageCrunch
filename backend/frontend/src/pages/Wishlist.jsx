import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Heart, ShoppingCart, Trash2, Package, ArrowLeft } from 'lucide-react';
import { getWishlist, removeFromWishlist } from '../utils/api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const data = await getWishlist();
      setWishlist(data);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      setRemoving(productId);
      await removeFromWishlist(productId);
      setWishlist(wishlist.filter(item => item._id !== productId));
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    } finally {
      setRemoving(null);
    }
  };

  const handleAddToCart = (product) => {
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image || product.images?.[0],
      weight: product.weight
    });
    toast.success('Added to cart', { duration: 1500 });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-desi-cream via-white to-desi-cream flex items-center justify-center">
        <div className="text-center bg-white p-12 rounded-3xl shadow-2xl border border-desi-cream/50">
          <Heart className="w-16 h-16 text-red-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-desi-brown mb-4">Access Required</h2>
          <p className="text-gray-600 mb-8">Please login to view your wishlist.</p>
          <Link 
            to="/login"
            className="bg-desi-gold text-white px-8 py-3 rounded-xl hover:bg-yellow-600 transition-all duration-300 transform hover:scale-105 font-semibold"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-desi-cream via-white to-desi-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-desi-gold mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-desi-cream via-white to-desi-cream py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/profile"
            className="inline-flex items-center space-x-2 text-desi-brown hover:text-desi-gold transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Profile</span>
          </Link>
          
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-red-400 to-pink-500 p-4 rounded-3xl">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
                <p className="text-gray-600">
                  {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} in your wishlist
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Wishlist Items */}
        {wishlist.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-16 text-center border border-gray-100">
            <div className="bg-gray-100 rounded-full p-8 w-32 h-32 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start adding products you love to your wishlist. You can easily add them to cart later!
            </p>
            <Link
              to="/products"
              className="bg-gradient-to-r from-desi-gold to-yellow-600 text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-semibold"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="relative">
                  <img
                    src={product.image || product.images?.[0]}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => handleRemoveFromWishlist(product._id)}
                    disabled={removing === product._id}
                    className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-lg"
                    title="Remove from wishlist"
                  >
                    {removing === product._id ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
                </div>
                
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-desi-gold">
                      ₹{product.price}
                    </span>
                    {product.weight && (
                      <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-lg">
                        {product.weight}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 bg-gradient-to-r from-desi-gold to-yellow-600 text-white px-4 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold flex items-center justify-center space-x-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>
                    <Link
                      to={`/products/${product._id}`}
                      className="bg-gray-100 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-200 transition-all duration-300 flex items-center justify-center"
                      title="View details"
                    >
                      <Package className="w-4 h-4" />
                    </Link>
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

export default Wishlist;