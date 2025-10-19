import { Truck, Clock, Package, Shield, MapPin, AlertCircle, Phone, Mail } from 'lucide-react';

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-desi-brown to-amber-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Shipping Policy</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Fast, secure, and reliable delivery of premium dry fruits to your doorstep
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Quick Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <div className="bg-desi-gold bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-8 h-8 text-desi-brown" />
            </div>
            <h3 className="font-semibold text-desi-brown mb-2">Free Shipping</h3>
            <p className="text-gray-600 text-sm">On orders above ₹999</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <div className="bg-desi-gold bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-desi-brown" />
            </div>
            <h3 className="font-semibold text-desi-brown mb-2">Fast Delivery</h3>
            <p className="text-gray-600 text-sm">2-5 business days</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <div className="bg-desi-gold bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-desi-brown" />
            </div>
            <h3 className="font-semibold text-desi-brown mb-2">Secure Packaging</h3>
            <p className="text-gray-600 text-sm">Freshness guaranteed</p>
          </div>
        </div>

        {/* Detailed Policy */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          
          {/* Shipping Zones */}
          <section>
            <div className="flex items-center mb-4">
              <MapPin className="w-6 h-6 text-desi-brown mr-3" />
              <h2 className="text-2xl font-bold text-desi-brown">Shipping Zones & Charges</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-desi-brown">Zone</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-desi-brown">States/Cities</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-desi-brown">Delivery Time</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-desi-brown">Shipping Charges</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 font-medium">Zone 1</td>
                    <td className="border border-gray-300 px-4 py-3">Mumbai, Delhi, Bangalore, Chennai, Kolkata, Hyderabad, Pune</td>
                    <td className="border border-gray-300 px-4 py-3">2-3 business days</td>
                    <td className="border border-gray-300 px-4 py-3">₹99 (Free above ₹999)</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-medium">Zone 2</td>
                    <td className="border border-gray-300 px-4 py-3">Other major cities in Maharashtra, Karnataka, Tamil Nadu, Delhi NCR</td>
                    <td className="border border-gray-300 px-4 py-3">3-4 business days</td>
                    <td className="border border-gray-300 px-4 py-3">₹149 (Free above ₹999)</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 font-medium">Zone 3</td>
                    <td className="border border-gray-300 px-4 py-3">Rest of India</td>
                    <td className="border border-gray-300 px-4 py-3">4-5 business days</td>
                    <td className="border border-gray-300 px-4 py-3">₹199 (Free above ₹999)</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-medium">Remote Areas</td>
                    <td className="border border-gray-300 px-4 py-3">Hills stations, remote locations</td>
                    <td className="border border-gray-300 px-4 py-3">5-7 business days</td>
                    <td className="border border-gray-300 px-4 py-3">₹299 (Free above ₹1499)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Processing Time */}
          <section>
            <div className="flex items-center mb-4">
              <Clock className="w-6 h-6 text-desi-brown mr-3" />
              <h2 className="text-2xl font-bold text-desi-brown">Order Processing Time</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h3 className="font-semibold text-desi-brown mb-2">Standard Orders</h3>
                <p className="text-gray-700">
                  Orders placed before 2:00 PM (IST) on business days are processed the same day. 
                  Orders placed after 2:00 PM or on weekends/holidays are processed the next business day.
                </p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-desi-brown mb-2">Bulk Orders (5kg+)</h3>
                <p className="text-gray-700">
                  Large quantity orders may require additional 1-2 business days for processing 
                  to ensure fresh packing and quality control.
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold text-desi-brown mb-2">Custom Gift Packaging</h3>
                <p className="text-gray-700">
                  Orders with special gift packaging or customization require additional 
                  1 business day for preparation.
                </p>
              </div>
            </div>
          </section>

          {/* Packaging */}
          <section>
            <div className="flex items-center mb-4">
              <Package className="w-6 h-6 text-desi-brown mr-3" />
              <h2 className="text-2xl font-bold text-desi-brown">Packaging Standards</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-desi-brown mb-3">Quality Assurance</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-desi-gold mr-2">•</span>
                    Food-grade, airtight containers for freshness
                  </li>
                  <li className="flex items-start">
                    <span className="text-desi-gold mr-2">•</span>
                    Double-layer packaging for fragile items
                  </li>
                  <li className="flex items-start">
                    <span className="text-desi-gold mr-2">•</span>
                    Temperature-controlled packaging when needed
                  </li>
                  <li className="flex items-start">
                    <span className="text-desi-gold mr-2">•</span>
                    Tamper-evident sealing for security
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-desi-brown mb-3">Eco-Friendly Approach</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-desi-gold mr-2">•</span>
                    Recyclable packaging materials
                  </li>
                  <li className="flex items-start">
                    <span className="text-desi-gold mr-2">•</span>
                    Minimal use of plastic
                  </li>
                  <li className="flex items-start">
                    <span className="text-desi-gold mr-2">•</span>
                    Biodegradable cushioning materials
                  </li>
                  <li className="flex items-start">
                    <span className="text-desi-gold mr-2">•</span>
                    Reusable containers for bulk orders
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Delivery Partners */}
          <section>
            <div className="flex items-center mb-4">
              <Shield className="w-6 h-6 text-desi-brown mr-3" />
              <h2 className="text-2xl font-bold text-desi-brown">Delivery Partners</h2>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-4">
                We partner with trusted logistics providers to ensure safe and timely delivery:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="font-semibold text-desi-brown">Blue Dart</div>
                  <div className="text-sm text-gray-600">Express Delivery</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="font-semibold text-desi-brown">FedEx</div>
                  <div className="text-sm text-gray-600">International</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="font-semibold text-desi-brown">DTDC</div>
                  <div className="text-sm text-gray-600">Nationwide</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="font-semibold text-desi-brown">Delhivery</div>
                  <div className="text-sm text-gray-600">Standard</div>
                </div>
              </div>
            </div>
          </section>

          {/* Special Instructions */}
          <section>
            <div className="flex items-center mb-4">
              <AlertCircle className="w-6 h-6 text-desi-brown mr-3" />
              <h2 className="text-2xl font-bold text-desi-brown">Important Notes</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h3 className="font-semibold text-desi-brown mb-2">Delivery Attempts</h3>
                <p className="text-gray-700 text-sm">
                  Our delivery partners will make up to 3 delivery attempts. If unsuccessful, 
                  the package will be held at the nearest facility for 7 days before being returned.
                </p>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h3 className="font-semibold text-desi-brown mb-2">Address Accuracy</h3>
                <p className="text-gray-700 text-sm">
                  Please ensure your delivery address is complete and accurate. We are not responsible 
                  for delays or non-delivery due to incorrect or incomplete addresses.
                </p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-desi-brown mb-2">Tracking Information</h3>
                <p className="text-gray-700 text-sm">
                  You will receive tracking information via SMS and email once your order is dispatched. 
                  Use this to monitor your package's journey.
                </p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="border-t pt-6">
            <h2 className="text-2xl font-bold text-desi-brown mb-4">Need Help?</h2>
            <p className="text-gray-700 mb-4">
              For any shipping-related queries or concerns, please contact our customer support team:
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-desi-brown" />
                <span className="text-gray-700">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-desi-brown" />
                <span className="text-gray-700">support@premiumdryfruits.com</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;