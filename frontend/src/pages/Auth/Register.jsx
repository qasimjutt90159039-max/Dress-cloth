import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, UserPlus, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import Breadcrumbs from '../../components/common/Breadcrumbs';

export const Register = () => {
  const navigate = useNavigate();
  const { register, loading, error } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters long');
      return;
    }

    const res = await register({ name, email, phone, password });
    if (res.success) {
      navigate('/account/profile');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <Breadcrumbs items={[{ label: 'Create Account' }]} />

      <div className="bg-white p-8 rounded-2xl border border-gold-300/60 shadow-lg space-y-6 mt-6">
        <div className="text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-gold-700 tracking-widest">
            Join Our Boutique
          </span>
          <h1 className="font-serif text-2xl font-bold text-maroon-800">
            Create Customer Account
          </h1>
          <p className="text-xs text-charcoal-muted">
            Enjoy seamless order tracking and fast address checkout.
          </p>
        </div>

        {(localError || error) && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{localError || error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold mb-1">Full Name *</label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Fatima Khan"
                className="w-full pl-9 pr-3 py-2.5 bg-ivory-50 border border-gold-300 rounded focus:bg-white focus:outline-none focus:border-maroon-800"
              />
              <User className="w-4 h-4 text-gold-600 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Email Address *</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="fatima@example.com"
                className="w-full pl-9 pr-3 py-2.5 bg-ivory-50 border border-gold-300 rounded focus:bg-white focus:outline-none focus:border-maroon-800"
              />
              <Mail className="w-4 h-4 text-gold-600 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Phone / WhatsApp (Optional)</label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="03186229753"
                className="w-full pl-9 pr-3 py-2.5 bg-ivory-50 border border-gold-300 rounded focus:bg-white focus:outline-none focus:border-maroon-800"
              />
              <Phone className="w-4 h-4 text-gold-600 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Password * (Min 6 characters)</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-ivory-50 border border-gold-300 rounded focus:bg-white focus:outline-none focus:border-maroon-800"
              />
              <Lock className="w-4 h-4 text-gold-600 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Confirm Password *</label>
            <div className="relative">
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-ivory-50 border border-gold-300 rounded focus:bg-white focus:outline-none focus:border-maroon-800"
              />
              <Lock className="w-4 h-4 text-gold-600 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-maroon-800 hover:bg-maroon-900 text-white font-serif font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <UserPlus className="w-4 h-4 text-gold-300" />
            <span>{loading ? 'Creating Account...' : 'Register Account'}</span>
          </button>
        </form>

        <p className="text-xs text-center text-charcoal-muted pt-2">
          Already have an account?{' '}
          <Link to="/login" className="text-maroon-800 font-bold hover:underline">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
