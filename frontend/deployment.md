# Deployment Guide - Premium Dry Fruits E-Commerce

## Complete Deployment Checklist

### Pre-Deployment Setup

#### 1. Razorpay Account Setup
```
1. Visit https://razorpay.com and create an account
2. Complete KYC verification
3. Navigate to Settings > API Keys
4. Generate Test Keys for development
5. Generate Live Keys for production (after testing)
6. Copy Key ID and Key Secret
```

#### 2. MongoDB Atlas Setup
```
1. Visit https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Configure network access (allow from anywhere: 0.0.0.0/0)
4. Create database user with password
5. Get connection string
6. Replace <password> with your actual password
```

---

## Backend Deployment

### Option 1: Railway.app (Recommended)

1. **Install Railway CLI:**
```bash
npm install -g @railway/cli
```

2. **Login to Railway:**
```bash
railway login
```

3. **Initialize Project:**
```bash
cd backend
railway init
```

4. **Set Environment Variables:**
```bash
railway variables set PORT=5000
railway variables set NODE_ENV=production
railway variables set MONGODB_URI="your_mongodb_atlas_connection_string"
railway variables set JWT_SECRET="your_strong_jwt_secret_at_least_32_characters"
railway variables set RAZORPAY_KEY_ID="your_razorpay_key_id"
railway variables set RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
railway variables set FRONTEND_URL="https://your-frontend-url.vercel.app"
```

5. **Deploy:**
```bash
railway up
```

6. **Get your backend URL:**
```bash
railway domain
```

### Option 2: Render.com

1. Create account on Render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name:** premium-dryfruits-backend
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

5. Add Environment Variables in Render dashboard:
```
PORT=5000
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_strong_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
FRONTEND_URL=https://your-frontend-url.vercel.app
```

6. Deploy and copy your backend URL

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Login to Vercel:**
```bash
vercel login
```

3. **Deploy from frontend directory:**
```bash
cd frontend
vercel
```

