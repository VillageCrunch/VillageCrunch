import { RotateCcw, Clock, CheckCircle, XCircle, AlertTriangle, Phone, Mail } from 'lucide-react';

const ReturnsPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-desi-brown to-amber-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Returns & Refunds Policy</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Your satisfaction is our priority. Easy returns and hassle-free refunds.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Quick Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <div className="bg-desi-gold bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-desi-brown" />
            </div>
            <h3 className="font-semibold text-desi-brown mb-2">7 Days Return</h3>
            <p className="text-gray-600 text-sm">Return within 7 days of delivery</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <div className="bg-desi-gold bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <RotateCcw className="w-8 h-8 text-desi-brown" />
            </div>
            <h3 className="font-semibold text-desi-brown mb-2">Easy Process</h3>
            <p className="text-gray-600 text-sm">Simple return initiation</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <div className="bg-desi-gold bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-desi-brown" />
            </div>
            <h3 className="font-semibold text-desi-brown mb-2">Quick Refunds</h3>
            <p className="text-gray-600 text-sm">Processed within 5-7 days</p>
          </div>
        </div>

        {/* Detailed Policy */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          
          {/* Return Eligibility */}
          <section>
            <div className="flex items-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-desi-brown">Return Eligibility</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold text-desi-brown mb-2">Eligible for Returns</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    Damaged or spoiled products upon delivery
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    Wrong product delivered (different from order)
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    Missing items from your order
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    Quality issues (mold, insects, foreign objects)
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    Packaging tampering or damage
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    Expired products (check expiry date)
                  </li>
                </ul>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h3 className="font-semibold text-desi-brown mb-2">Not Eligible for Returns</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">✗</span>
                    Products consumed or opened (unless quality issues)
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">✗</span>
                    Change of mind or personal preference
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">✗</span>
                    Damage due to mishandling after delivery
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">✗</span>
                    Returns after 7 days from delivery
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">✗</span>
                    Custom or personalized gift items (unless defective)
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Return Process */}
          <section>
            <div className="flex items-center mb-4">
              <RotateCcw className="w-6 h-6 text-desi-brown mr-3" />
              <h2 className="text-2xl font-bold text-desi-brown">How to Return</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center mb-2">
                  <div className="bg-desi-brown text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">1</div>
                  <h3 className="font-semibold text-desi-brown">Contact Us</h3>
                </div>
                <p className="text-gray-700 text-sm ml-9">
                  Call us at +91 98765 43210 or email support@premiumdryfruits.com within 7 days of delivery. 
                  Provide your order number and reason for return.
                </p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center mb-2">
                  <div className="bg-desi-brown text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">2</div>
                  <h3 className="font-semibold text-desi-brown">Return Authorization</h3>
                </div>
                <p className="text-gray-700 text-sm ml-9">
                  Our team will review your request and provide a Return Authorization (RA) number 
                  along with return instructions within 24 hours.
                </p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center mb-2">
                  <div className="bg-desi-brown text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">3</div>
                  <h3 className="font-semibold text-desi-brown">Package & Ship</h3>
                </div>
                <p className="text-gray-700 text-sm ml-9">
                  Pack the items securely in original packaging (if available). Include the RA number. 
                  We'll arrange pickup or provide shipping instructions.
                </p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center mb-2">
                  <div className="bg-desi-brown text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">4</div>
                  <h3 className="font-semibold text-desi-brown">Inspection & Refund</h3>
                </div>
                <p className="text-gray-700 text-sm ml-9">
                  Once we receive and inspect the returned items, we'll process your refund within 5-7 business days.
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