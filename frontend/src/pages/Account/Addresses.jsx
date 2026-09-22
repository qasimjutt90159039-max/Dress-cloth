import React, { useState } from 'react';
import { Plus, Trash2, MapPin, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { PROVINCES, CITIES_BY_PROVINCE, ALL_PAKISTANI_CITIES } from '../../utils/pakistaniLocations';
import Breadcrumbs from '../../components/common/Breadcrumbs';

export const Addresses = () => {
  const { user, addAddress, deleteAddress } = useAuthStore();
  const [showAddForm, setShowAddForm] = useState(false);

  const [form, setForm] = useState({
    title: 'Home',
    streetAddress: '',
    apartment: '',
    province: 'Punjab',
    city: 'Multan',
    postalCode: '',
    phone: user?.phone || '',
    isDefault: false
  });

  const availableCities = CITIES_BY_PROVINCE[form.province] || ALL_PAKISTANI_CITIES;

  const handleProvinceChange = (prov) => {
    setForm(prev => ({
      ...prev,
      province: prov,
      city: CITIES_BY_PROVINCE[prov]?.[0] || 'Multan'
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addAddress(form);
    setShowAddForm(false);
    setForm({
      title: 'Home',
      streetAddress: '',
      apartment: '',
      province: 'Punjab',
      city: 'Multan',
      postalCode: '',
      phone: user?.phone || '',
      isDefault: false
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Breadcrumbs items={[{ label: 'My Account', link: '/account/profile' }, { label: 'Saved Addresses' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gold-300/40 gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-maroon-800">
            Saved Delivery Addresses
          </h1>
          <p className="text-xs text-charcoal-muted mt-1">
            Store multiple delivery locations across Pakistan for instant one-click checkout.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-maroon-800 hover:bg-maroon-900 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors self-start"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Cancel' : 'Add New Address'}</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gold-300 shadow-md space-y-4 text-xs">
          <h3 className="font-serif font-bold text-base text-maroon-800">Add New Delivery Location</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Address Label</label>
              <select
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full p-2 bg-ivory-50 border border-gold-300 rounded"
              >
                <option value="Home">Home</option>
                <option value="Office">Office / Workplace</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Phone Number for Courier *</label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="03186229753"
                className="w-full p-2 bg-ivory-50 border border-gold-300 rounded"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold mb-1">Street Address / House No. *</label>
              <input
                type="text"
                required
                value={form.streetAddress}
                onChange={(e) => setForm({ ...form, streetAddress: e.target.value })}
                placeholder="House #, Street name, Sector / Mohalla..."
                className="w-full p-2 bg-ivory-50 border border-gold-300 rounded"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Province *</label>
              <select
                value={form.province}
                onChange={(e) => handleProvinceChange(e.target.value)}
                className="w-full p-2 bg-ivory-50 border border-gold-300 rounded"
              >
                {PROVINCES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">City *</label>
              <select
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full p-2 bg-ivory-50 border border-gold-300 rounded"
              >
                {availableCities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-maroon-800 text-white font-serif font-bold text-xs uppercase tracking-wider rounded hover:bg-maroon-900"
          >
            Save Address
          </button>
        </form>
      )}

      {/* Addresses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {user?.addresses && user.addresses.length > 0 ? (
          user.addresses.map((addr) => (
            <div
              key={addr._id}
              className="bg-white p-5 rounded-xl border border-gold-300/60 shadow-sm relative space-y-2 text-xs"
            >
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="font-bold text-sm text-maroon-800 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-gold-600" />
                  <span>{addr.title}</span>
                </span>
                <button
                  onClick={() => deleteAddress(addr._id)}
                  className="text-red-500 hover:text-red-700"
                  title="Delete address"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-charcoal font-medium">{addr.streetAddress}</p>
              <p className="text-charcoal-muted">{addr.city}, {addr.province}</p>
              <p className="text-charcoal-muted">Phone: {addr.phone}</p>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center py-10 bg-white rounded-xl border border-gold-200 text-xs text-charcoal-muted">
            No saved addresses found. Add one above to speed up your future checkouts!
          </div>
        )}
      </div>
    </div>
  );
};

export default Addresses;
