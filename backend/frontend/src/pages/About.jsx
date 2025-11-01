import { Award, Heart, Leaf, Users } from 'lucide-react';
import SEOHead from '../components/SEOHead';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead 
        title="About VillageCrunch - Premium Dry Fruits & Authentic Bihar Snacks"
        description="Learn about VillageCrunch's journey to bring authentic Bihari dry fruits, makhana, and thekua to your doorstep. Quality, tradition, and customer satisfaction since inception."
        keywords="VillageCrunch story, Bihar dry fruits company, authentic Indian snacks, premium quality makhana, traditional thekua makers"
        url="/about"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'About Us', url: '/about' }
        ]}
      />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-desi-brown to-desi-gold text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">About VillageCrunch</h1>
          <p className="text-xl max-w-3xl mx-auto opacity-90">
            Bringing the authentic taste of Bihar to your doorstep with premium quality 
            dry fruits, makhana, and traditional thekua.
          </p>
        </div>
      </div>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-desi-brown mb-6">Our Story</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Founded in the heart of Bihar, VillageCrunch was born from a passion to share 
                the rich culinary heritage of our region with the world. What started as a small 
                family business has grown into a trusted name for premium quality dry fruits and 
                traditional snacks.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We work directly with local farmers and producers to bring you the finest quality 
                products. Each item is carefully selected, tested, and packaged to ensure you 
                receive only the best.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our commitment to quality, authenticity, and customer satisfaction has made us 
                the preferred choice for thousands of families across India.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&h=600&fit=crop"
                alt="Our Story"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-desi-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-desi-brown mb-12 text-center">Our Values</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md text-center">
              <div className="bg-desi-gold p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-desi-brown">Quality First</h3>
              <p className="text-gray-600">
                We never compromise on quality. Every product is carefully tested and certified.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md text-center">
              <div className="bg-desi-gold p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Leaf className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-desi-brown">100% Natural</h3>
              <p className="text-gray-600">
                All our products are completely natural with no artificial additives.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md text-center">
              <div className="bg-desi-gold p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-desi-brown">Made with Love</h3>
              <p className="text-gray-600">
                Each product is prepared with care and traditional methods passed down generations.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md text-center">
              <div className="bg-desi-gold p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-desi-brown">Customer First</h3>
              <p className="text-gray-600">
                Your satisfaction is our priority. We're here to serve you better every day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-desi-brown mb-12 text-center">Why Choose Us?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="text-4xl mb-4">🌾</div>
              <h3 className="text-xl font-bold mb-3 text-desi-brown">Direct from Source</h3>
              <p className="text-gray-600">
                We work directly with farmers and local producers, ensuring freshness and fair prices.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="text-4xl mb-4">✓</div>
              <h3 className="text-xl font-bold mb-3 text-desi-brown">Quality Tested</h3>
              <p className="text-gray-600">
                Every batch undergoes rigorous quality checks before reaching you.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-xl font-bold mb-3 text-desi-brown">Hygienic Packaging</h3>
              <p className="text-gray-600">
                Food-grade packaging that keeps products fresh and maintains their nutritional value.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-bold mb-3 text-desi-brown">Fast Delivery</h3>
              <p className="text-gray-600">
                Quick and reliable delivery to ensure products reach you fresh.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-3 text-desi-brown">Best Prices</h3>
              <p className="text-gray-600">
                Premium quality at competitive prices - value for your money guaranteed.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold mb-3 text-desi-brown">Trusted by Thousands</h3>
              <p className="text-gray-600">
                Join our family of satisfied customers who trust us for their daily needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-desi-brown to-desi-gold text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Experience the Difference</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of happy customers who trust VillageCrunch for quality and authenticity
          </p>
          <a href="/products" className="inline-block bg-white text-desi-brown font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition text-lg">
            Start Shopping
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;