4. **Set Environment Variable:**
   - Go to Vercel dashboard
   - Select your project
   - Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend-url.railway.app/api`

5. **Redeploy with environment variable:**
```bash
vercel --prod
```

### Option 2: Netlify

1. **Install Netlify CLI:**
```bash
npm install -g netlify-cli
```

2. **Build the project:**
```bash
cd frontend
npm run build
```

3. **Deploy:**
```bash
netlify deploy --prod
```

4. **Configure:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Environment variable: `VITE_API_URL` = your backend URL

5. **Add redirects for React Router:**
   Create `frontend/public/_redirects` file:
```
/* /index.html 200
```

---

## Database Setup & Seeding

### Create Sample Products

Use MongoDB Compass or MongoDB Atlas Web UI to insert sample products:

```javascript
// Sample products to add
[
  {
    "name": "Premium California Almonds",
    "description": "Rich, crunchy California almonds packed with nutrition. Perfect for daily snacking and cooking.",
    "category": "dry-fruits",
    "price": 599,
    "originalPrice": 799,
    "image": "https://images.unsplash.com/photo-1508736793122-f516e3ba5569?w=600&h=600&fit=crop",
    "images": [],
    "weight": "500g",
    "stock": 100,
    "featured": true,
    "rating": 4.8,
    "reviews": [],
    "benefits": [
      "Rich in Vitamin E and antioxidants",
      "Supports heart health",
      "Helps in weight management",
      "Good for brain health"
    ],
    "ingredients": ["100% Natural California Almonds"]
  },
  {
    "name": "Premium Cashew Nuts (Kaju)",
    "description": "Whole cashews from Kerala, creamy and delicious. Grade A quality.",
    "category": "dry-fruits",
    "price": 749,
    "originalPrice": 999,
    "image": "https://images.unsplash.com/photo-1585216663311-a4f78e6c4e9e?w=600&h=600&fit=crop",
    "images": [],
    "weight": "500g",
    "stock": 80,
    "featured": true,
    "rating": 4.7,
    "reviews": [],
    "benefits": [
      "Rich in healthy fats",
      "Good source of protein",
      "Supports bone health",
      "Boosts immunity"
    ],
    "ingredients": ["100% Natural Cashew Nuts"]
  },
  {
    "name": "Roasted Makhana - Peri Peri",
    "description": "Crunchy roasted fox nuts with spicy peri peri seasoning. Perfect guilt-free snack.",
    "category": "makhana",
    "price": 299,
    "originalPrice": 399,
    "image": "https://images.unsplash.com/photo-1599909533060-28668b945d23?w=600&h=600&fit=crop",
    "images": [],
    "weight": "250g",
    "stock": 150,
    "featured": true,
    "rating": 4.6,
    "reviews": [],
    "benefits": [
      "Low in calories",
      "High in protein",
      "Rich in antioxidants",
      "Gluten-free snack"
    ],
    "ingredients": ["Fox Nuts (Makhana)", "Peri Peri Seasoning", "Edible Oil", "Salt"]
  },
  {
    "name": "Traditional Bihari Thekua",
    "description": "Authentic Bihari thekua made with jaggery and wheat flour. Traditional recipe from Bihar.",
    "category": "thekua",
    "price": 199,
    "originalPrice": 249,
    "image": "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=600&h=600&fit=crop",
    "images": [],
    "weight": "500g",
    "stock": 120,
    "featured": true,
    "rating": 4.9,
    "reviews": [],
    "benefits": [
      "Made with natural jaggery",
      "Traditional recipe",
      "No artificial flavors",
      "Perfect for festivals"
    ],
    "ingredients": ["Wheat Flour", "Jaggery", "Ghee", "Cardamom", "Fennel Seeds"]
  }
]
```

### Create Admin User

Use MongoDB Compass to create an admin user (password will be automatically hashed when you register through the app):

```javascript
{
  "name": "Admin User",
  "email": "admin@desidelights.com",
  "password": "hashedPasswordHere",
  "phone": "+919876543210",
  "role": "admin",
  "addresses": []
}
```

---

## Post-Deployment Testing

### 1. Test Backend API
```bash
curl https://your-backend-url.railway.app/api/health
# Should return: {"status":"OK","message":"Server is running"}
```

### 2. Test Frontend
- Visit your frontend URL
- Browse products
- Add items to cart
- Test user registration
- Test login functionality

### 3. Test Payment (Test Mode)
Use Razorpay test cards:
```
Card Number: 4111 1111 1111 1111
CVV: 123
Expiry: Any future date
```

---

## Production Checklist

- [ ] MongoDB Atlas cluster created and secured
- [ ] Razorpay LIVE keys obtained (after testing)
- [ ] Backend deployed and environment variables set
- [ ] Frontend deployed with correct API URL
- [ ] Sample products added to database
- [ ] Admin user created
- [ ] SSL certificates active (automatic on Vercel/Railway)
- [ ] Payment flow tested in test mode
- [ ] All pages loading correctly
- [ ] Mobile responsiveness checked
- [ ] Error handling tested
- [ ] Order email notifications configured (optional)

---

## Monitoring & Maintenance

### Railway/Render Monitoring
- Check deployment logs regularly
- Monitor database usage in MongoDB Atlas
- Track API response times

### Performance Optimization
```bash
# Frontend: Analyze bundle size
cd frontend
npm run build
```

### Backup Strategy
- MongoDB Atlas provides automatic backups
- Export important data periodically
- Keep local backup of product images

---

## Troubleshooting

### Backend Issues

**Error: Cannot connect to MongoDB**
```
Solution: Check MONGODB_URI format and network access settings in MongoDB Atlas
```

**Error: Razorpay payment fails**
```
Solution: Verify Razorpay keys are correct and website is added to Razorpay dashboard
```

### Frontend Issues

**Error: API calls failing**
```
Solution: Check VITE_API_URL is correct and includes /api suffix
```

**Error: Blank page after deployment**
```
Solution: Ensure _redirects file exists in build or configure redirects in hosting platform
```

---

## Security Best Practices

1. **Never commit .env files**
2. **Use strong JWT secrets (minimum 32 characters)**
3. **Enable MongoDB IP whitelist**
4. **Use HTTPS only in production**
5. **Regularly update dependencies**
6. **Implement rate limiting (already configured)**
7. **Validate all user inputs**
8. **Use Razorpay webhooks for payment confirmation**

---

## Support & Updates

For deployment assistance:
- Check hosting platform documentation
- MongoDB Atlas support: support.mongodb.com
- Razorpay support: razorpay.com/support

## Estimated Costs

**Free Tier Options:**
- MongoDB Atlas: Free (512MB storage)
- Railway: $5/month (after free tier)
- Vercel: Free for personal projects
- Render: Free tier available

**Production Costs (Approx):**
- Hosting: $10-20/month
- MongoDB Atlas: $0-9/month (shared cluster)
- Razorpay: 2% transaction fee
- Domain (optional): $10-15/year

---

## Going Live

1. Switch Razorpay to LIVE mode
2. Update RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET
3. Test complete order flow
4. Announce on social media
5. Monitor orders and customer feedback

---

**Congratulations! Your e-commerce store is now live! 🎉**