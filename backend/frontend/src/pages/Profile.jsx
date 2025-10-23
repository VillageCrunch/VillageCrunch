import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, MapPin, Phone, Mail, Edit3, Save, X, Plus, Trash2, CheckCircle, 
  Shield, Calendar, Package, Star, Heart, Settings, Lock 
} from 'lucide-react';
import { addAddress, updateAddress, deleteAddress, setDefaultAddress, getUserStats, getUserAddresses } from '../utils/api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [userStats, setUserStats] = useState({
    totalOrders: 0,
    totalAddresses: 0,
    wishlistCount: 0,
    memberSince: null
  });
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [addressData, setAddressData] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    isDefault: false,
  });

  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
      fetchUserAddresses();
      fetchUserStats();
    }
  }, [user]);

  const fetchUserAddresses = async () => {
    try {
      const addressesData = await getUserAddresses();
      setAddresses(addressesData || []);
    } catch (error) {
      setAddresses([]);
    }
  };

  const fetchUserStats = async () => {
    try {
      const stats = await getUserStats();
      setUserStats(stats);
    } catch (error) {
      // Silent error handling for stats
    }
  };

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressData({
      ...addressData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const updateProfile = async () => {
    setLoading(true);
    try {
      const { data } = await axios.put('/api/auth/profile', profileData);
      updateUser(data);
      setEditMode(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async () => {
    if (!addressData.street || !addressData.city || !addressData.state || !addressData.pincode || !addressData.phone) {
      toast.error('Please fill all address fields');
      return;
    }

    setLoading(true);
    try {
      const { data } = await addAddress(addressData);
      
      // Refresh addresses from API
      await fetchUserAddresses();
      
      setAddressData({ street: '', city: '', state: '', pincode: '', phone: '', isDefault: false });
      setShowAddressForm(false);
      toast.success('Address added successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add address');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAddress = async () => {
    if (!addressData.street || !addressData.city || !addressData.state || !addressData.pincode || !addressData.phone) {
      toast.error('Please fill all address fields');
      return;
    }

    setLoading(true);
    try {
      const addressId = addresses[editingAddress]._id;
      const { data } = await updateAddress(addressId, addressData);
      
      // Refresh addresses from API
      await fetchUserAddresses();
      
      setAddressData({ street: '', city: '', state: '', pincode: '', phone: '', isDefault: false });
      setEditingAddress(null);
      toast.success('Address updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update address');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressIndex) => {
    if (addresses.length === 1) {
      toast.error('You must have at least one address');
      return;
    }

    setLoading(true);
    try {
      const addressId = addresses[addressIndex]._id;
      await deleteAddress(addressId);
      
      // Refresh addresses from API
      await fetchUserAddresses();
      
      toast.success('Address deleted successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete address');
    } finally {
      setLoading(false);
    }
  };

  const setDefaultAddress = async (addressIndex) => {
    setLoading(true);
    try {
      const updatedAddresses = addresses.map((addr, index) => ({
        ...addr,
        isDefault: index === addressIndex,
      }));

      const { data } = await axios.put('/api/auth/profile', {
        ...profileData,
        addresses: updatedAddresses,
      });

      updateUser(data);
      setAddresses(data.addresses);
      toast.success('Default address updated!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update default address');
    } finally {
      setLoading(false);
    }
  };

  const startEditAddress = (address, index) => {
    setAddressData({
      street: address.street,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      phone: address.phone || user.phone || '', // Use address phone or fallback to user phone
      isDefault: address.isDefault,
    });
    setEditingAddress(index);
    setShowAddressForm(true);
  };

  const cancelAddressForm = () => {
    setAddressData({ street: '', city: '', state: '', pincode: '', phone: '', isDefault: false });
    setShowAddressForm(false);
    setEditingAddress(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-desi-cream via-white to-desi-cream flex items-center justify-center">
        <div className="text-center bg-white p-12 rounded-3xl shadow-2xl border border-desi-cream/50">
          <div className="bg-desi-gold/10 p-6 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-desi-gold" />
          </div>
          <h2 className="text-3xl font-bold text-desi-brown mb-4">Access Required</h2>
          <p className="text-gray-600 mb-8">Please login to view and manage your profile.</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="bg-desi-gold text-white px-8 py-3 rounded-xl hover:bg-yellow-600 transition-all duration-300 transform hover:scale-105 font-semibold"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-desi-cream via-white to-desi-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Section with Profile Overview */}
        <div className="relative bg-gradient-to-r from-desi-brown via-amber-800 to-desi-gold rounded-3xl shadow-2xl p-8 mb-8 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 w-32 h-32 bg-white rounded-full"></div>
            <div className="absolute bottom-4 right-4 w-24 h-24 bg-white rounded-full"></div>
            <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white rounded-full"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between mb-6">
              <div className="flex items-center space-x-6 mb-6 lg:mb-0">
                <div className="relative">
                  <div className="bg-white/20 backdrop-blur-sm p-6 rounded-3xl border border-white/30">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-3 border-white flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="text-white">
                  <h1 className="text-4xl font-bold mb-2">Welcome back, {user.name?.split(' ')[0]}!</h1>
                  <p className="text-white/80 text-lg">
                    Member since {userStats.memberSince ? new Date(userStats.memberSince).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : new Date(user.createdAt || Date.now()).getFullYear()}
                  </p>
                  <div className="flex items-center space-x-4 mt-3">
                    <div className="flex items-center space-x-1">
                      <Shield className="w-5 h-5 text-green-300" />
                      <span className="text-sm font-medium">Verified Account</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {!editMode && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-300 transform hover:scale-105 border border-white/30"
                  >
                    <Edit3 className="w-5 h-5" />
                    <span className="font-semibold">Edit Profile</span>
                  </button>
                )}
                <button className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20">
                  <Settings className="w-5 h-5" />
                  <span className="font-semibold">Settings</span>
                </button>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <Package className="w-8 h-8 text-white" />
                  <div>
                    <p className="text-white/80 text-sm">Total Orders</p>
                    <p className="text-white text-2xl font-bold">{userStats.totalOrders}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-8 h-8 text-white" />
                  <div>
                    <p className="text-white/80 text-sm">Addresses</p>
                    <p className="text-white text-2xl font-bold">{userStats.totalAddresses}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <Star className="w-8 h-8 text-white" />
                  <div>
                    <p className="text-white/80 text-sm">Reviews</p>
                    <p className="text-white text-2xl font-bold">0</p>
                  </div>
                </div>
              </div>
              <Link to="/wishlist" className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 block">
                <div className="flex items-center space-x-3">
                  <Heart className="w-8 h-8 text-white" />
                  <div>
                    <p className="text-white/80 text-sm">Wishlist</p>
                    <p className="text-white text-2xl font-bold">{userStats.wishlistCount}</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Profile Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-desi-gold to-yellow-600 p-3 rounded-2xl">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                    <p className="text-gray-600">Update your personal details and preferences</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Full Name
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-desi-gold focus:border-transparent transition-all duration-300"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200 group-hover:shadow-md transition-all duration-300">
                      <div className="bg-desi-gold/10 p-2 rounded-xl">
                        <User className="w-5 h-5 text-desi-gold" />
                      </div>
                      <span className="text-gray-900 font-medium">{profileData.name}</span>
                    </div>
                  )}
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Email Address
                  </label>
                  {editMode ? (
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-desi-gold focus:border-transparent transition-all duration-300"
                      placeholder="Enter your email"
                    />
                  ) : (
                    <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200 group-hover:shadow-md transition-all duration-300">
                      <div className="bg-blue-500/10 p-2 rounded-xl">
                        <Mail className="w-5 h-5 text-blue-500" />
                      </div>
                      <span className="text-gray-900 font-medium">{profileData.email}</span>
                    </div>
                  )}
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Phone Number
                  </label>
                  {editMode ? (
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-desi-gold focus:border-transparent transition-all duration-300"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200 group-hover:shadow-md transition-all duration-300">
                      <div className="bg-green-500/10 p-2 rounded-xl">
                        <Phone className="w-5 h-5 text-green-500" />
                      </div>
                      <span className="text-gray-900 font-medium">{profileData.phone}</span>
                    </div>
                  )}
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Account Security
                  </label>
                  <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200 group-hover:shadow-md transition-all duration-300">
                    <div className="bg-red-500/10 p-2 rounded-xl">
                      <Lock className="w-5 h-5 text-red-500" />
                    </div>
                    <span className="text-gray-900 font-medium">••••••••</span>
                    <button className="text-desi-gold hover:text-yellow-600 text-sm font-medium ml-auto">
                      Change Password
                    </button>
                  </div>
                </div>
              </div>

              {/* Save/Cancel Buttons */}
              {editMode && (
                <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setProfileData({
                        name: user.name || '',
                        email: user.email || '',
                        phone: user.phone || '',
                      });
                    }}
                    className="flex items-center space-x-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={updateProfile}
                    disabled={loading}
                    className="flex items-center space-x-2 bg-gradient-to-r from-desi-gold to-yellow-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 font-semibold transform hover:scale-105"
                  >
                    <Save className="w-4 h-4" />
                    <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Shipping Addresses */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-desi-brown to-amber-800 p-3 rounded-2xl">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Delivery Addresses</h2>
                    <p className="text-gray-600">Manage your shipping locations for faster checkout</p>
                  </div>
                </div>
                {!showAddressForm && (
                  <button
                    onClick={() => {
                      // Initialize with user's phone when adding new address
                      setAddressData({
                        street: '',
                        city: '',
                        state: '',
                        pincode: '',
                        phone: user.phone || '',
                        isDefault: false,
                      });
                      setShowAddressForm(true);
                    }}
                    className="flex items-center space-x-2 bg-gradient-to-r from-desi-brown to-amber-800 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-semibold"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add New Address</span>
                  </button>
                )}
              </div>

              {/* Add/Edit Address Form */}
              {showAddressForm && (
                <div className="mb-8 p-8 bg-gradient-to-br from-desi-cream/30 to-desi-cream/10 rounded-3xl border-2 border-desi-cream/50 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-desi-brown mb-6 flex items-center space-x-2">
                    <MapPin className="w-6 h-6" />
                    <span>{editingAddress !== null ? 'Edit Address' : 'Add New Address'}</span>
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Complete Street Address
                      </label>
                      <input
                        type="text"
                        name="street"
                        value={addressData.street}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-desi-gold focus:border-transparent transition-all duration-300 shadow-sm"
                        placeholder="House/Flat No., Building Name, Street Name, Landmark"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={addressData.city}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-desi-gold focus:border-transparent transition-all duration-300 shadow-sm"
                        placeholder="Enter city name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={addressData.state}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-desi-gold focus:border-transparent transition-all duration-300 shadow-sm"
                        placeholder="Enter state name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        PIN Code
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={addressData.pincode}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-desi-gold focus:border-transparent transition-all duration-300 shadow-sm"
                        placeholder="6-digit PIN code"
                        maxLength="6"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={addressData.phone}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-desi-gold focus:border-transparent transition-all duration-300 shadow-sm"
                        placeholder="Enter phone number for this address"
                        maxLength="15"
                      />
                    </div>
                    <div className="flex items-center bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-gray-200">
                      <input
                        type="checkbox"
                        name="isDefault"
                        id="isDefault"
                        checked={addressData.isDefault}
                        onChange={handleAddressChange}
                        className="w-5 h-5 text-desi-gold border-2 border-gray-300 rounded-lg focus:ring-desi-gold focus:ring-2"
                      />
                      <label htmlFor="isDefault" className="ml-3 text-sm font-medium text-gray-700 flex items-center space-x-2">
                        <span>Set as primary delivery address</span>
                        <Star className="w-4 h-4 text-desi-gold" />
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-4 mt-8">
                    <button
                      onClick={cancelAddressForm}
                      className="flex items-center space-x-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                    <button
                      onClick={editingAddress !== null ? handleUpdateAddress : handleAddAddress}
                      disabled={loading}
                      className="flex items-center space-x-2 bg-gradient-to-r from-desi-brown to-amber-800 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 font-semibold transform hover:scale-105"
                    >
                      <Save className="w-4 h-4" />
                      <span>{loading ? 'Saving...' : (editingAddress !== null ? 'Update' : 'Save') + ' Address'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Address List */}
              <div className="space-y-6">
                {addresses.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="bg-gray-100 rounded-full p-8 w-32 h-32 flex items-center justify-center mx-auto mb-6">
                      <MapPin className="w-16 h-16 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">No delivery addresses yet</h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">Add your first shipping address to enjoy faster checkout and seamless delivery experience.</p>
                    <button
                      onClick={() => {
                        // Initialize with user's phone when adding first address
                        setAddressData({
                          street: '',
                          city: '',
                          state: '',
                          pincode: '',
                          phone: user.phone || '',
                          isDefault: false,
                        });
                        setShowAddressForm(true);
                      }}
                      className="bg-gradient-to-r from-desi-brown to-amber-800 text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-semibold"
                    >
                      Add Your First Address
                    </button>
                  </div>
                ) : (
                  addresses.map((address, index) => (
                    <div
                      key={address._id || index}
                      className={`group p-8 rounded-3xl border-2 transition-all duration-300 transform hover:scale-102 ${
                        address.isDefault
                          ? 'border-desi-gold bg-gradient-to-br from-desi-cream/40 to-yellow-50 shadow-lg'
                          : 'border-gray-200 bg-white hover:border-desi-cream hover:shadow-xl'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className={`p-2 rounded-xl ${address.isDefault ? 'bg-desi-gold/20' : 'bg-gray-100'}`}>
                              <MapPin className={`w-5 h-5 ${address.isDefault ? 'text-desi-gold' : 'text-gray-600'}`} />
                            </div>
                            {address.isDefault && (
                              <div className="flex items-center space-x-2">
                                <span className="bg-gradient-to-r from-desi-gold to-yellow-600 text-white text-xs px-3 py-1 rounded-full font-semibold flex items-center space-x-1">
                                  <Star className="w-3 h-3" />
                                  <span>Primary Address</span>
                                </span>
                              </div>
                            )}
                          </div>
                          <p className="text-gray-900 font-semibold text-lg mb-2">{address.street}</p>
                          <p className="text-gray-600 font-medium mb-1">
                            {address.city}, {address.state} - <span className="font-bold">{address.pincode}</span>
                          </p>
                          {address.phone && (
                            <p className="text-gray-600 font-medium flex items-center space-x-2">
                              <Phone className="w-4 h-4" />
                              <span>{address.phone}</span>
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {!address.isDefault && (
                            <button
                              onClick={() => setDefaultAddress(index)}
                              disabled={loading}
                              className="flex items-center space-x-1 bg-desi-gold/10 text-desi-gold px-3 py-2 rounded-xl hover:bg-desi-gold hover:text-white transition-all duration-300 text-sm font-medium"
                              title="Set as primary address"
                            >
                              <Star className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => startEditAddress(address, index)}
                            className="flex items-center space-x-1 bg-blue-500/10 text-blue-600 px-3 py-2 rounded-xl hover:bg-blue-500 hover:text-white transition-all duration-300 text-sm font-medium"
                            title="Edit address"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(index)}
                            disabled={loading || addresses.length === 1}
                            className="flex items-center space-x-1 bg-red-500/10 text-red-600 px-3 py-2 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            title={addresses.length === 1 ? 'Cannot delete the only address' : 'Delete address'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
              <div className="space-y-4">
                <button className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 group">
                  <Package className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-medium text-blue-900">View Order History</span>
                </button>
                <Link to="/wishlist" className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl hover:from-green-100 hover:to-green-200 transition-all duration-300 group">
                  <Heart className="w-6 h-6 text-green-600 group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-medium text-green-900">My Wishlist ({userStats.wishlistCount})</span>
                </Link>
                <Link to="/rate-products" className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-orange-50 to-yellow-100 rounded-2xl hover:from-orange-100 hover:to-yellow-200 transition-all duration-300 group">
                  <Star className="w-6 h-6 text-orange-600 group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-left">
                    <div className="font-medium text-orange-900">Rate Your Products</div>
                    <div className="text-xs text-orange-700">Share your experience after consumption</div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Account Summary */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-6 border border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <User className="w-6 h-6 text-gray-600" />
                <h3 className="text-lg font-bold text-gray-800">Account Summary</h3>
              </div>
              <p className="text-gray-700 mb-4">Thank you for being a valued customer! Enjoy our premium quality dry fruits.</p>
              <div className="bg-white/80 rounded-2xl p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-semibold text-gray-800">
                    {userStats.memberSince ? new Date(userStats.memberSince).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : new Date(user.createdAt || Date.now()).getFullYear()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;