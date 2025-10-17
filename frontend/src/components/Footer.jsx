import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-desi-brown text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-desi-gold">VillageCrunch</h3>
            <p className="text-sm text-gray-300 mb-4">
              Premium quality dry fruits, makhana, and traditional Bihari thekua. 
              Bringing authentic Indian flavors to your doorstep.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com/villagecrunch" target="_blank" rel="noopener noreferrer">
                <Facebook className="w-5 h-5 hover:text-desi-gold cursor-pointer transition" />
              </a>
              <a href="https://www.instagram.com/village_crunch/" target="_blank" rel="noopener noreferrer">
                <Instagram className="w-5 h-5 hover:text-desi-gold cursor-pointer transition" />
              </a>
              <a href="https://twitter.com/villagecrunch" target="_blank" rel="noopener noreferrer">
                <Twitter className="w-5 h-5 hover:text-desi-gold cursor-pointer transition" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-desi-gold">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-sm hover:text-desi-gold transition">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?category=dry-fruits" className="text-sm hover:text-desi-gold transition">
                  Dry Fruits
                </Link>
              </li>
              <li>
                <Link to="/products?category=makhana" className="text-sm hover:text-desi-gold transition">
                  Makhana
                </Link>
              </li>
              <li>
                <Link to="/products?category=thekua" className="text-sm hover:text-desi-gold transition">
                  Thekua
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-desi-gold">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm hover:text-desi-gold transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm hover:text-desi-gold transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-sm hover:text-desi-gold transition">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-sm hover:text-desi-gold transition">
                  Returns & Refunds
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-desi-gold">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 text-sm">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>123 Market Street, Patna, Bihar, India</span>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span>+916203009518</span>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span>info@desidelights.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 VillageCrunch. All rights reserved. Made with ❤️ in Bihar.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;