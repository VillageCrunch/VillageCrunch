import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

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
