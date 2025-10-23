import React from 'react';
import { Truck, Clock, Package, Shield, MapPin, CheckCircle, Phone, Mail } from 'lucide-react';

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-desi-brown mb-4">Shipping Policy</h1>
          <p className="text-lg text-gray-600">Fast, secure, and reliable delivery across India</p>
        </div>

        {/* Quick Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="bg-desi-gold p-3 rounded-full w-fit mx-auto mb-4">
              <Truck className="w-6 h-6 text-desi-brown" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Delivery</h3>
            <p className="text-gray-600">2-5 business days across India</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="bg-desi-gold p-3 rounded-full w-fit mx-auto mb-4">
              <Shield className="w-6 h-6 text-desi-brown" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Packaging</h3>
            <p className="text-gray-600">Premium protection for freshness</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="bg-desi-gold p-3 rounded-full w-fit mx-auto mb-4">
              <Package className="w-6 h-6 text-desi-brown" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Free Shipping</h3>
            <p className="text-gray-600">On orders above ₹999</p>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center mb-6">
            <Clock className="w-6 h-6 text-desi-gold mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Delivery Timeframes</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-l-4 border-desi-gold pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Express Delivery</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Metro cities: 1-2 business days
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Tier 1 cities: 2-3 business days
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Other locations: 3-5 business days
                </li>
              </ul>
            </div>

            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Standard Delivery</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  FREE on orders ₹999+
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  All India coverage
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  3-7 business days
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Shipping Charges */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center mb-6">
            <Package className="w-6 h-6 text-desi-gold mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Shipping Charges</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="py-3 px-4 text-gray-900 font-semibold">Order Value</th>
                  <th className="py-3 px-4 text-gray-900 font-semibold">Shipping Charge</th>
                  <th className="py-3 px-4 text-gray-900 font-semibold">Delivery Time</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-600">Above ₹999</td>
                  <td className="py-3 px-4 text-green-600 font-semibold">FREE</td>
                  <td className="py-3 px-4 text-gray-600">3-7 business days</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-600">₹500 - ₹999</td>
                  <td className="py-3 px-4 text-gray-600">₹50</td>
                  <td className="py-3 px-4 text-gray-600">3-7 business days</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-600">Below ₹500</td>
                  <td className="py-3 px-4 text-gray-600">₹80</td>
                  <td className="py-3 px-4 text-gray-600">3-7 business days</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-600">Express Delivery</td>
                  <td className="py-3 px-4 text-gray-600">₹100 (additional)</td>
                  <td className="py-3 px-4 text-gray-600">1-3 business days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Packaging Information */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center mb-6">
            <Shield className="w-6 h-6 text-desi-gold mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Packaging & Protection</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Premium Protection</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Food-grade vacuum sealing
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Moisture-proof packaging
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Temperature-controlled handling
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Tamper-evident seals
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Eco-Friendly Approach</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  100% recyclable materials
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Biodegradable cushioning
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Reusable containers available
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Minimal plastic usage
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Coverage Areas */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center mb-6">
            <MapPin className="w-6 h-6 text-desi-gold mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Delivery Coverage</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-3xl font-bold text-desi-brown mb-2">650+</div>
              <div className="text-gray-600">Cities & Towns</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-3xl font-bold text-desi-brown mb-2">28</div>
              <div className="text-gray-600">States Covered</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-3xl font-bold text-desi-brown mb-2">99.9%</div>
              <div className="text-gray-600">On-Time Delivery</div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">We deliver to:</h3>
            <div className="grid md:grid-cols-2 gap-4 text-gray-600">
              <div>
                <h4 className="font-medium mb-2">Metro Cities:</h4>
                <p className="text-sm">Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad, Pune, Ahmedabad</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Tier 1 & 2 Cities:</h4>
                <p className="text-sm">All major cities and towns across India with reliable courier services</p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-amber-50 border-l-4 border-amber-400 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-amber-800 mb-3">Important Notes</h3>
          <ul className="space-y-2 text-amber-700">
            <li>• Delivery times are estimates and may vary due to weather conditions or unforeseen circumstances</li>
            <li>• Orders placed before 2 PM are processed the same day (Monday-Saturday)</li>
            <li>• We do not deliver on Sundays and public holidays</li>
            <li>• Remote locations may require additional 1-2 days for delivery</li>
            <li>• You will receive tracking information via SMS and email once your order is dispatched</li>
          </ul>
        </div>

        {/* Contact for Shipping Help */}
        <div className="bg-desi-brown rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Need Shipping Help?</h2>
          <p className="text-lg opacity-90 mb-6">
            Our customer service team is here to help with all your shipping questions.
          </p>
          <div className="grid md:grid-cols-2 gap-6 max-w-md mx-auto">
            <div className="flex items-center justify-center space-x-3 bg-white/10 rounded-lg p-4">
              <Phone className="w-5 h-5" />
              <div className="text-left">
                <div className="font-semibold">Call Us</div>
                <div className="text-sm opacity-90">+91 98765 43210</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3 bg-white/10 rounded-lg p-4">
              <Mail className="w-5 h-5" />
              <div className="text-left">
                <div className="font-semibold">Email Us</div>
                <div className="text-sm opacity-90">support@premiumdryfruits.com</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;