import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import api from '../../services/api';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await api.post('/auth/forgot-password', { email });
      setMessage(res.data.message || 'Password reset instructions have been generated.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request reset. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <Breadcrumbs items={[{ label: 'Forgot Password' }]} />

      <div className="bg-white p-8 rounded-2xl border border-gold-300/60 shadow-lg space-y-6 mt-6">
        <div className="text-center space-y-1">
          <h1 className="font-serif text-2xl font-bold text-maroon-800">
            Reset Password
          </h1>
          <p className="text-xs text-charcoal-muted">
            Enter your email to receive recovery instructions.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {message ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <p className="text-xs text-emerald-800">{message}</p>
            <Link to="/login" className="inline-block text-xs font-bold text-maroon-800 underline pt-2">
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold mb-1">Account Email</label>
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-maroon-800 hover:bg-maroon-900 text-white font-serif font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-colors disabled:opacity-50"
            >
              {loading ? 'Sending Request...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <div className="text-center pt-2">
          <Link
            to="/login"
            className="text-xs text-maroon-800 hover:text-gold-700 font-semibold inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
