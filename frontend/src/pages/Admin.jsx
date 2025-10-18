import { useState, useEffect } from 'react';
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  Filter,
  ChevronDown,
  Edit,
  MapPin,
  Phone,
  User,
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const Admin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // ✅ Status configurations
  const statusConfig = {
    pending: {
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      label: 'Pending',
    },
    confirmed: {
      icon: CheckCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      label: 'Confirmed',
    },
    processing: {
      icon: Package,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      label: 'Processing',
    },
    shipped: {
      icon: Truck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      label: 'Shipped',
    },
    delivered: {
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      label: 'Delivered',
    },
    cancelled: {
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      label: 'Cancelled',
    },
  };

  // ✅ Fetch all orders
  useEffect(() => {
    fetchOrders();
  }, []);

 const fetchOrders = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first");
      window.location.href = "/login";
      return;
    }

    const { data } = await axios.get(`${API_URL}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setOrders(data);
  } catch (error) {
    console.error("Error fetching orders:", error);
    toast.error("Failed to load orders");
  } finally {
    setLoading(false);
  }
};


  // ✅ Update order status
  const updateOrderStatus = async (orderId, newStatus, trackingNumber = '') => {
    try {
      setUpdatingStatus(true);
      await axios.put(
        `${API_URL}/orders/${orderId}/status`,
        { status: newStatus, trackingNumber },
        { withCredentials: true }
      );

      toast.success(`Order updated to ${statusConfig[newStatus].label}`);
      fetchOrders();
      setShowModal(false);
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // ✅ Filtered orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingAddress?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingAddress?.phone.includes(searchTerm);

    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // ✅ Stats
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    processing: orders.filter((o) => o.status === 'processing').length,
    shipped: orders.filter((o) => o.status === 'shipped').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-desi-brown"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-desi-brown mb-2">Orders Management</h1>
        <p className="text-gray-600 mb-6">Manage and track all customer orders</p>

        {/* ✅ Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {[
            ['Total Orders', stats.total, Package, 'border-desi-gold'],
            ['Pending', stats.pending, Clock, 'border-yellow-500'],
            ['Processing', stats.processing, Package, 'border-indigo-500'],
            ['Shipped', stats.shipped, Truck, 'border-purple-500'],
            ['Delivered', stats.delivered, CheckCircle, 'border-green-500'],
          ].map(([label, value, Icon, border]) => (
            <div key={label} className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${border}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{label}</p>
                  <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
                <Icon className="w-8 h-8 text-desi-gold" />
              </div>
            </div>
          ))}
        </div>

        {/* ✅ Filters and Search */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by order number, name, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-desi-gold"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-desi-gold appearance-none"
            >
              <option value="all">All Status</option>
              {Object.entries(statusConfig).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>
        </div>

        {/* ✅ Orders Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-desi-cream">
                <tr>
                  {['Order #', 'Customer', 'Date', 'Items', 'Total', 'Payment', 'Status', 'Actions'].map(
                    (head) => (
                      <th key={head} className="px-6 py-4 text-left text-sm font-semibold text-desi-brown">
                        {head}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => {
                  const status = statusConfig[order.status];
                  const StatusIcon = status.icon;
                  return (
                    <tr key={order._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-mono font-semibold">#{order.orderNumber}</td>
                      <td className="px-6 py-4">
                        <p className="font-medium">{order.shippingAddress?.name}</p>
                        <p className="text-sm text-gray-600">{order.shippingAddress?.phone}</p>
                      </td>
                      <td className="px-6 py-4 text-sm">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                      <td className="px-6 py-4 text-sm">{order.items.length} items</td>
                      <td className="px-6 py-4 font-semibold">₹{order.totalPrice.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {order.paymentInfo.method.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full ${status.bgColor} ${status.color}`}>
                          <StatusIcon className="w-4 h-4 mr-2" />
                          <span className="text-sm font-semibold">{status.label}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowModal(true);
                          }}
                          className="text-desi-gold hover:text-yellow-600"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No orders found</p>
          </div>
        )}
      </div>

      {/* ✅ Edit Order Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-desi-gold to-yellow-600 p-6 text-white flex justify-between">
              <h2 className="text-2xl font-bold">Order Details</h2>
              <button onClick={() => setShowModal(false)} className="text-white hover:text-gray-200">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Details */}
              <div className="border-t pt-4">
                <h3 className="font-bold text-lg mb-4 text-desi-brown flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Customer Info
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p><strong>Name:</strong> {selectedOrder.shippingAddress.name}</p>
                  <p><Phone className="w-4 h-4 inline mr-2" />{selectedOrder.shippingAddress.phone}</p>
                  <p><MapPin className="w-4 h-4 inline mr-2" />{selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}</p>
                </div>
              </div>

              {/* Status Update */}
              <div className="border-t pt-4">
                <h3 className="font-bold text-lg mb-4 text-desi-brown">Update Status</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(statusConfig).map(([key, cfg]) => {
                    const Icon = cfg.icon;
                    return (
                      <button
                        key={key}
                        onClick={() => updateOrderStatus(selectedOrder._id, key)}
                        disabled={updatingStatus || selectedOrder.status === key}
                        className={`p-4 rounded-lg border-2 transition ${
                          selectedOrder.status === key
                            ? `${cfg.borderColor} ${cfg.bgColor}`
                            : 'border-gray-200 hover:border-desi-gold'
                        }`}
                      >
                        <Icon className={`w-6 h-6 mx-auto mb-2 ${cfg.color}`} />
                        <p className="text-sm font-semibold">{cfg.label}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
