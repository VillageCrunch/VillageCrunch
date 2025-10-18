import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrder } from '../utils/api';
import toast from 'react-hot-toast';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !localStorage.getItem('token')) {
      toast.error('Please login to view your order');
      navigate('/login');
      return;
    }

    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const data = await getOrder(id);
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Unable to fetch order details');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-desi-gold"></div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-desi-brown mb-6">Order Details</h1>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Total Price:</strong> ₹{order.totalPrice}</p>
              <p><strong>Payment:</strong> {order.isPaid ? 'Paid' : 'Pending'}</p>
              <p><strong>Delivery:</strong> {order.isDelivered ? 'Delivered' : 'In Progress'}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 text-desi-brown">Shipping Address</h3>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-4 text-desi-brown">Ordered Items</h2>
          <div className="divide-y divide-gray-200">
            {order.orderItems.map((item, index) => (
              <div key={index} className="flex items-center py-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-lg object-cover border"
                />
                <div className="ml-4 flex-1">
                  <h4 className="font-semibold text-gray-900">{item.name}</h4>
                  <p className="text-gray-600 text-sm">
                    {item.qty} × ₹{item.price} = ₹{item.qty * item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Payment & Delivery info */}
          <div className="mt-8 grid sm:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-xl border">
              <h3 className="text-lg font-semibold text-desi-brown mb-2">Payment Information</h3>
              <p>Method: {order.paymentMethod || 'Online / COD'}</p>
              <p>Status: {order.isPaid ? 'Paid ✅' : 'Not Paid ❌'}</p>
              {order.paidAt && <p>Date: {new Date(order.paidAt).toLocaleString()}</p>}
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border">
              <h3 className="text-lg font-semibold text-desi-brown mb-2">Delivery Information</h3>
              <p>Status: {order.isDelivered ? 'Delivered ✅' : 'Not Delivered ❌'}</p>
              {order.deliveredAt && <p>Date: {new Date(order.deliveredAt).toLocaleString()}</p>}
            </div>
          </div>

          {/* If unpaid, allow user to pay now */}
          {!order.isPaid && (
            <div className="mt-8 text-center">
              <button
                onClick={() => navigate(`/pay/${order._id}`)}
                className="btn-primary px-8 py-3 text-lg font-semibold"
              >
                Pay Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
