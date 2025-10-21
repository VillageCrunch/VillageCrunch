import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, MapPin, Phone, Mail, Edit3, Save, X, Plus, Trash2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  
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
      setAddresses(user.addresses || []);
    }
  }, [user]);

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

  const addAddress = async () => {
    if (!addressData.street || !addressData.city || !addressData.state || !addressData.pincode) {
      toast.error('Please fill all address fields');
      return;
    }

    setLoading(true);
    try {
      const newAddresses = [...addresses];
      
      // If this is set as default, make others non-default
      if (addressData.isDefault) {
        newAddresses.forEach(addr => addr.isDefault = false);
      }
      
      // If this is the first address, make it default
      if (newAddresses.length === 0) {
        addressData.isDefault = true;
      }

      newAddresses.push({ ...addressData });

      const { data } = await axios.put('/api/auth/profile', {
        ...profileData,
        addresses: newAddresses,
      });

      updateUser(data);
      setAddresses(data.addresses);
      setAddressData({ street: '', city: '', state: '', pincode: '', isDefault: false });
      setShowAddressForm(false);
      toast.success('Address added successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add address');
    } finally {
      setLoading(false);
    }
  };

  const updateAddress = async () => {
    if (!addressData.street || !addressData.city || !addressData.state || !addressData.pincode) {
      toast.error('Please fill all address fields');
      return;
    }

    setLoading(true);
    try {
      const updatedAddresses = addresses.map((addr, index) => {
        if (index === editingAddress) {
          // If this is set as default, make others non-default
          if (addressData.isDefault) {
            addresses.forEach(a => a.isDefault = false);
          }
          return { ...addressData };
        }
        return addressData.isDefault ? { ...addr, isDefault: false } : addr;
      });

      const { data } = await axios.put('/api/auth/profile', {
        ...profileData,
        addresses: updatedAddresses,
      });

      updateUser(data);
      setAddresses(data.addresses);
      setAddressData({ street: '', city: '', state: '', pincode: '', isDefault: false });
      setEditingAddress(null);
      toast.success('Address updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update address');
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = async (addressIndex) => {
    if (addresses.length === 1) {
      toast.error('You must have at least one address');
      return;
    }

    setLoading(true);
    try {
      const updatedAddresses = addresses.filter((addr, index) => index !== addressIndex);
      
      // If we deleted the default address, make the first remaining address default
      if (!updatedAddresses.some(addr => addr.isDefault) && updatedAddresses.length > 0) {
        updatedAddresses[0].isDefault = true;
      }

      const { data } = await axios.put('/api/auth/profile', {
        ...profileData,
        addresses: updatedAddresses,
      });

      updateUser(data);
      setAddresses(data.addresses);
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
      isDefault: address.isDefault,
    });
    setEditingAddress(index);
    setShowAddressForm(true);
  };

  const cancelAddressForm = () => {
    setAddressData({ street: '', city: '', state: '', pincode: '', isDefault: false });
    setShowAddressForm(false);
    setEditingAddress(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-desi-brown mb-4">Please Login</h2>
          <p className="text-gray-600">You need to be logged in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="bg-desi-gold p-4 rounded-full">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-desi-brown">My Profile</h1>
                <p className="text-gray-600">Manage your account information</p>
              </div>
            </div>
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center space-x-2 bg-desi-gold text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          {/* Profile Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              {editMode ? (
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  className="input-field"
                  placeholder="Enter your full name"
                />
              ) : (
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-900">{profileData.name}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              {editMode ? (
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  className="input-field"
                  placeholder="Enter your email"
                />
              ) : (
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-900">{profileData.email}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              {editMode ? (
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  className="input-field"
                  placeholder="Enter your phone number"
                />
              ) : (
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-900">{profileData.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Save/Cancel Buttons */}
          {editMode && (
            <div className="flex justify-end space-x-4 mt-6 pt-6 border-t">
              <button
                onClick={() => {
                  setEditMode(false);
                  setProfileData({
                    name: user.name || '',
                    email: user.email || '',
                    phone: user.phone || '',
                  });
                }}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={updateProfile}
                disabled={loading}
                className="flex items-center space-x-2 bg-desi-gold text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Shipping Addresses */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="bg-desi-brown p-4 rounded-full">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-desi-brown">Shipping Addresses</h2>
                <p className="text-gray-600">Manage your delivery addresses</p>
              </div>
            </div>
            {!showAddressForm && (
              <button
                onClick={() => setShowAddressForm(true)}
                className="flex items-center space-x-2 bg-desi-brown text-white px-4 py-2 rounded-lg hover:bg-amber-800 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Address</span>
              </button>
            )}
          </div>

          {/* Add/Edit Address Form */}
          {showAddressForm && (
            <div className="mb-8 p-6 border-2 border-desi-cream rounded-xl bg-desi-cream/20">
              <h3 className="text-lg font-semibold text-desi-brown mb-4">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={addressData.street}
                    onChange={handleAddressChange}
                    className="input-field"
                    placeholder="House/Flat No., Street Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={addressData.city}
                    onChange={handleAddressChange}
                    className="input-field"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={addressData.state}
                    onChange={handleAddressChange}
                    className="input-field"
                    placeholder="State"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={addressData.pincode}
                    onChange={handleAddressChange}
                    className="input-field"
                    placeholder="PIN Code"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isDefault"
                    id="isDefault"
                    checked={addressData.isDefault}
                    onChange={handleAddressChange}
                    className="w-4 h-4 text-desi-gold border-gray-300 rounded focus:ring-desi-gold"
                  />
                  <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
                    Set as default address
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={cancelAddressForm}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={editingAddress ? updateAddress : addAddress}
                  disabled={loading}
                  className="flex items-center space-x-2 bg-desi-brown text-white px-4 py-2 rounded-lg hover:bg-amber-800 transition disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Saving...' : (editingAddress ? 'Update' : 'Add') + ' Address'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Address List */}
          <div className="space-y-4">
            {addresses.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses found</h3>
                <p className="text-gray-600 mb-4">Add your first shipping address to get started.</p>
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="bg-desi-brown text-white px-6 py-2 rounded-lg hover:bg-amber-800 transition"
                >
                  Add Address
                </button>
              </div>
            ) : (
              addresses.map((address, index) => (
                <div
                  key={address._id || index}
                  className={`p-6 rounded-xl border-2 transition ${
                    address.isDefault
                      ? 'border-desi-gold bg-desi-cream/30'
                      : 'border-gray-200 bg-white hover:border-desi-cream'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin className="w-5 h-5 text-desi-brown" />
                        {address.isDefault && (
                          <span className="bg-desi-gold text-white text-xs px-2 py-1 rounded-full font-medium">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-gray-900 font-medium">{address.street}</p>
                      <p className="text-gray-600">
                        {address.city}, {address.state} - {address.pincode}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!address.isDefault && (
                        <button
                          onClick={() => setDefaultAddress(index)}
                          disabled={loading}
                          className="flex items-center space-x-1 text-desi-brown hover:text-desi-gold transition text-sm"
                          title="Set as default"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => startEditAddress(address, index)}
                        className="flex items-center space-x-1 text-desi-brown hover:text-desi-gold transition text-sm"
                        title="Edit address"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteAddress(index)}
                        disabled={loading || addresses.length === 1}
                        className="flex items-center space-x-1 text-red-600 hover:text-red-800 transition text-sm disabled:opacity-50"
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
    </div>
  );
};

export default Profile;