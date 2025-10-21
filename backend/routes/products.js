const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

// ✅ Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../frontend/public/Product_Images');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// @route   POST /api/products/upload-image
// @desc    Upload product image
// @access  Private/Admin
router.post('/upload-image', protect, admin, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Return the relative URL path for the uploaded image
    const imageUrl = `/Product_Images/${req.file.filename}`;
    
    res.json({
      message: 'Image uploaded successfully',
      imageUrl: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ message: 'Failed to upload image' });
  }
});

// @route   POST /api/products/upload-images
// @desc    Upload multiple product images
// @access  Private/Admin
router.post('/upload-images', protect, admin, upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No image files provided' });
    }

    // Return the relative URL paths for all uploaded images
    const imageUrls = req.files.map(file => `/Product_Images/${file.filename}`);
    
    res.json({
      message: `${req.files.length} images uploaded successfully`,
      imageUrls: imageUrls,
      filenames: req.files.map(file => file.filename)
    });
  } catch (error) {
    console.error('Multiple images upload error:', error);
    res.status(500).json({ message: 'Failed to upload images' });
  }
});

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, featured, search } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('reviews.user', 'name');
    
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/products
// @desc    Create a product
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    // Get the existing product to check for image changes
    const existingProduct = await Product.findById(req.params.id);
    
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Helper function to delete old image file
    const deleteOldImageFile = (imagePath) => {
      if (!imagePath) return;
      
      let filePath;
      // Handle different image path formats
      if (imagePath.startsWith('/Product_Images/')) {
        filePath = path.join(__dirname, '../../frontend/public', imagePath);
      } else if (imagePath.includes('/Product_Images/')) {
        const filename = imagePath.split('/Product_Images/').pop();
        filePath = path.join(__dirname, '../../frontend/public/Product_Images', filename);
      } else {
        filePath = path.join(__dirname, '../../frontend/public/Product_Images', imagePath);
      }

      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
          console.log(`Deleted old image file: ${filePath}`);
        } catch (err) {
          console.error(`Error deleting old image file ${filePath}:`, err);
        }
      }
    };

    // Check if main image is being changed and delete old one
    if (req.body.image && existingProduct.image && req.body.image !== existingProduct.image) {
      deleteOldImageFile(existingProduct.image);
    }

    // Check if additional images are being changed and delete old ones
    if (req.body.images && existingProduct.images) {
      // Find images that are being removed
      const imagesToDelete = existingProduct.images.filter(oldImage => 
        !req.body.images.includes(oldImage)
      );
      
      // Delete the removed images
      imagesToDelete.forEach(imagePath => {
        deleteOldImageFile(imagePath);
      });
    }

    // Update the product
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Helper function to delete image file
    const deleteImageFile = (imagePath) => {
      if (!imagePath) return;
      
      let filePath;
      // Handle different image path formats
      if (imagePath.startsWith('/Product_Images/')) {
        // Relative path from public folder
        filePath = path.join(__dirname, '../../frontend/public', imagePath);
      } else if (imagePath.includes('/Product_Images/')) {
        // Full URL or path containing Product_Images
        const filename = imagePath.split('/Product_Images/').pop();
        filePath = path.join(__dirname, '../../frontend/public/Product_Images', filename);
      } else {
        // Assume it's just a filename
        filePath = path.join(__dirname, '../../frontend/public/Product_Images', imagePath);
      }

      // Check if file exists and delete it
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
          console.log(`Deleted image file: ${filePath}`);
        } catch (err) {
          console.error(`Error deleting image file ${filePath}:`, err);
        }
      }
    };

    // Delete the main product image
    if (product.image) {
      deleteImageFile(product.image);
    }

    // Delete additional images if they exist
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach(imagePath => {
        deleteImageFile(imagePath);
      });
    }

    // Delete the product from database
    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: 'Product and associated images removed successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/products/:id/reviews
// @desc    Create or update product review
// @access  Private
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user has purchased this product and it's delivered
    const Order = require('../models/Order');
    const userOrders = await Order.find({ 
      user: req.user._id, 
      status: 'delivered',
      'items.product': req.params.id 
    });

    if (userOrders.length === 0) {
      return res.status(400).json({ 
        message: 'You can only review products you have purchased and received' 
      });
    }

    // Check if user already reviewed this product
    const existingReviewIndex = product.reviews.findIndex(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (existingReviewIndex !== -1) {
      // Update existing review
      product.reviews[existingReviewIndex].rating = Number(rating);
      if (comment) {
        product.reviews[existingReviewIndex].comment = comment;
      }
      product.reviews[existingReviewIndex].updatedAt = new Date();
    } else {
      // Create new review
      const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment: comment || '',
      };
      product.reviews.push(review);
    }

    // Update product rating
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    
    const message = existingReviewIndex !== -1 ? 'Review updated successfully' : 'Review added successfully';
    res.status(201).json({ message });
  } catch (error) {
    console.error('Error adding/updating review:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/products/cleanup/orphaned-images
// @desc    Clean up orphaned image files (images not referenced by any product)
// @access  Private/Admin
router.delete('/cleanup/orphaned-images', protect, admin, async (req, res) => {
  try {
    const imageDirPath = path.join(__dirname, '../../frontend/public/Product_Images');
    
    // Get all products and their image references
    const products = await Product.find({}, 'image images');
    const referencedImages = new Set();
    
    // Collect all referenced image filenames
    products.forEach(product => {
      if (product.image) {
        const filename = product.image.split('/').pop();
        referencedImages.add(filename);
      }
      if (product.images && Array.isArray(product.images)) {
        product.images.forEach(imagePath => {
          const filename = imagePath.split('/').pop();
          referencedImages.add(filename);
        });
      }
    });

    // Get all files in the images directory
    let deletedFiles = [];
    let totalFiles = 0;
    
    if (fs.existsSync(imageDirPath)) {
      const files = fs.readdirSync(imageDirPath);
      totalFiles = files.length;
      
      files.forEach(filename => {
        // Skip non-image files
        const ext = path.extname(filename).toLowerCase();
        if (!['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) {
          return;
        }
        
        // If image is not referenced by any product, delete it
        if (!referencedImages.has(filename)) {
          const filePath = path.join(imageDirPath, filename);
          try {
            fs.unlinkSync(filePath);
            deletedFiles.push(filename);
            console.log(`Deleted orphaned image: ${filename}`);
          } catch (err) {
            console.error(`Error deleting orphaned image ${filename}:`, err);
          }
        }
      });
    }

    res.json({
      message: 'Cleanup completed',
      totalImagesChecked: totalFiles,
      orphanedImagesDeleted: deletedFiles.length,
      deletedFiles: deletedFiles
    });
  } catch (error) {
    console.error('Error during cleanup:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;