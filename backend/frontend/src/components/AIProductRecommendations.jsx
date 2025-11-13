import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import ProductCard from './ProductCard';
import { getProducts } from '../utils/api';

const AIProductRecommendations = ({ currentProduct, category, limit = 4 }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const allProducts = await getProducts({});
        
        let recommended = [];

        if (currentProduct) {
          // Smart recommendations based on current product
          recommended = getSmartRecommendations(allProducts, currentProduct);
        } else if (category) {
          // Category-based recommendations
          recommended = allProducts.filter(p => p.category === category);
        } else {
          // Popular/Featured products
          recommended = allProducts.filter(p => p.featured);
        }

        // Shuffle and limit
        recommended = shuffleArray(recommended).slice(0, limit);
        setRecommendations(recommended);
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [currentProduct, category, limit]);

  // AI-powered recommendation algorithm
  const getSmartRecommendations = (allProducts, currentProduct) => {
    const scores = allProducts
      .filter(p => p._id !== currentProduct._id) // Exclude current product
      .map(product => {
        let score = 0;

        // 1. Same category products (high relevance)
        if (product.category === currentProduct.category) {
          score += 40;
        }

        // 2. Similar price range (within 30%)
        const priceDiff = Math.abs(product.price - currentProduct.price) / currentProduct.price;
        if (priceDiff < 0.3) {
          score += 25;
        }

        // 3. Similar weight/size
        if (product.weight === currentProduct.weight) {
          score += 15;
        }

        // 4. Featured products boost
        if (product.featured) {
          score += 10;
        }

        // 5. In-stock products preferred
        if (product.stock > 0) {
          score += 10;
        }

        // 6. Cross-category intelligent pairing
        // If buying makhana, suggest thekua or dry fruits
        if (currentProduct.category === 'makhana' && 
            (product.category === 'thekua' || product.category === 'dry-fruits')) {
          score += 20;
        }
        // If buying thekua, suggest makhana or dry fruits
        if (currentProduct.category === 'thekua' && 
            (product.category === 'makhana' || product.category === 'dry-fruits')) {
          score += 20;
        }
        // If buying dry fruits, suggest other dry fruits or makhana
        if (currentProduct.category === 'dry-fruits' && 
            (product.category === 'dry-fruits' || product.category === 'makhana')) {
          score += 15;
        }

        return { product, score };
      })
      .sort((a, b) => b.score - a.score) // Sort by score descending
      .slice(0, 8) // Get top 8
      .map(item => item.product);

    return scores;
  };

  // Shuffle array for randomness
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  if (loading) {
    return (
      <section className="py-12 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <Sparkles className="w-6 h-6 text-desi-gold animate-pulse" />
            <h2 className="text-2xl md:text-3xl font-bold text-desi-brown">
              Villy is finding perfect matches...
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md h-96 animate-pulse">
                <div className="h-64 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-desi-gold/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-desi-brown/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-desi-brown mb-2">
            {currentProduct ? 'You May Also Like' : 'Recommended For You'}
          </h2>
          <p className="text-gray-600">
            {currentProduct 
              ? 'Handpicked by our AI based on this product'
              : 'Specially selected just for you'}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map((product, index) => (
            <div
              key={product._id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Info Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 flex items-center justify-center space-x-2">
            <Sparkles className="w-4 h-4 text-desi-gold" />
            <span>Smart recommendations powered by Villy</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default AIProductRecommendations;
