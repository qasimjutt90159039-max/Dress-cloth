import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Phone, Mail, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import Breadcrumbs from '../../components/common/Breadcrumbs';

export const Profile = () => {
  const { user, updateProfile } = useAuthStore();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState({ success: '', error: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ success: '', error: '' });

    const payload = { name, phone };
    if (password) payload.password = password;

    const res = await updateProfile(payload);
    if (res.success) {
      setStatus({ success: 'Profile information updated successfully!', error: '' });
      setPassword('');
    } else {
      setStatus({ success: '', error: res.message || 'Failed to update profile' });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Breadcrumbs items={[{ label: 'My Account' }, { label: 'Profile' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gold-300/40 gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-maroon-800">
            Account Profile
          </h1>
          <p className="text-xs text-charcoal-muted mt-1">
            Manage your personal contact details and security credentials.
          </p>
        </div>

        <div className="flex gap-2 text-xs">
          <Link
            to="/account/orders"
            className="px-4 py-2 bg-ivory-100 hover:bg-gold-50 border border-gold-300 rounded font-semibold text-maroon-800"
          >
            My Orders
          </Link>
          <Link
            to="/account/addresses"
            className="px-4 py-2 bg-ivory-100 hover:bg-gold-50 border border-gold-300 rounded font-semibold text-maroon-800"
          >
            Saved Addresses
          </Link>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gold-300/60 shadow-sm max-w-2xl">
        {status.success && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{status.success}</span>
          </div>
        )}
        {status.error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{status.error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold mb-1">Full Name</label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-ivory-50 border border-gold-300 rounded"
              />
              <User className="w-4 h-4 text-gold-600 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Email Address (Read-only)</label>
            <div className="relative">
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full pl-9 pr-3 py-2.5 bg-gray-100 border border-gray-300 rounded text-gray-500 cursor-not-allowed"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Phone / WhatsApp</label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="03186229753"
                className="w-full pl-9 pr-3 py-2.5 bg-ivory-50 border border-gold-300 rounded"
              />
              <Phone className="w-4 h-4 text-gold-600 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">New Password (leave blank to keep current)</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-ivory-50 border border-gold-300 rounded"
              />
              <Lock className="w-4 h-4 text-gold-600 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-maroon-800 hover:bg-maroon-900 text-white font-serif font-bold text-xs uppercase tracking-wider rounded shadow transition-colors"
          >
            {loading ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
