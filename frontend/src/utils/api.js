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
  const { data } = await axios.post(`${API_URL}/products/${productId}/reviews`, review);
  return data;
};

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

// Export the axios instance as default
export default api;
