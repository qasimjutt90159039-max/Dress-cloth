import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Home, ShoppingBag, ArrowLeft, Phone } from 'lucide-react';
import { BUSINESS_INFO } from '../utils/constants';

export const NotFound = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-gradient-to-b from-ivory to-ivory-200">
      <div className="max-w-xl w-full text-center space-y-8 bg-white p-8 sm:p-12 rounded-2xl shadow-xl border border-gold-300/40">
        {/* Decorative Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-50 border border-gold-300 text-maroon-800 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-gold-600" />
          <span>Multani Handcraft Boutique</span>
        </div>

        {/* 404 Heading */}
        <div className="space-y-3">
          <h1 className="font-serif text-7xl sm:text-8xl font-bold text-maroon-800 tracking-tight">
            404
          </h1>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal">
            Page Not Found / صفحہ دستیاب نہیں ہے
          </h2>
          <p className="text-sm text-charcoal-muted max-w-md mx-auto leading-relaxed">
            The dress, collection, or page you are looking for might have been moved, renamed,
            or is temporarily resting in our Multan artisan workshop.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-maroon-800 hover:bg-maroon-900 text-ivory text-sm font-semibold transition-all shadow-md hover:shadow-lg"
          >
            <Home className="w-4 h-4 text-gold-400" />
            <span>Return to Homepage</span>
          </Link>

          <Link
            to="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gold-500 hover:bg-gold-600 text-maroon-900 text-sm font-semibold transition-all shadow-md hover:shadow-lg"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Explore Boutique Shop</span>
          </Link>
        </div>

        {/* Quick Help Links */}
        <div className="pt-6 border-t border-gray-100 flex flex-wrap items-center justify-center gap-6 text-xs text-charcoal-muted">
          <Link to="/custom-order" className="hover:text-maroon-800 underline underline-offset-4">
            Custom Tailoring
          </Link>
          <Link to="/track-order" className="hover:text-maroon-800 underline underline-offset-4">
            Track Order
          </Link>
          <Link to="/contact-us" className="hover:text-maroon-800 underline underline-offset-4">
            Contact Support
          </Link>
          <a
            href={`https://wa.me/${BUSINESS_INFO.whatsApp}?text=${encodeURIComponent('Assalam-o-Alaikum, I need help finding an item on Hand Embroidered Dresses.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-medium"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>WhatsApp: {BUSINESS_INFO.phone}</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
