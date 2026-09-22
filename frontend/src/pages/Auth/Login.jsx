import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle, Sparkles } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import Breadcrumbs from '../../components/common/Breadcrumbs';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const redirectPath = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      if (result.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(redirectPath);
      }
    }
  };

  const handleQuickFillAdmin = () => {
    setEmail('admin@handembroidered.pk');
    setPassword('Admin@123456');
  };

  const handleQuickFillCustomer = () => {
    setEmail('customer@gmail.com');
    setPassword('Customer@123456');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <Breadcrumbs items={[{ label: 'Sign In' }]} />

      <div className="bg-white p-8 rounded-2xl border border-gold-300/60 shadow-lg space-y-6 mt-6">
        <div className="text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-gold-700 tracking-widest">
            Welcome Back
          </span>
          <h1 className="font-serif text-2xl font-bold text-maroon-800">
            Sign In to Your Account
          </h1>
          <p className="text-xs text-charcoal-muted">
            Access your saved addresses, order history, and custom tailoring requests.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2.5 bg-ivory-50 border border-gold-300 rounded focus:bg-white focus:outline-none focus:border-maroon-800"
              />
              <Mail className="w-4 h-4 text-gold-600 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-semibold">Password</label>
              <Link to="/forgot-password" className="text-maroon-800 hover:underline">
                Forgot password?
              </Link>
            </div>
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-maroon-800 hover:bg-maroon-900 text-white font-serif font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <LogIn className="w-4 h-4 text-gold-300" />
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Quick Demo Credentials Autofill */}
        <div className="pt-4 border-t border-gray-100 text-center space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gold-700">
            One-Click Demo Credentials:
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleQuickFillAdmin}
              className="flex-1 py-1.5 px-2 bg-ivory-100 border border-gold-300 text-maroon-800 rounded text-[11px] font-medium hover:bg-gold-50"
            >
              Fill Admin Account
            </button>
            <button
              type="button"
              onClick={handleQuickFillCustomer}
              className="flex-1 py-1.5 px-2 bg-ivory-100 border border-gold-300 text-maroon-800 rounded text-[11px] font-medium hover:bg-gold-50"
            >
              Fill Customer Account
            </button>
          </div>
        </div>

        <p className="text-xs text-center text-charcoal-muted pt-2">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-maroon-800 font-bold hover:underline">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
