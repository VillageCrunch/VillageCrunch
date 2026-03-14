require('dotenv').config();
const connectDB = require('../config/db');
const Product = require('../models/Product');

const masalaProducts = [
  {
    "name": "Premium Coriander Powder (Dhaniya Powder)",
    "description": "Fresh ground coriander powder from handpicked coriander seeds. Aromatic and flavorful, perfect for Indian cooking. Premium quality with rich aroma and authentic taste.",
    "category": "masala",
    "price": 95,
    "originalPrice": 120,
    "image": "/Product_Images/coriander-powder.jpg",
    "images": ["/Product_Images/coriander-powder.jpg"],
    "weight": "500g",
    "stock": 50,
    "featured": true,
    "rating": 4.6,
    "reviews": [],
    "benefits": [
      "Rich in antioxidants and dietary fiber",
      "Supports digestive health",
      "Natural source of iron and magnesium",
      "Enhances flavor in cooking",
      "Freshly ground for maximum potency"
    ],
    "ingredients": ["100% Pure Coriander Seeds"]
  },
  {
    "name": "Premium Turmeric Powder (Haldi)",
    "description": "Pure turmeric powder made from organically grown turmeric roots. High curcumin content, vibrant color, and exceptional purity. Perfect for cooking and wellness.",
    "category": "masala",
    "price": 110,
    "originalPrice": 140,
    "image": "/Product_Images/turmeric-powder.jpg",
    "images": ["/Product_Images/turmeric-powder.jpg"],
    "weight": "500g",
    "stock": 60,
    "featured": true,
    "rating": 4.8,
    "reviews": [],
    "benefits": [
      "High curcumin content for anti-inflammatory properties",
      "Natural antiseptic and healing properties",
      "Boosts immunity and overall health",
      "Rich, vibrant color for cooking",
      "Premium quality, lab-tested for purity"
    ],
    "ingredients": ["100% Pure Turmeric Root Powder"]
  },
  {
    "name": "Premium Jeera Powder (Cumin Powder)",
    "description": "Aromatic cumin powder made from premium quality cumin seeds. Freshly ground to preserve the essential oils and authentic flavor. Essential for Indian cuisine.",
    "category": "masala",
    "price": 245,
    "originalPrice": 295,
    "image": "/Product_Images/jeera-powder.jpg",
    "images": ["/Product_Images/jeera-powder.jpg"],
    "weight": "500g",
    "stock": 40,
    "featured": true,
    "rating": 4.7,
    "reviews": [],
    "benefits": [
      "Rich in iron and aids digestion",
      "Natural source of antioxidants",
      "Supports weight management",
      "Enhances metabolism",
      "Premium quality with intense aroma"
    ],
    "ingredients": ["100% Pure Cumin Seeds"]
  },
  {
    "name": "Premium Red Chilli Powder (Lal Mirch Powder)",
    "description": "Vibrant red chilli powder made from specially selected red chilies. Perfect balance of heat and flavor. Premium quality for authentic Indian cooking.",
    "category": "masala",
    "price": 135,
    "originalPrice": 165,
    "image": "/Product_Images/red-chilli-powder.jpg",
    "images": ["/Product_Images/red-chilli-powder.jpg"],
    "weight": "500g",
    "stock": 55,
    "featured": true,
    "rating": 4.5,
    "reviews": [],
    "benefits": [
      "Rich in vitamin C and capsaicin",
      "Boosts metabolism naturally",
      "Contains antioxidants and minerals",
      "Perfect heat level for Indian cuisine",
      "Premium quality, vibrant color"
    ],
    "ingredients": ["100% Pure Red Chilies"]
  }
];

const seedMasalaProducts = async () => {
  try {
    await connectDB();
    
    console.log('Checking existing masala products...');
    
    // Check if masala products already exist
    const existingMasala = await Product.find({ category: 'masala' });
    
    if (existingMasala.length > 0) {
      console.log(`Found ${existingMasala.length} existing masala products. Skipping seed.`);
      return;
    }
    
    console.log('Adding masala products to database...');
    
    const createdProducts = await Product.insertMany(masalaProducts);
    
    console.log(`✅ Successfully added ${createdProducts.length} masala products:`);
    createdProducts.forEach(product => {
      console.log(`- ${product.name}: ₹${product.price} (500g)`);
    });
    
    console.log('\nMasala section created successfully!');
    console.log('Competitive pricing analysis:');
    console.log('- Coriander Powder: ₹95 (Market range: ₹80-120)');
    console.log('- Turmeric Powder: ₹110 (Market range: ₹90-140)');
    console.log('- Jeera Powder: ₹245 (Market range: ₹200-300)');
    console.log('- Red Chilli Powder: ₹135 (Market range: ₹120-180)');
    
  } catch (error) {
    console.error('Error seeding masala products:', error);
  } finally {
    process.exit();
  }
};

seedMasalaProducts();