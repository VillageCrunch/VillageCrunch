import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Products
export const getProducts = async (params = {}) => {
  const { data } = await axios.get(`${API_URL}/products`, { params });
  return data;
};

export const getProduct = async (id) => {
  const { data } = await axios.get(`${API_URL}/products/${id}`);
  return data;
};

export const createProductReview = async (productId, review) => {
  const token = localStorage.getItem('token');
  const { data } = await axios.post(`${API_URL}/products/${productId}/reviews`, review, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

// Alias for createProductReview
export const createReview = createProductReview;

// ✅ Orders (User)
export const createOrder = async (orderData) => {
  const { data } = await axios.post(`${API_URL}/orders`, orderData);
  return data;
};

export const getMyOrders = async () => {
  const token = localStorage.getItem('token'); // or wherever you store the JWT
  const { data } = await axios.get(`${API_URL}/orders/myorders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

// Alias for getMyOrders
export const getUserOrders = getMyOrders;

export const getOrder = async (id) => {
  const token = localStorage.getItem('token');
  const { data } = await axios.get(`${API_URL}/orders/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};


export const updateOrderToPaid = async (orderId, paymentDetails) => {
  const { data } = await axios.put(`${API_URL}/orders/${orderId}/pay`, paymentDetails, {
    withCredentials: true,
  });
  return data;
};

// ✅ Admin APIs
export const getAllOrders = async () => {
  const { data } = await axios.get(`${API_URL}/orders`, { withCredentials: true });
  return data;
};

export const updateOrderStatus = async (orderId, payload) => {
  const { data } = await axios.put(`${API_URL}/admin/orders/${orderId}/status`, payload, {
    withCredentials: true,
  });
  return data;
};

export const getAdminOrderById = async (orderId) => {
  const { data } = await axios.get(`${API_URL}/admin/orders/${orderId}`, { withCredentials: true });
  return data;
};

export const getOrderStats = async () => {
  const { data } = await axios.get(`${API_URL}/admin/orders/stats`, { withCredentials: true });
  return data;
};

// ✅ Payments
export const createPaymentOrder = async (amount) => {
  const { data } = await axios.post(`${API_URL}/payment/create-order`, { amount });
  return data;
};

export const verifyPayment = async (paymentData) => {
  const { data } = await axios.post(`${API_URL}/payment/verify`, paymentData);
  return data;
};

export const getRazorpayKey = async () => {
  const { data } = await axios.get(`${API_URL}/payment/key`);
  return data;
};

// Forgot Password
export const forgotPassword = async (email) => {
  const { data } = await axios.post(`${API_URL}/auth/forgot-password`, { email });
  return data;
};

export const resetPassword = async (resetToken, password) => {
  const { data } = await axios.put(`${API_URL}/auth/reset-password/${resetToken}`, { password });
  return data;
};

// ✅ Contact APIs
export const submitContactForm = async (formData) => {
  const { data } = await api.post('/contact', formData);
  return data;
};

export const getContacts = async () => {
  const token = localStorage.getItem('token');
  const { data } = await axios.get(`${API_URL}/contact`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const updateContactStatus = async (contactId, status) => {
  const token = localStorage.getItem('token');
  const { data } = await axios.put(`${API_URL}/contact/${contactId}/status`, 
    { status }, 
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

// ✅ Admin Product Management APIs
export const getAllProducts = async () => {
  const token = localStorage.getItem('token');
  const { data } = await axios.get(`${API_URL}/products`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const addProduct = async (productData) => {
  const token = localStorage.getItem('token');
  const { data } = await axios.post(`${API_URL}/products`, productData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const updateProduct = async (productId, productData) => {
  const token = localStorage.getItem('token');
  const { data } = await axios.put(`${API_URL}/products/${productId}`, productData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const deleteProduct = async (productId) => {
  const token = localStorage.getItem('token');
  const { data } = await axios.delete(`${API_URL}/products/${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

// ✅ Promocode Management APIs
export const getPromocodes = async (params = {}) => {
  const token = localStorage.getItem('token');
  const { data } = await axios.get(`${API_URL}/promocodes`, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });
  return data;
};

export const getPromocode = async (id) => {
  const token = localStorage.getItem('token');
  const { data } = await axios.get(`${API_URL}/promocodes/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const createPromocode = async (promocodeData) => {
  const token = localStorage.getItem('token');
  const { data } = await axios.post(`${API_URL}/promocodes`, promocodeData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const updatePromocode = async (id, promocodeData) => {
  const token = localStorage.getItem('token');
  const { data } = await axios.put(`${API_URL}/promocodes/${id}`, promocodeData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const deletePromocode = async (id) => {
  const token = localStorage.getItem('token');
  const { data } = await axios.delete(`${API_URL}/promocodes/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const validatePromocode = async (code, orderValue, products = [], categories = [], userId = null) => {
  const { data } = await axios.post(`${API_URL}/promocodes/validate`, {
    code,
    orderValue,
    products,
    categories,
    userId,
  });
  return data;
};

export const getPromocodeStats = async () => {
  const token = localStorage.getItem('token');
  const { data } = await axios.get(`${API_URL}/promocodes/stats/overview`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

// ✅ Campaign Management APIs
export const getCampaigns = async (params = {}) => {
  const token = localStorage.getItem('token');
  const { data } = await axios.get(`${API_URL}/campaigns`, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });
  return data;
};

export const getCampaign = async (id) => {
  const token = localStorage.getItem('token');
  const { data } = await axios.get(`${API_URL}/campaigns/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const createCampaign = async (campaignData) => {
  const token = localStorage.getItem('token');
  const { data } = await axios.post(`${API_URL}/campaigns`, campaignData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const updateCampaign = async (id, campaignData) => {
  const token = localStorage.getItem('token');
  const { data } = await axios.put(`${API_URL}/campaigns/${id}`, campaignData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const deleteCampaign = async (id) => {
  const token = localStorage.getItem('token');
  const { data } = await axios.delete(`${API_URL}/campaigns/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const updateCampaignStatus = async (id, status) => {
  const token = localStorage.getItem('token');
  const { data } = await axios.put(`${API_URL}/campaigns/${id}/status`, 
    { status }, 
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const getCampaignAnalytics = async (id) => {
  const token = localStorage.getItem('token');
  const { data } = await axios.get(`${API_URL}/campaigns/${id}/analytics`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const getCampaignStats = async () => {
  const token = localStorage.getItem('token');
  const { data } = await axios.get(`${API_URL}/campaigns/stats/overview`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

// ✅ Settings Management APIs
export const getSettings = async () => {
  const { data } = await axios.get(`${API_URL}/settings`);
  return data;
};

export const updateSettings = async (settingsData) => {
  const token = localStorage.getItem('token');
  const { data } = await axios.put(`${API_URL}/settings`, settingsData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const getPricingSettings = async () => {
  const { data } = await axios.get(`${API_URL}/settings/pricing`);
  return data;
};

export const updatePricingSettings = async (pricingData) => {
  const token = localStorage.getItem('token');
  const { data } = await axios.put(`${API_URL}/settings/pricing`, pricingData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const calculateOrderTotal = async (items, shippingMethod = 'standard', promocode = null) => {
  const { data } = await axios.post(`${API_URL}/settings/calculate-order-total`, {
    items,
    shippingMethod,
    promocode,
  });
  return data;
};

export const getShippingOptions = async (orderValue) => {
  const { data } = await axios.get(`${API_URL}/settings/shipping-options`, {
    params: { orderValue },
  });
  return data;
};

// ✅ Cart Management
export const getCart = async () => {
  const { data } = await api.get('/cart');
  return data;
};

export const addToCart = async (productId, quantity = 1) => {
  const { data } = await api.post('/cart/add', {
    productId,
    quantity,
  });
  return data;
};

export const updateCartItem = async (productId, quantity) => {
  const { data } = await api.put('/cart/update', {
    productId,
    quantity,
  });
  return data;
};

export const removeFromCart = async (productId) => {
  const { data } = await api.delete(`/cart/remove/${productId}`);
  return data;
};

export const clearCart = async () => {
  const { data } = await api.delete('/cart/clear');
  return data;
};

export const syncCart = async (localCart) => {
  const { data } = await api.post('/cart/sync', {
    localCart,
  });
  return data;
};

// ✅ Image Upload APIs
export const uploadProductImage = async (imageFile) => {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('image', imageFile);
  
  const { data } = await axios.post(`${API_URL}/products/upload-image`, formData, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    },
  });
  return data;
};

export const uploadProductImages = async (imageFiles) => {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  
  // Append multiple files
  imageFiles.forEach(file => {
    formData.append('images', file);
  });
  
  const { data } = await axios.post(`${API_URL}/products/upload-images`, formData, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    },
  });
  return data;
};

// Export the axios instance as default
export default api;
