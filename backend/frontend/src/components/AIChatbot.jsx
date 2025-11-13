import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles, Headphones, User, Upload, Image as ImageIcon } from 'lucide-react';
import { getProducts } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AIChatbot = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [products, setProducts] = useState([]);
  const [showAgentOptions, setShowAgentOptions] = useState(false);
  const [isConnectedToAgent, setIsConnectedToAgent] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [currentTicketId, setCurrentTicketId] = useState(null);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize greeting message with user's name
  useEffect(() => {
    const greeting = user?.name 
      ? `👋 Hi ${user.name}! I'm Villy, your VillageCrunch AI assistant. I can help you find the perfect dry fruits, makhana, or thekua!\n\nI can help with:\n• Product information\n• Pricing & offers\n• Delivery details\n• Order tracking\n\nIf you need help with an issue or want to speak with our team, just let me know!`
      : '👋 Hi! I\'m Villy, your VillageCrunch AI assistant. I can help you find the perfect dry fruits, makhana, or thekua!\n\nI can help with:\n• Product information\n• Pricing & offers\n• Delivery details\n• Order tracking\n\nIf you need help with an issue or want to speak with our team, just let me know!';
    
    setMessages([{
      type: 'bot',
      text: greeting,
      timestamp: new Date()
    }]);
  }, [user]);

  // Load products for AI recommendations
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts({});
        setProducts(data);
      } catch (error) {
        console.error('Failed to load products:', error);
      }
    };
    loadProducts();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle image selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Connect to customer care agent
  const connectToAgent = async () => {
    try {
      setIsConnectedToAgent(true);
      setShowAgentOptions(false);
      
      // Create a new support ticket
      const response = await fetch('http://localhost:8080/api/support/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          message: messages[messages.length - 1]?.text || 'Customer requesting support',
          category: 'other'
        })
      });

      const data = await response.json();

      if (data.success) {
        setCurrentTicketId(data.ticket._id);
        
        const agentMsg = {
          type: 'system',
          text: '🎧 **Connected to Customer Care**\n\nYou are now chatting with our customer care team. They will help you with your issue.\n\n• You can upload images of the product\n• Our agent will call you if needed\n• Average response time: 2-5 minutes\n\nPlease describe your issue...',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, agentMsg]);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error connecting to agent:', error);
      toast.error('Failed to connect to customer care. Please try again.');
      setIsConnectedToAgent(false);
    }
  };

  // AI Response Logic
  const getAIResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();

    // If connected to agent, don't provide AI responses
    if (isConnectedToAgent) {
      return null;
    }

    // Issue/Problem/Complaint detection
    if (msg.includes('issue') || msg.includes('problem') || msg.includes('complaint') || 
        msg.includes('defect') || msg.includes('broken') || msg.includes('damaged') ||
        msg.includes('wrong') || msg.includes('missing') || msg.includes('not received') ||
        msg.includes('bad quality') || msg.includes('expired') || msg.includes('stale')) {
      setShowAgentOptions(true);
      return '😟 I\'m sorry to hear you\'re having an issue! \n\n' +
        'For product issues, refunds, or replacements, our Customer Care team can help you better.\n\n' +
        '✅ **What our team can do:**\n' +
        '• Review your issue with photos\n' +
        '• Process refunds instantly\n' +
        '• Arrange replacements\n' +
        '• Call you directly if needed\n\n' +
        '👉 Would you like to connect with Customer Care now?';
    }

    // Agent/Human request
    if (msg.includes('agent') || msg.includes('human') || msg.includes('person') || 
        msg.includes('representative') || msg.includes('customer care') || msg.includes('support team')) {
      setShowAgentOptions(true);
      return '👤 I\'ll connect you with our customer care team!\n\n' +
        '**Benefits of talking to our team:**\n' +
        '• Real-time chat support\n' +
        '• Upload product images\n' +
        '• Get callback if needed\n' +
        '• Faster issue resolution\n\n' +
        'Click "Connect to Customer Care" below to start!';
    }

    // Greeting responses
    if (msg.match(/^(hi|hello|hey|namaste)/)) {
      return 'Hello! 😊 I\'m Villy, your friendly shopping assistant! I\'m here to help you discover our premium dry fruits, makhana, and traditional thekua. What interests you?\n\n💡 Need to talk to a human? Just type "agent" anytime!';
    }

    // Product category questions
    if (msg.includes('makhana') || msg.includes('fox nut')) {
      const makhanaProducts = products.filter(p => p.category === 'makhana');
      if (makhanaProducts.length > 0) {
        return `🌟 We have ${makhanaProducts.length} delicious makhana options!\n\n` +
          makhanaProducts.map(p => `• ${p.name} - ${p.weight} at ₹${p.price}`).join('\n') +
          '\n\nAll our makhana is roasted to perfection. Which flavor interests you?';
      }
      return '🌟 Our makhana (fox nuts) are roasted fresh and super crunchy! Check out our Peri Peri, Classic Roasted, and Natural varieties.';
    }

    if (msg.includes('thekua') || msg.includes('sweet') || msg.includes('traditional')) {
      const thekuaProducts = products.filter(p => p.category === 'thekua');
      if (thekuaProducts.length > 0) {
        return `🍪 We offer ${thekuaProducts.length} authentic Bihar thekua varieties!\n\n` +
          thekuaProducts.map(p => `• ${p.name} - ${p.weight} at ₹${p.price}`).join('\n') +
          '\n\nPerfect for festivals or daily snacking! All homemade style.';
      }
      return '🍪 Our traditional Bihari thekua is made with authentic recipes - perfect for festivals or gifting!';
    }

    if (msg.includes('dry fruit') || msg.includes('almond') || msg.includes('cashew') || msg.includes('walnut')) {
      const dryFruits = products.filter(p => p.category === 'dry-fruits');
      if (dryFruits.length > 0) {
        return `🥜 Premium dry fruits collection (${dryFruits.length} varieties):\n\n` +
          dryFruits.map(p => `• ${p.name} - ${p.weight} at ₹${p.price}`).join('\n') +
          '\n\n100% natural, premium quality! Great for health and gifting.';
      }
      return '🥜 We have premium almonds, cashews, walnuts, and more! All 100% natural and carefully selected.';
    }

    // Price questions
    if (msg.includes('price') || msg.includes('cost') || msg.includes('rate')) {
      return '💰 Our prices are competitive! Makhana starts from ₹199, Thekua from ₹199, and Premium Dry Fruits from ₹249. Free delivery on orders above ₹500!';
    }

    // Delivery questions
    if (msg.includes('deliver') || msg.includes('shipping') || msg.includes('ship')) {
      return '🚚 We deliver across India! Orders typically reach within 3-5 business days. Free shipping on orders above ₹500. We use trusted courier partners.';
    }

    // Quality questions
    if (msg.includes('quality') || msg.includes('fresh') || msg.includes('natural')) {
      return '✨ All our products are 100% natural with no preservatives! We source directly and ensure premium quality. Every item is checked before dispatch.';
    }

    // Order/Payment questions
    if (msg.includes('order') || msg.includes('payment') || msg.includes('cod')) {
      return '💳 We accept Credit/Debit Cards, UPI, Net Banking, and Cash on Delivery. Your order will be confirmed immediately after payment!';
    }

    // Return/Refund questions
    if (msg.includes('return') || msg.includes('refund') || msg.includes('replace')) {
      return '🔄 **Returns & Refunds Policy:**\n\n' +
        '✅ 7-day return for unopened products\n' +
        '✅ Instant replacement for damaged items\n' +
        '✅ Full refund if not satisfied\n' +
        '✅ Free return pickup\n\n' +
        '**How to Return:**\n' +
        '1. Contact us within 7 days\n' +
        '2. We arrange free pickup\n' +
        '3. Refund in 3-5 business days\n\n' +
        'Have a specific issue? Type "agent" to talk to our customer care team for immediate assistance!';
    }

    // Recommendation request
    if (msg.includes('recommend') || msg.includes('suggest') || msg.includes('best') || msg.includes('popular')) {
      const popular = products.filter(p => p.featured).slice(0, 3);
      if (popular.length > 0) {
        return `⭐ Our most popular items:\n\n` +
          popular.map(p => `• ${p.name} - ${p.weight} at ₹${p.price}`).join('\n') +
          '\n\nCustomers love these! Want to add any to your cart?';
      }
      return '⭐ I recommend trying our Peri Peri Makhana for spicy lovers, Traditional Thekua for authentic taste, or Mixed Dry Fruits for healthy snacking!';
    }

    // Help/Support
    if (msg.includes('help') || msg.includes('support') || msg.includes('contact')) {
      setShowAgentOptions(true);
      return '📞 **How can I help you?**\n\n' +
        '🤖 Chat with me (Villy) for:\n' +
        '• Product information\n' +
        '• Pricing & availability\n' +
        '• Delivery tracking\n' +
        '• General questions\n\n' +
        '👤 Talk to Customer Care for:\n' +
        '• Order issues\n' +
        '• Returns & refunds\n' +
        '• Payment problems\n' +
        '• Urgent matters\n\n' +
        '**Contact Options:**\n' +
        '📞 Call: +91-XXXXXXXXXX\n' +
        '📧 Email: support@villagecrunch.com\n' +
        '💬 Type "agent" to connect now!';
    }

    // Default response with suggestions
    return 'I can help you with:\n\n' +
      '🥜 Product information (Dry fruits, Makhana, Thekua)\n' +
      '💰 Pricing and offers\n' +
      '🚚 Delivery details\n' +
      '💳 Payment options\n' +
      '🔄 Returns & refunds\n\n' +
      'What would you like to know?\n\n' +
      '💡 Need human assistance? Type "agent" anytime!';
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !selectedImage) return;
    if (isSendingMessage) return; // Prevent duplicate sends

    setIsSendingMessage(true);

    // Add user message
    const userMsg = {
      type: 'user',
      text: inputMessage,
      image: imagePreview,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    
    const messageText = inputMessage;
    const imageFile = selectedImage;
    
    setInputMessage('');
    setSelectedImage(null);
    setImagePreview(null);

    // If connected to agent, send to backend
    if (isConnectedToAgent && currentTicketId) {
      setIsTyping(true);
      
      try {
        const formData = new FormData();
        formData.append('message', messageText);
        if (imageFile) {
          formData.append('image', imageFile);
        }

        const response = await fetch(`http://localhost:8080/api/support/${currentTicketId}/message`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });

        const data = await response.json();

        if (data.success) {
          // Message sent successfully
          toast.success('Message sent to customer care');
          
          // Simulate agent response (in real app, this would come via WebSocket/polling)
          setTimeout(() => {
            const agentResponse = {
              type: 'agent',
              text: 'Thank you for sharing the details. Our team is reviewing your case. ' +
                    (imageFile ? 'We\'ve received your image. ' : '') +
                    'If we need more information, we\'ll call you shortly. Average wait time: 3-5 minutes.',
              timestamp: new Date()
            };
            setMessages(prev => [...prev, agentResponse]);
            setIsTyping(false);
          }, 2000);
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error('Error sending message:', error);
        toast.error('Failed to send message. Please try again.');
        setIsTyping(false);
      } finally {
        setIsSendingMessage(false);
      }
      return;
    }

    setIsSendingMessage(false);

    // AI response
    setIsTyping(true);
    setTimeout(() => {
      const aiResponse = getAIResponse(messageText);
      if (aiResponse) {
        const botMsg = {
          type: 'bot',
          text: aiResponse,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMsg]);
      }
      setIsTyping(false);
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-desi-gold to-yellow-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 z-50 group"
          aria-label="Open AI Chat"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold rounded-full px-1.5 py-0.5 flex items-center justify-center animate-pulse">
            Villy
          </span>
          <span className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Ask me anything! 💬
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 animate-scale-in border-2 border-desi-gold/20">
          {/* Header */}
          <div className="bg-gradient-to-r from-desi-gold to-yellow-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-desi-gold" />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="font-bold">Villy {isConnectedToAgent && '→ Customer Care'}</h3>
                <p className="text-xs opacity-90">
                  {isConnectedToAgent ? '🟢 Connected to Agent' : 'Your AI Shopping Assistant'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-2 rounded-full transition"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.type === 'user'
                      ? 'bg-desi-gold text-white rounded-br-none'
                      : msg.type === 'system'
                      ? 'bg-blue-50 text-blue-900 rounded-lg border-2 border-blue-200'
                      : msg.type === 'agent'
                      ? 'bg-green-50 text-green-900 rounded-bl-none border-2 border-green-200'
                      : 'bg-white text-gray-800 rounded-bl-none shadow-md border border-gray-100'
                  }`}
                >
                  {msg.image && (
                    <img 
                      src={msg.image} 
                      alt="Uploaded" 
                      className="w-full rounded-lg mb-2 max-h-48 object-cover"
                    />
                  )}
                  <p className="text-sm whitespace-pre-line">{msg.text}</p>
                  <p className="text-xs opacity-60 mt-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {/* Agent Contact Options */}
            {showAgentOptions && !isConnectedToAgent && (
              <div className="flex justify-center">
                <button
                  onClick={connectToAgent}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition flex items-center space-x-2 shadow-lg"
                >
                  <Headphones className="w-5 h-5" />
                  <span className="font-semibold">Connect to Customer Care</span>
                </button>
              </div>
            )}

            {isTyping && (
              <div className="flex justify-start">
                <div className={`p-3 rounded-2xl rounded-bl-none shadow-md ${
                  isConnectedToAgent ? 'bg-green-50 border-2 border-green-200' : 'bg-white border border-gray-100'
                }`}>
                  <Loader2 className={`w-5 h-5 animate-spin ${
                    isConnectedToAgent ? 'text-green-600' : 'text-desi-gold'
                  }`} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200 rounded-b-2xl">
            {/* Image Preview */}
            {imagePreview && (
              <div className="mb-3 relative inline-block">
                <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-lg" />
                <button
                  onClick={() => {
                    setImagePreview(null);
                    setSelectedImage(null);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="flex items-center space-x-2">
              {/* Image Upload Button - Only show when connected to agent */}
              {isConnectedToAgent && (
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 rounded-full hover:bg-gray-100 transition text-gray-600"
                    title="Upload product image"
                  >
                    <ImageIcon className="w-5 h-5" />
                  </button>
                </>
              )}
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isConnectedToAgent ? "Describe your issue..." : "Ask me anything..."}
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-full focus:outline-none focus:border-desi-gold transition"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() && !selectedImage}
                className={`p-2 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed ${
                  isConnectedToAgent 
                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                    : 'bg-desi-gold hover:bg-yellow-600 text-white'
                }`}
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              {isConnectedToAgent 
                ? '🟢 Connected • Agent will respond shortly' 
                : 'Villy AI • Instant responses'}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot;
