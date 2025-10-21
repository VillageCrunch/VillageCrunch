import { useState, useEffect, useContext } from 'react';
import { toast } from 'react-hot-toast';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api, { submitContactForm } from '../utils/api';

const ContactUs = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-fill form with user data when user is logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await submitContactForm(formData);
      
      if (response.success) {
        toast.success(response.message);
        setFormData({
          name: user?.name || '',
          email: user?.email || '', 
          phone: user?.phone || '',
          subject: '',
          message: ''
        });
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-desi-brown to-amber-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-desi-brown mb-6">Contact Information</h2>
              <p className="text-gray-600 text-lg mb-8">
                Have a question about our premium dry fruits or need assistance with your order? 
                We're here to help! Reach out to us through any of the following channels.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-desi-gold bg-opacity-20 p-3 rounded-full">
                  <MapPin className="w-6 h-6 text-desi-brown" />
                </div>
                <div>
                  <h3 className="font-semibold text-desi-brown text-lg">Our Address</h3>
                  <p className="text-gray-600 mt-1">
                    123 Premium Market Street<br />
                    Dry Fruits District<br />
                    Mumbai, Maharashtra 400001<br />
                    India
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-desi-gold bg-opacity-20 p-3 rounded-full">
                  <Phone className="w-6 h-6 text-desi-brown" />
                </div>
                <div>
                  <h3 className="font-semibold text-desi-brown text-lg">Phone Numbers</h3>
                  <p className="text-gray-600 mt-1">
                    Customer Service: +91 98765 43210<br />
                    Bulk Orders: +91 98765 43211<br />
                    WhatsApp: +91 98765 43212
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-desi-gold bg-opacity-20 p-3 rounded-full">
                  <Mail className="w-6 h-6 text-desi-brown" />
                </div>
                <div>
                  <h3 className="font-semibold text-desi-brown text-lg">Email Addresses</h3>
                  <p className="text-gray-600 mt-1">
                    General Inquiries: info@premiumdryfruits.com<br />
                    Customer Support: support@premiumdryfruits.com<br />
                    Bulk Orders: bulk@premiumdryfruits.com
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-desi-gold bg-opacity-20 p-3 rounded-full">
                  <Clock className="w-6 h-6 text-desi-brown" />
                </div>
                <div>
                  <h3 className="font-semibold text-desi-brown text-lg">Business Hours</h3>
                  <p className="text-gray-600 mt-1">
                    Monday - Friday: 9:00 AM - 7:00 PM<br />
                    Saturday: 9:00 AM - 5:00 PM<br />
                    Sunday: 10:00 AM - 4:00 PM<br />
                    <span className="text-sm italic">(IST - Indian Standard Time)</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
              <h3 className="font-semibold text-desi-brown text-lg mb-3">Quick Response Promise</h3>
              <p className="text-gray-600 text-sm">
                We pride ourselves on excellent customer service. Our team typically responds to:
              </p>
              <ul className="text-gray-600 text-sm mt-2 space-y-1">
                <li>• Email inquiries within 24 hours</li>
                <li>• Phone calls during business hours</li>
                <li>• WhatsApp messages within 2-4 hours</li>
                <li>• Urgent matters within 1 hour</li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-desi-brown mb-6">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={!!user}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-desi-gold focus:border-transparent transition ${
                      user ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                    placeholder="Enter your full name"
                  />
                  {user && (
                    <p className="text-xs text-gray-500 mt-1">Auto-filled from your profile</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={!!user}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-desi-gold focus:border-transparent transition ${
                      user ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                    placeholder="Enter your email address"
                  />
                  {user && (
                    <p className="text-xs text-gray-500 mt-1">Auto-filled from your profile</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    disabled={!!user}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-desi-gold focus:border-transparent transition ${
                      user ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                    placeholder="Enter your phone number"
                  />
                  {user && (
                    <p className="text-xs text-gray-500 mt-1">Auto-filled from your profile</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-desi-gold focus:border-transparent transition"
                  >
                    <option value="">Select a subject</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Product Information">Product Information</option>
                    <option value="Order Support">Order Support</option>
                    <option value="Bulk Order">Bulk Order</option>
                    <option value="Quality Concern">Quality Concern</option>
                    <option value="Shipping Issue">Shipping Issue</option>
                    <option value="Payment Issue">Payment Issue</option>
                    <option value="Feedback/Suggestion">Feedback/Suggestion</option>
                    <option value="Partnership">Partnership/Business</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-desi-gold focus:border-transparent transition resize-none"
                  placeholder="Please describe your inquiry in detail..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-desi-brown text-white py-3 px-6 rounded-lg font-semibold hover:bg-amber-800 transition duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-sm text-orange-800">
                <strong>Note:</strong> Fields marked with * are required. We respect your privacy and will never share your information with third parties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;