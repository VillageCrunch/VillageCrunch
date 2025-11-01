import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import SEOHead from '../components/SEOHead';
import { getProducts, getAllProducts } from '../utils/api'; // <-- import API functions

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');

  // Fetch all products to extract categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllProducts();
        const allProducts = data.products || data || [];
        const uniqueCategories = [...new Set(allProducts.map(product => product.category).filter(Boolean))];
        setCategories(uniqueCategories.sort());
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedCategory !== 'all') params.category = selectedCategory;
        if (searchTerm.trim()) params.search = searchTerm;

        const data = await getProducts(params);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchTerm]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category !== 'all') {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
    // Scroll to top when category changes
    window.scrollTo(0, 0);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // just updating searchTerm triggers useEffect
  };

  // Dynamic SEO based on category and search
  const getSEOData = () => {
    if (selectedCategory && selectedCategory !== 'all') {
      return {
        title: `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} - Premium Quality Online`,
        description: `Buy premium ${selectedCategory} online at VillageCrunch. Fresh, natural, and authentic ${selectedCategory} with fast delivery across India. Shop now!`,
        keywords: `${selectedCategory} online, buy ${selectedCategory}, premium ${selectedCategory}, natural ${selectedCategory}`,
        url: `/products?category=${selectedCategory}`
      };
    } else if (searchTerm) {
      return {
        title: `Search Results for "${searchTerm}" - VillageCrunch Products`,
        description: `Find ${searchTerm} and related products at VillageCrunch. Premium quality dry fruits, makhana, and traditional snacks.`,
        keywords: `${searchTerm}, search products, dry fruits search`,
        url: `/products?search=${searchTerm}`
      };
    } else {
      return {
        title: 'All Products - Premium Dry Fruits, Makhana & Traditional Snacks',
        description: 'Browse our complete collection of premium dry fruits, roasted makhana, thekua, and authentic Bihari snacks. Quality guaranteed with fast delivery.',
        keywords: 'all products, dry fruits collection, makhana varieties, thekua types, premium snacks',
        url: '/products'
      };
    }
  };

  const seoData = getSEOData();

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead 
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        url={seoData.url}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Products', url: '/products' },
          ...(selectedCategory && selectedCategory !== 'all' ? [{ name: selectedCategory, url: `/products?category=${selectedCategory}` }] : [])
        ]}
      />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-desi-brown to-desi-gold text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Our Products</h1>
          <p className="text-lg opacity-90">
            Discover our range of premium dry fruits, makhana, and traditional sweets
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-4 text-desi-brown">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryChange('all')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${
                    selectedCategory === 'all'
                      ? 'bg-desi-gold text-white'
                      : 'hover:bg-desi-cream'
                  }`}
                >
                  All Products
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition capitalize ${
                      selectedCategory === category
                        ? 'bg-desi-gold text-white'
                        : 'hover:bg-desi-cream'
                    }`}
                  >
                    {category.replace('-', ' ')}
                  </button>
                ))}
              </div>

              {/* Search */}
              <form onSubmit={handleSearch} className="mt-6">
                <h3 className="font-bold text-lg mb-4 text-desi-brown">Search</h3>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-desi-gold"
                  />
                  <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                </div>
                <button
                  type="submit"
                  className="w-full mt-2 bg-desi-gold text-white py-2 rounded-lg hover:bg-yellow-600 transition"
                >
                  Search
                </button>
              </form>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-md h-96 animate-pulse">
                    <div className="h-64 bg-gray-300"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="mb-6 text-gray-600">
                  Showing {products.length} product{products.length !== 1 ? 's' : ''}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
