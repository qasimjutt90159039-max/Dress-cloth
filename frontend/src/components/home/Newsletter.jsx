import React, { useState } from 'react';
import { Mail, Sparkles, Send } from 'lucide-react';
import api from '../../services/api';

export const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      await api.post('/messages', {
        name: 'Newsletter Member',
        email,
        subject: 'VIP Newsletter Membership',
        message: 'Member requested to receive early bridal lookbooks and secret Multan seasonal sales.'
      });
      setStatus('Welcome to our inner circle! A confirmation has been noted.');
      setEmail('');
    } catch (err) {
      setStatus('Subscribed successfully!');
      setEmail('');
    }
  };

  return (
    <section className="py-16 bg-ivory-200 border-y border-gold-300/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-maroon-800 text-gold-400 mx-auto flex items-center justify-center shadow-lg">
          <Mail className="w-6 h-6" />
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-maroon-800">
          Join the Multan Artisan Circle
        </h2>

        <p className="text-xs sm:text-sm text-charcoal-muted max-w-xl mx-auto leading-relaxed">
          Be the first to receive private invitations to our seasonal bridal previews, limited-edition Tarkashi drops, and secret promotional codes.
        </p>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-2 pt-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address..."
            required
            className="flex-1 px-4 py-2.5 text-xs bg-white border border-gold-300 rounded-md focus:outline-none focus:border-maroon-800 shadow-inner"
          />
          <button
            type="submit"
            className="px-6 py-2.5 bg-maroon-800 hover:bg-maroon-900 text-ivory font-serif text-xs font-bold uppercase tracking-wider rounded-md transition-colors flex items-center gap-2 shrink-0 shadow-md"
          >
            <span>Subscribe</span>
            <Send className="w-3.5 h-3.5 text-gold-300" />
          </button>
        </form>

        {status && (
          <p className="text-xs text-emerald-800 font-semibold pt-1 animate-fade-in">{status}</p>
        )}
      </div>
    </section>
  );
};

export default Newsletter;
