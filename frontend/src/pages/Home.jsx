import { useState, useEffect,useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Heart, Award, Truck } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../utils/api.js';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  // Simple inline Carousel component
  const Carousel = () => {
    const images = [
      { src: '/thekua.jpg', fallback: 'https://images.unsplash.com/photo-1607478900766-efe13248b125?w=600&h=600&fit=crop', alt: 'Thekua' },
      { src: '/Makhana.jpg', fallback: 'https://images.unsplash.com/photo-1604908177261-1d9b1d5f7a2a?w=600&h=600&fit=crop', alt: 'Makhana' },
      { src: '/391b485970e8dcdd2f41636fe121430a.jpg', fallback: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600&h=600&fit=crop', alt: 'Mix' },
      {src: '/almond.jpg', fallback: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600&h=600&fit=crop', alt: 'Almond' },
      {src: '/cashew.jpg', fallback: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600&h=600&fit=crop', alt: 'Cashew' },
      {src: '/guziya.jpg', fallback: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600&h=600&fit=crop', alt: 'Cashew' },

    ];

  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState(null);
  const [paused, setPaused] = useState(false);
  const timeoutRef = useRef(null);
  const animDuration = 1400; // match CSS transform duration

    useEffect(() => {
      if (paused) return;
      const t = setInterval(() => {
        setIndex(i => {
          // mark current as previous so it can animate out
          setPrev(i);
          // schedule prev clear after animation
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => setPrev(null), animDuration);
          return (i + 1) % images.length;
        });
      }, 3000);
      return () => {
        clearInterval(t);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }, [paused]);

    return (
      // aspect-ratio box (1:1) to keep height stable
      <div className="w-full max-w-md mx-auto" style={{ position: 'relative' }}>
        <div style={{ paddingTop: '100%', position: 'relative', width: '100%' }}
             onMouseEnter={() => setPaused(true)}
             onMouseLeave={() => setPaused(false)}>
          {images.map((img, i) => (
            <img
              key={i}
              src={img.src}
              alt={img.alt}
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = img.fallback; }}
              className={`carousel-slot ${i === index ? 'active' : i === prev ? 'exiting' : ''}`}
              style={{ borderRadius: '1rem', boxShadow: '0 25px 40px rgba(15,23,42,0.12)' }}
            />
          ))}
        </div>
      </div>
    );
  };

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const data = await getProducts({ featured: true });
        setFeaturedProducts(data.slice(0, 4));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchFeaturedProducts();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-desi-cream to-amber-50 pattern-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-desi-brown mb-6">
                Premium Indian
                <span className="block text-desi-gold">Dry Fruits & Makhana</span>
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                Experience the richness of authentic Bihari tradition with our handpicked 
                selection of premium dry fruits, roasted makhana, and traditional thekua.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/products"
                  className="btn-primary flex items-center space-x-2"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/about"
                  className="btn-secondary"
                >
                  Learn More
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-6 mt-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-desi-brown">100%</div>
                  <div className="text-sm text-gray-600">Natural</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-desi-brown">10k+</div>
                  <div className="text-sm text-gray-600">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-desi-brown">4.8★</div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              {/* Carousel container */}
              <div className="w-full max-w-md">
                <Carousel />
              </div>

              {/* Compact badge always below carousel */}
              <div className="mt-4 bg-white p-3 rounded-xl shadow-xl w-max">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="bg-desi-gold p-2 rounded-full flex items-center justify-center">
                    <Award className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-desi-brown">Premium Quality</div>
                    <div className="text-xs text-gray-600">Certified Products</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-desi-cream p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Heart className="w-8 h-8 text-desi-brown" />
              </div>
              <h3 className="font-semibold text-lg mb-2">100% Natural</h3>
              <p className="text-sm text-gray-600">No preservatives or artificial additives</p>
            </div>
            <div className="text-center">
              <div className="bg-desi-cream p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Award className="w-8 h-8 text-desi-brown" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Premium Quality</h3>
              <p className="text-sm text-gray-600">Handpicked and quality tested</p>
            </div>
            <div className="text-center">
              <div className="bg-desi-cream p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Truck className="w-8 h-8 text-desi-brown" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Fast Delivery</h3>
              <p className="text-sm text-gray-600">Quick delivery across India</p>
            </div>
            <div className="text-center">
              <div className="bg-desi-cream p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Star className="w-8 h-8 text-desi-brown" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Trusted Brand</h3>
              <p className="text-sm text-gray-600">Thousands of satisfied customers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 pattern-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Featured Products</h2>
            <p className="text-gray-600 mt-2">
              Explore our handpicked selection of premium products
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-flex items-center space-x-2 text-desi-gold font-semibold hover:text-yellow-600 transition"
            >
              <span>View All Products</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title mb-12">Shop by Category</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Link to="/products?category=dry-fruits" className="group relative overflow-hidden rounded-2xl shadow-lg h-64">
              <img
                src="/Product_Images/MixDry.jpg"
                alt="Dry Fruits"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Premium Dry Fruits</h3>
                  <p className="text-sm">Almonds, Cashews, Walnuts & More</p>
                </div>
              </div>
            </Link>

            <Link to="/products?category=makhana" className="group relative overflow-hidden rounded-2xl shadow-lg h-64">
              <img
                src="/Product_Images/Makhana.jpg"
                alt="Makhana"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Makhana</h3>
                  <p className="text-sm">Healthy & Crunchy Fox Nuts</p>
                </div>
              </div>
            </Link>

            <Link to="/products?category=thekua" className="group relative overflow-hidden rounded-2xl shadow-lg h-64">
              <img
                src= "/Product_Images/thekua.jpg"
                alt="Thekua"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Traditional Thekua</h3>
                  <p className="text-sm">Authentic Bihari Sweet Snack</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-desi-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title mb-12">What Our Customers Say</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Priya Sharma',
                location: 'Mumbai',
                rating: 5,
                text: 'Best quality dry fruits I have ever purchased! Fresh and perfectly packed.',
              },
              {
                name: 'Rajesh Kumar',
                location: 'Delhi',
                rating: 5,
                text: 'The makhana is absolutely delicious. My family loves it as a healthy snack.',
              },
              {
                name: 'Anjali Singh',
                location: 'Patna',
                rating: 5,
                text: 'Authentic Bihari thekua that reminds me of home. Simply amazing!',
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex text-desi-gold mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div className="font-semibold text-desi-brown">{testimonial.name}</div>
                <div className="text-sm text-gray-600">{testimonial.location}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;