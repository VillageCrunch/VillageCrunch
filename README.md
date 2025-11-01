# Premium Dry Fruits E-Commerce Store

A full-stack e-commerce platform for selling premium Indian dry fruits, makhana, and traditional Bihari thekua. Built with React.js, Node.js, Express, MongoDB, and Razorpay payment integration.

## Features

### Frontend
- 🎨 Rustic/Desi premium design with Tailwind CSS
- 📱 Fully responsive design for all devices
- 🛒 Shopping cart with persistent storage
- 🔐 User authentication (Login/Register)
- 📦 Product browsing with categories and search
- 💳 Secure checkout with Razorpay integration
- 📋 Order history and tracking
- ⭐ Product reviews and ratings
- 🎯 Featured products showcase

### Backend
- 🚀 RESTful API with Express.js
- 🗄️ MongoDB database with Mongoose
- 🔒 JWT authentication
- 💰 Razorpay payment integration
- 📧 Order management system
- 🛡️ Security with Helmet and rate limiting
- ✅ Input validation

## Tech Stack

**Frontend:**
- React.js 18
- React Router DOM
- Tailwind CSS
- Axios
- Lucide React (Icons)
- React Hot Toast

**Backend:**
- Node.js
- Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT)
- Bcrypt.js
- Razorpay SDK
- Helmet (Security)
- Express Rate Limit

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Razorpay account (for payment integration)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file and add the following:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/premium-dryfruits
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
FRONTEND_URL=http://localhost:5173
```

4. Start the backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## Database Seeding

To populate the database with sample products, you can use MongoDB Compass or create a seed script. Here's a sample product structure:

```javascript
{
  "name": "Premium Almonds",
  "description": "California almonds, rich in nutrients and perfect for daily consumption",
  "category": "dry-fruits",
  "price": 599,
  "originalPrice": 799,
  "image": "https://images.unsplash.com/photo-1508736793122-f516e3ba5569",
  "images": [],
  "weight": "500g",
  "stock": 50,
  "featured": true,
  "rating": 4.5,
  "benefits": [
    "Rich in Vitamin E",
    "Good for heart health",
    "Helps in weight management"
  ],
  "ingredients": ["100% Natural Almonds"]
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)
- `PUT /api/auth/profile` - Update user profile (Protected)

### Products
- `GET /api/products` - Get all products (with optional filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `POST /api/products/:id/reviews` - Add product review (Protected)

### Orders
- `POST /api/orders` - Create new order (Protected)
- `GET /api/orders/myorders` - Get user orders (Protected)
- `GET /api/orders/:id` - Get single order (Protected)
- `PUT /api/orders/:id/pay` - Update order to paid (Protected)
- `GET /api/orders` - Get all orders (Admin)
- `PUT /api/orders/:id/status` - Update order status (Admin)

### Payment
- `POST /api/payment/create-order` - Create Razorpay order (Protected)
- `POST /api/payment/verify` - Verify payment signature (Protected)
- `GET /api/payment/key` - Get Razorpay key

## Project Structure

```
premium-dryfruits-store/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── razorpay.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   └── payment.js
│   ├── middleware/
│   │   └── auth.js
│   ├── .env
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ProductCard.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Orders.jsx
│   │   │   └── About.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── postcss.config.js
└── README.md
```

## Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
FRONTEND_URL=http://localhost:5173
```

## Razorpay Integration Setup

1. Create a Razorpay account at https://razorpay.com
2. Get your API keys from the dashboard
3. Test mode keys for development
4. Production keys for live deployment
5. Add keys to backend `.env` file

## Deployment

### Backend Deployment (Railway/Render/Heroku)

1. Set environment variables in your hosting platform
2. Update `FRONTEND_URL` to your production frontend URL
3. Update `MONGODB_URI` to production database
4. Deploy backend code

### Frontend Deployment (Vercel/Netlify)

1. Build the frontend:
```bash
npm run build
```

2. Deploy the `dist` folder
3. Set environment variable `VITE_API_URL` to your backend URL
4. Configure redirects for React Router

## Security Features

- Password hashing with bcrypt
- JWT authentication
- HTTP security headers with Helmet
- Rate limiting to prevent abuse
- Input validation
- CORS configuration
- Secure payment handling

## Features to Add (Optional Enhancements)

- [ ] Email notifications for orders
- [ ] Admin dashboard
- [ ] Wishlist functionality
- [ ] Product comparison
- [ ] Advanced search and filters
- [ ] Coupon/discount system
- [ ] Inventory management
- [ ] Sales analytics
- [ ] Social media login
- [ ] Product recommendations

## Sample Products to Add

### Dry Fruits Category
1. Premium Almonds (Badam)
2. Cashew Nuts (Kaju)
3. Walnuts (Akhrot)
4. Pistachios (Pista)
5. Raisins (Kishmish)
6. Dates (Khajoor)
7. Dried Figs (Anjeer)
8. Mixed Dry Fruits

### Makhana Category
1. Plain Roasted Makhana
2. Peri Peri Makhana
3. Masala Makhana
4. Mint Makhana
5. Cheese & Herbs Makhana

### Thekua Category
1. Traditional Bihari Thekua ✅
2. Dry Fruits Thekua ✅
3. Jaggery Thekua ✅

### Combo Packs
1. Dry Fruits Gift Box
2. Makhana Variety Pack
3. Festival Special Combo
4. Health & Wellness Pack

## Testing

### Test User Credentials (Create after backend is running)
```
Email: test@example.com
Password: test123
```

### Test Razorpay Card (Test Mode)
```
Card Number: 4111 1111 1111 1111
CVV: Any 3 digits
Expiry: Any future date
```

## Support

For issues and questions:
- Email: support@desidelights.com
- Phone: +91 98765 43210

## License

This project is licensed under the MIT License.

## Credits

- Images from Unsplash
- Icons from Lucide React
- Design inspired by traditional Indian aesthetics

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

Made with ❤️ in Bihar, India