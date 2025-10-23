import React, { useState, useContext } from 'react';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactUs = () => {
  const { user } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    subject: '',
    message: ''
  });

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
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Message sent successfully! We\'ll get back to you soon.');
        if (!user) {
          setFormData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: ''
          });
        } else {
          setFormData({
            ...formData,
            subject: '',
            message: ''
          });
        }
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-desi-brown mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-desi-brown mb-6">Get In Touch</h2>
              <div className="space-y-6">
                {/* Phone */}
                <div className="flex items-start space-x-4">
                  <div className="bg-desi-gold p-3 rounded-lg">
                    <Phone className="w-6 h-6 text-desi-brown" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Call Us</h3>
                    <p className="text-gray-600">+91 98765 43210</p>
                    <p className="text-sm text-gray-500">Mon-Sat, 9 AM - 8 PM</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4">
                  <div className="bg-desi-gold p-3 rounded-lg">
                    <Mail className="w-6 h-6 text-desi-brown" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email Support</h3>
                    <p className="text-gray-600">support@premiumdryfruits.com</p>
                    <p className="text-sm text-gray-500">We respond within 24 hours</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start space-x-4">
                  <div className="bg-desi-gold p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-desi-brown" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Visit Our Store</h3>
                    <address className="text-gray-600 not-italic">
                      123 Premium Dry Fruits Market<br />
                      Chandni Chowk, New Delhi<br />
                      Delhi 110006, India
                    </address>
                    <p className="text-sm text-gray-500 mt-1">Open Mon-Sat, 10 AM - 7 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick FAQ */}
            <div>
              <h3 className="text-xl font-bold text-desi-brown mb-4">Frequently Asked Questions</h3>
              <div className="space-y-3">
                <details className="bg-white p-4 rounded-lg border">
                  <summary className="font-medium cursor-pointer">How long does shipping take?</summary>
                  <p className="mt-2 text-gray-600">Standard delivery: 3-5 business days. Express delivery: 1-2 business days.</p>
                </details>
                <details className="bg-white p-4 rounded-lg border">
                  <summary className="font-medium cursor-pointer">What's your return policy?</summary>
                  <p className="mt-2 text-gray-600">30-day hassle-free returns for unopened products with full refund.</p>
                </details>
                <details className="bg-white p-4 rounded-lg border">
                  <summary className="font-medium cursor-pointer">Do you offer bulk discounts?</summary>
                  <p className="mt-2 text-gray-600">Yes! Special pricing for bulk orders above ₹5000. Contact us for quotes.</p>
                </details>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-desi-brown mb-6">Send us a Message</h2>
            
            {user && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-700">Hello {user.name}! We've pre-filled your details.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-desi-gold focus:border-desi-gold"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-desi-gold focus:border-desi-gold"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-desi-gold focus:border-desi-gold"
                  placeholder="Your contact number (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-desi-gold focus:border-desi-gold"
                >
                  <option value="">Select a topic</option>
                  <option value="General Inquiry">General Question</option>
                  <option value="Order Issue">Order Issue</option>
                  <option value="Product Question">Product Question</option>
                  <option value="Payment Issue">Payment Issue</option>
                  <option value="Shipping Query">Shipping Query</option>
                  <option value="Return/Refund">Return/Refund</option>
                  <option value="Bulk Order">Bulk Order Inquiry</option>
                  <option value="Feedback">Feedback & Suggestions</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-desi-gold focus:border-desi-gold resize-none"
                  placeholder="Please describe your question or concern in detail..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-desi-gold text-desi-brown py-3 px-6 rounded-lg font-semibold hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-desi-brown"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>

              <p className="text-center text-sm text-gray-500">
                Your information is safe with us. We respect your privacy.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;