require('dotenv').config();
const connectDB = require('../config/db');
const Product = require('../models/Product');

const products = [
  {
    "name": "Premium California Almonds (Badam)",
    "description": "Rich, crunchy California almonds packed with nutrition. Perfect for daily snacking, cooking, and gifting. Grade A quality handpicked almonds.",
    "category": "dry-fruits",
    "price": 599,
    "originalPrice": 799,
    "image": "/Product_Images/almond.jpg",
    "images": ["/Product_Images/almond.jpg"],
    "weight": "500g",
    "stock": 100,
    "featured": true,
    "rating": 4.8,
    "reviews": [],
    "benefits": [
      "Rich in Vitamin E and antioxidants",
      "Supports heart health",
      "Helps in weight management",
      "Good for brain health",
      "Improves skin health"
    ],
    "ingredients": ["100% Natural California Almonds"]
  },
  {
    "name": "Premium Cashew Nuts (Kaju Whole)",
    "description": "Whole cashews from Kerala, creamy and delicious. Grade A quality, perfect for snacking, cooking, and making sweets.",
    "category": "dry-fruits",
    "price": 749,
    "originalPrice": 999,
    "image": "/Product_Images/cashew.jpg",
    "images": ["/Product_Images/cashew.jpg"],
    "weight": "500g",
    "stock": 80,
    "featured": true,
    "rating": 4.7,
    "reviews": [],
    "benefits": [
      "Rich in healthy fats",
      "Good source of protein",
      "Supports bone health",
      "Boosts immunity",
      "Improves heart health"
    ],
    "ingredients": ["100% Natural Cashew Nuts"]
  },
  {
    "name": "Premium Walnuts (Akhrot)",
    "description": "Fresh Kashmir walnuts, rich in omega-3 fatty acids. Perfect for brain health and overall wellness.",
    "category": "dry-fruits",
    "price": 699,
    "originalPrice": 899,
    "image": "/Product_Images/Walnuts.jpg",
    "images": ["/Product_Images/Walnuts.jpg"],
    "weight": "500g",
    "stock": 60,
    "featured": true,
    "rating": 4.6,
    "reviews": [],
    "benefits": [
      "Rich in Omega-3 fatty acids",
      "Excellent for brain health",
      "Supports heart health",
      "Anti-inflammatory properties",
      "Helps in weight management"
    ],
    "ingredients": ["100% Natural Kashmir Walnuts"]
  },
  {
    "name": "Premium Pistachios (Pista)",
    "description": "Iranian pistachios with natural flavor. Rich in antioxidants and perfect for healthy snacking.",
    "category": "dry-fruits",
    "price": 899,
    "originalPrice": 1199,
    "image": "/Product_Images/pistacho.jpg",
    "images": ["/Product_Images/pistacho.jpg"],
    "weight": "500g",
    "stock": 50,
    "featured": false,
    "rating": 4.7,
    "reviews": [],
    "benefits": [
      "High in antioxidants",
      "Good for eye health",
      "Aids in weight loss",
      "Promotes gut health",
      "Rich in protein"
    ],
    "ingredients": ["100% Natural Iranian Pistachios"]
  },
  {
    "name": "Premium Raisins (Kishmish)",
    "description": "Sweet and juicy Afghan raisins. Natural source of energy, perfect for all ages.",
    "category": "dry-fruits",
    "price": 299,
    "originalPrice": 399,
    "image": "/Product_Images/Raisins.jpg",
    "images": ["/Product_Images/Raisins.jpg"],
    "weight": "500g",
    "stock": 120,
    "featured": false,
    "rating": 4.5,
    "reviews": [],
    "benefits": [
      "Natural energy booster",
      "Rich in iron",
      "Aids digestion",
      "Good for bone health",
      "Improves skin health"
    ],
    "ingredients": ["100% Natural Afghan Raisins"]
  },
  {
    "name": "Mixed Dry Fruits Premium Pack",
    "description": "Perfect blend of almonds, cashews, raisins, and pistachios. Ideal for gifting and daily consumption.",
    "category": "dry-fruits",
    "price": 899,
    "originalPrice": 1199,
    "image": "/Product_Images/MixDry.jpg",
    "images": ["/Product_Images/MixDry.jpg"],
    "weight": "1kg",
    "stock": 50,
    "featured": true,
    "rating": 4.8,
    "reviews": [],
    "benefits": [
      "Complete nutrition package",
      "Perfect for gifting",
      "Mix of all essential nuts",
      "Great value for money",
      "Supports overall health"
    ],
    "ingredients": ["Almonds", "Cashews", "Raisins", "Pistachios"]
  },
  {
    "name": "Roasted Makhana",
    "description": "Crunchy roasted fox nuts with light salt. Perfect guilt-free snack, low in calories and high in nutrition.",
    "category": "makhana",
    "price": 249,
    "originalPrice": 349,
    "image": "/Product_Images/Roasted_makhana.jpg",
    "images": ["/Product_Images/Roasted_makhana.jpg"],
    "weight": "250g",
    "stock": 150,
    "featured": true,
    "rating": 4.6,
    "reviews": [],
    "benefits": [
      "Low in calories",
      "High in protein",
      "Rich in antioxidants",
      "Gluten-free snack",
      "Good for weight management"
    ],
    "ingredients": ["Fox Nuts (Makhana)", "Edible Oil", "Rock Salt"]
  },
  {
    "name": "Roasted Makhana - Peri Peri",
    "description": "Spicy peri peri flavored roasted fox nuts. Crunchy, tasty, and healthy snacking option.",
    "category": "makhana",
    "price": 299,
    "originalPrice": 399,
    "image": "/Product_Images/Peri_Peri_Makhana.jpg",
    "images": ["/Product_Images/Peri_Peri_Makhana.jpg"],
    "weight": "250g",
    "stock": 120,
    "featured": true,
    "rating": 4.7,
    "reviews": [],
    "benefits": [
      "Low calorie spicy snack",
      "High in protein and fiber",
      "Satisfies spicy cravings",
      "Heart-healthy",
      "Gluten-free"
    ],
    "ingredients": ["Fox Nuts (Makhana)", "Peri Peri Seasoning", "Edible Oil", "Salt", "Spices"]
  },
  {
    "name": "Traditional Bihari Thekua",
    "description": "Authentic Bihari thekua made with jaggery and wheat flour. Traditional recipe passed down through generations. Perfect for festivals and daily consumption.",
    "category": "thekua",
    "price": 199,
    "originalPrice": 249,
    "image": "/thekua.jpg",
    "images": ["/thekua.jpg"],
    "weight": "500g",
    "stock": 120,
    "featured": true,
    "rating": 4.9,
    "reviews": [],
    "benefits": [
      "Made with natural jaggery",
      "Traditional Bihari recipe",
      "No artificial flavors",
      "Perfect for festivals",
      "Long shelf life"
    ],
    "ingredients": ["Wheat Flour", "Jaggery", "Pure Ghee", "Cardamom", "Fennel Seeds"]
  },
  {
    "name": "Dry Fruits Thekua",
    "description": "Premium Bihari thekua enriched with mixed dry fruits including almonds, cashews, and raisins. Traditional recipe with a nutritious twist. Perfect for special occasions and gifting.",
    "category": "thekua",
    "price": 299,
    "originalPrice": 349,
    "image": "/thekua.jpg",
    "images": ["/thekua.jpg"],
    "weight": "500g",
    "stock": 85,
    "featured": true,
    "rating": 4.8,
    "reviews": [],
    "benefits": [
      "Rich in dry fruits and nuts",
      "Traditional Bihari recipe",
      "Made with pure jaggery",
      "Perfect for gifting",
      "High nutritional value",
      "Crunchy texture"
    ],
    "ingredients": ["Wheat Flour", "Jaggery", "Pure Ghee", "Almonds", "Cashews", "Raisins", "Cardamom", "Fennel Seeds"]
  },
  {
    "name": "Jaggery Thekua",
    "description": "Pure jaggery-sweetened Bihari thekua made with the finest quality gur. Rich, deep flavor with traditional taste. Completely natural with no added sugar or artificial sweeteners.",
    "category": "thekua",
    "price": 229,
    "originalPrice": 279,
    "image": "/thekua.jpg",
    "images": ["/thekua.jpg"],
    "weight": "500g",
    "stock": 95,
    "featured": false,
    "rating": 4.7,
    "reviews": [],
    "benefits": [
      "Made with pure jaggery",
      "No refined sugar",
      "Rich in iron and minerals",
      "Traditional authentic taste",
      "Natural sweetness",
      "Healthy alternative to sweets"
    ],
    "ingredients": ["Wheat Flour", "Pure Jaggery", "Pure Ghee", "Cardamom", "Fennel Seeds", "Coconut"]
  },
  {
    "name": "Pure Natural Makhana (Lotus Seeds)",
    "description": "Premium quality, handpicked lotus seeds (fox nuts) in their pure, unroasted form. Perfect for home roasting or cooking. Extra-large size, supreme grade phool makhana from Bihar's finest lotus ponds.",
    "category": "makhana",
    "price": 199,
    "originalPrice": 299,
    "image": "/Product_Images/Makhana.jpg",
    "images": ["/Product_Images/Makhana.jpg"],
    "weight": "250g",
    "stock": 200,
    "featured": true,
    "rating": 4.9,
    "reviews": [],
    "benefits": [
      "100% Natural and unprocessed",
      "High in protein and minerals",
      "Low in calories",
      "Perfect for diabetics",
      "Versatile - can be roasted or cooked"
    ],
    "ingredients": ["100% Pure Lotus Seeds (Phool Makhana)"]
  }
];

const seedProducts = async () => {
  try {
    await connectDB();
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️ Existing products deleted');

    // Insert new products
    const insertedProducts = await Product.insertMany(products);
    console.log(`✅ Successfully seeded ${insertedProducts.length} products`);

    // Show inserted products
    insertedProducts.forEach(product => {
      console.log(`   - ${product.name} (${product.category})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();