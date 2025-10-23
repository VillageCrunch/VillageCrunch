import { RotateCcw, Clock, CheckCircle, XCircle, AlertTriangle, Phone, Mail, Zap, Heart, Award, Star, Globe, Coffee, Gift, Sparkles, MessageCircle, Shield, Package, RefreshCw } from 'lucide-react';

const ReturnsPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      {/* Animated Hero Section */}
      <div className="relative bg-gradient-to-br from-red-600 via-rose-700 to-desi-brown text-white py-24 overflow-hidden">
        {/* Background Animation Elements */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-16 left-10 animate-bounce">
            <RefreshCw className="w-14 h-14" />
          </div>
          <div className="absolute top-32 right-20 animate-pulse">
            <Shield className="w-16 h-16" />
          </div>
          <div className="absolute bottom-20 left-1/4 animate-bounce">
            <Heart className="w-12 h-12" />
          </div>
          <div className="absolute bottom-32 right-16 animate-pulse">
            <Award className="w-10 h-10" />
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="mb-8">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-desi-gold animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-desi-gold to-white bg-clip-text text-transparent">
            🔄 Returns Made Easy!
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed">
            💝 Your happiness is our success! Not satisfied? No worries - we've got your back with our super-friendly return policy! 🤗
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Clock className="w-5 h-5 text-desi-gold" />
              <span className="text-sm font-medium">7-Day Returns</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <RefreshCw className="w-5 h-5 text-desi-gold" />
              <span className="text-sm font-medium">100% Refund</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Heart className="w-5 h-5 text-desi-gold" />
              <span className="text-sm font-medium">Zero Hassle</span>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-0 w-24 h-24 bg-desi-gold/10 rounded-full animate-float"></div>
          <div className="absolute bottom-1/3 right-0 w-32 h-32 bg-white/10 rounded-full animate-float-delay"></div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Enhanced Overview */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our 
            <span className="bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent"> Promise to You!</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We stand behind every nut, every date, every almond! Your satisfaction is our mission! 🎯
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="group bg-gradient-to-br from-white to-red-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl text-center transform hover:scale-105 transition-all duration-300 border border-red-100">
            <div className="bg-gradient-to-br from-red-500 to-rose-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:animate-pulse shadow-lg">
              <Clock className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">⏰ 7-Day Window</h3>
            <p className="text-gray-600 mb-4">Plenty of time to try and decide - no rush, no pressure!</p>
            <div className="bg-red-100 rounded-lg p-3">
              <p className="text-red-700 font-bold">Week-Long Peace of Mind</p>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-white to-green-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl text-center transform hover:scale-105 transition-all duration-300 border border-green-100">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:animate-pulse shadow-lg">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">💯 Full Refund</h3>
            <p className="text-gray-600 mb-4">Every single paisa back - because we believe in fairness!</p>
            <div className="bg-green-100 rounded-lg p-3">
              <p className="text-green-700 font-bold">100% Money Back</p>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-white to-purple-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl text-center transform hover:scale-105 transition-all duration-300 border border-purple-100">
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:animate-pulse shadow-lg">
              <RefreshCw className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">🚀 Zero Hassle</h3>
            <p className="text-gray-600 mb-4">Simple 3-step process - easier than eating the nuts!</p>
            <div className="bg-purple-100 rounded-lg p-3">
              <p className="text-purple-700 font-bold">Super Simple Process</p>
            </div>
          </div>
        </div>

        {/* Customer Love Stats */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 rounded-3xl p-8 text-white mb-16">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-2">❤️ Customer Happiness Metrics</h3>
            <p className="opacity-90">These numbers make us smile every day! 😊</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="space-y-3">
              <div className="text-4xl font-bold text-desi-gold">99.8%</div>
              <div className="text-sm opacity-90">Satisfaction Rate</div>
              <Heart className="w-6 h-6 mx-auto text-desi-gold" />
            </div>
            <div className="space-y-3">
              <div className="text-4xl font-bold text-desi-gold">2hrs</div>
              <div className="text-sm opacity-90">Return Processing</div>
              <Zap className="w-6 h-6 mx-auto text-desi-gold" />
            </div>
            <div className="space-y-3">
              <div className="text-4xl font-bold text-desi-gold">0.2%</div>
              <div className="text-sm opacity-90">Return Rate</div>
              <Award className="w-6 h-6 mx-auto text-desi-gold" />
            </div>
            <div className="space-y-3">
              <div className="text-4xl font-bold text-desi-gold">5⭐</div>
              <div className="text-sm opacity-90">Return Experience</div>
              <Star className="w-6 h-6 mx-auto text-desi-gold" />
            </div>
          </div>
        </div>

        {/* Enhanced Policy Sections */}
        <div className="space-y-12">
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-8 shadow-lg border border-blue-100">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-full mr-4 shadow-lg">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">🎯 Super Simple Return Process</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 border-l-4 border-blue-500 text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-xl">1</span>
                </div>
                <h4 className="font-bold text-blue-700 mb-3">📞 Contact Us</h4>
                <p className="text-gray-600 text-sm">Call, email, or WhatsApp us with your order details. We're super friendly!</p>
              </div>
              <div className="bg-white rounded-xl p-6 border-l-4 border-green-500 text-center">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 font-bold text-xl">2</span>
                </div>
                <h4 className="font-bold text-green-700 mb-3">📦 Pack & Ship</h4>
                <p className="text-gray-600 text-sm">Pack the items nicely and ship them back. We'll arrange pickup if needed!</p>
              </div>
              <div className="bg-white rounded-xl p-6 border-l-4 border-purple-500 text-center">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 font-bold text-xl">3</span>
                </div>
                <h4 className="font-bold text-purple-700 mb-3">💰 Get Refund</h4>
                <p className="text-gray-600 text-sm">Money back in 2-5 business days. Fast, secure, guaranteed!</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl p-8 shadow-lg border border-orange-100">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-full mr-4 shadow-lg">
                <Package className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">📋 What Can Be Returned?</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 border-l-4 border-green-500">
                <h4 className="font-bold text-green-700 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  ✅ We Accept Returns For
                </h4>
                <ul className="text-gray-600 space-y-3">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Damaged or spoiled products</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Wrong items delivered</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Quality issues or defects</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Missing items from order</li>
                </ul>
              </div>
              <div className="bg-white rounded-xl p-6 border-l-4 border-red-500">
                <h4 className="font-bold text-red-700 mb-4 flex items-center">
                  <XCircle className="w-5 h-5 mr-2 text-red-500" />
                  ❌ Sorry, No Returns For
                </h4>
                <ul className="text-gray-600 space-y-3">
                  <li className="flex items-center"><XCircle className="w-4 h-4 mr-2 text-red-500" /> Products you don't like</li>
                  <li className="flex items-center"><XCircle className="w-4 h-4 mr-2 text-red-500" /> Items consumed/opened</li>
                  <li className="flex items-center"><XCircle className="w-4 h-4 mr-2 text-red-500" /> Products past return window</li>
                  <li className="flex items-center"><XCircle className="w-4 h-4 mr-2 text-red-500" /> Custom/personalized items</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Contact Section */}
        <div className="bg-gradient-to-br from-red-600 to-rose-700 rounded-3xl p-8 text-white text-center">
          <Coffee className="w-12 h-12 mx-auto mb-4 text-desi-gold" />
          <h2 className="text-3xl font-bold mb-4">💝 Need Return Help?</h2>
          <p className="text-xl opacity-90 mb-6 max-w-2xl mx-auto">
            Our return specialists are standing by to make things right! Let's solve this together! 🤝
          </p>
          <div className="grid md:grid-cols-2 gap-6 max-w-lg mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center space-x-3">
              <Phone className="w-6 h-6 text-desi-gold" />
              <div className="text-left">
                <div className="font-bold">📞 Call Us</div>
                <div className="text-sm opacity-90">+91 98765 43210</div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center space-x-3">
              <Mail className="w-6 h-6 text-desi-gold" />
              <div className="text-left">
                <div className="font-bold">✉️ Email Us</div>
                <div className="text-sm opacity-90">returns@premiumdryfruits.com</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnsPolicy;
                </p>
              </div>
            </div>
          </section>

          {/* Refund Policy */}
          <section>
            <div className="flex items-center mb-4">
              <Clock className="w-6 h-6 text-desi-brown mr-3" />
              <h2 className="text-2xl font-bold text-desi-brown">Refund Policy</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-desi-brown">Payment Method</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-desi-brown">Refund Method</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-desi-brown">Processing Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3">Credit/Debit Card</td>
                    <td className="border border-gray-300 px-4 py-3">Original card</td>
                    <td className="border border-gray-300 px-4 py-3">5-7 business days</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3">Net Banking</td>
                    <td className="border border-gray-300 px-4 py-3">Original bank account</td>
                    <td className="border border-gray-300 px-4 py-3">5-7 business days</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3">UPI/Wallets</td>
                    <td className="border border-gray-300 px-4 py-3">Original source</td>
                    <td className="border border-gray-300 px-4 py-3">3-5 business days</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3">Cash on Delivery</td>
                    <td className="border border-gray-300 px-4 py-3">Bank transfer</td>
                    <td className="border border-gray-300 px-4 py-3">7-10 business days</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-desi-brown mb-1">Important Notes</h3>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>• Shipping charges are non-refundable (except for our errors)</li>
                    <li>• For COD orders, provide bank details for refund processing</li>
                    <li>• Refund amount may vary due to bank charges or exchange rates</li>
                    <li>• You'll receive an email confirmation once refund is processed</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Replacement Policy */}
          <section>
            <div className="flex items-center mb-4">
              <RotateCcw className="w-6 h-6 text-desi-brown mr-3" />
              <h2 className="text-2xl font-bold text-desi-brown">Replacement Policy</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold text-desi-brown mb-2">When We Offer Replacements</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Damaged products due to shipping
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Wrong product delivered
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Quality issues identified upon delivery
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    When the same product is available in stock
                  </li>
                </ul>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-desi-brown mb-2">Replacement Process</h3>
                <p className="text-gray-700 text-sm">
                  Replacement items are shipped once we receive the returned product. 
                  If the same product is not available, we'll offer a similar alternative 
                  or process a full refund as per your preference.
                </p>
              </div>
            </div>
          </section>

          {/* Special Cases */}
          <section>
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-desi-brown mr-3" />
              <h2 className="text-2xl font-bold text-desi-brown">Special Cases</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h3 className="font-semibold text-desi-brown mb-2">Bulk Orders (5kg+)</h3>
                <p className="text-gray-700 text-sm">
                  For bulk orders, partial returns are accepted. Return policy remains 
                  the same but processing may take additional 2-3 days due to quantity verification.
                </p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-desi-brown mb-2">Gift Orders</h3>
                <p className="text-gray-700 text-sm">
                  Gift recipients can return items using the same process. 
                  Refund will be processed to the original purchaser's payment method.
                </p>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h3 className="font-semibold text-desi-brown mb-2">International Orders</h3>
                <p className="text-gray-700 text-sm">
                  International returns require prior approval. Return shipping costs 
                  are borne by the customer unless the return is due to our error.
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-desi-brown mb-2">Quality Complaints</h3>
                <p className="text-gray-700 text-sm">
                  For quality issues, we may request photos for initial assessment. 
                  This helps us process your return faster and improve our quality control.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="border-t pt-6">
            <h2 className="text-2xl font-bold text-desi-brown mb-4">Need Help with Returns?</h2>
            <p className="text-gray-700 mb-4">
              Our customer support team is here to help you with any return or refund queries:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-desi-brown mb-3">Customer Support</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-desi-brown" />
                    <span className="text-gray-700 text-sm">+91 98765 43210</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-desi-brown" />
                    <span className="text-gray-700 text-sm">support@premiumdryfruits.com</span>
                  </div>
                  <div className="text-gray-600 text-xs mt-2">
                    Available: Mon-Fri 9AM-7PM, Sat 9AM-5PM
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-desi-brown mb-3">Quick Tips</h3>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• Keep your order number handy</li>
                  <li>• Take photos of damaged items</li>
                  <li>• Report issues within 7 days</li>
                  <li>• Check product expiry dates</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ReturnsPolicy;