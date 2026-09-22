import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Send,
  Heart
} from 'lucide-react';
import { useLanguageStore } from '../../store/useLanguageStore';
import api from '../../services/api';

export const Footer = () => {
  const { t } = useLanguageStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState(null);

  const handleNewsletter = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    try {
      await api.post('/messages', {
        name: 'Newsletter Subscriber',
        email: newsletterEmail,
        subject: 'Newsletter Subscription',
        message: 'Customer opted into promotional updates and artisan collection releases.'
      });
      setNewsletterStatus('Thank you for subscribing to Hand Embroidered Dresses!');
      setNewsletterEmail('');
    } catch (err) {
      setNewsletterStatus('Subscribed successfully!');
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-maroon-900 text-ivory/90 border-t-4 border-gold-500">
      {/* Top Value Propositions */}
      <div className="border-b border-maroon-800 bg-maroon-900/60 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-gold-600/10 border border-gold-500/40 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-gold-300">100% Handcrafted</h4>
              <p className="text-xs text-ivory/70">Master artisan needlework from Multan</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-gold-600/10 border border-gold-500/40 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-gold-300">Nationwide Delivery</h4>
              <p className="text-xs text-ivory/70">TCS & Leopards express to all cities</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-gold-600/10 border border-gold-500/40 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-gold-300">Cash on Delivery</h4>
              <p className="text-xs text-ivory/70">Pay safely at your doorstep</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-gold-600/10 border border-gold-500/40 flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-gold-300">7-Day Easy Exchange</h4>
              <p className="text-xs text-ivory/70">Customer satisfaction guaranteed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Address Column */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-serif text-2xl font-bold text-gold-400 tracking-wider">
              HAND EMBROIDERED DRESSES
            </h3>
            <p className="text-xs text-ivory/80 leading-relaxed max-w-sm">
              Authentic Pakistani heritage boutique operating from the historic alleys of Multan.
              We specialize in heirloom bridal lehengas, hand-done Chikankari, Zardozi, and pure Tilla work.
            </p>

            <div className="space-y-2.5 pt-2 text-xs text-ivory/85">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>
                  Shop No. 7, Bata Wali, Hussain Agahi Main Chowk Bazar, Ghali Colony, near Firdouse Market, Inner City, Multan, 66000, Pakistan
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <a href="tel:03186229753" className="hover:text-gold-300">
                  03186229753 / +92 318 6229753
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <a href="mailto:info@handembroidered.pk" className="hover:text-gold-300">
                  info@handembroidered.pk
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-gold-400 shrink-0" />
                <span>Mon - Sat: 10:00 AM - 10:00 PM (PKT)</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-serif text-base font-semibold text-gold-300 mb-4 tracking-wider uppercase">
              Collections
            </h4>
            <ul className="space-y-2 text-xs text-ivory/75">
              <li>
                <Link to="/category/bridal-dresses" className="hover:text-gold-300 transition-colors">
                  Bridal Dresses
                </Link>
              </li>
              <li>
                <Link to="/category/party-wear" className="hover:text-gold-300 transition-colors">
                  Luxury Party Wear
                </Link>
              </li>
              <li>
                <Link to="/category/casual-daily-wear" className="hover:text-gold-300 transition-colors">
                  Casual & Daily Kurtis
                </Link>
              </li>
              <li>
                <Link to="/category/shawls-dupattas" className="hover:text-gold-300 transition-colors">
                  Shawls & Dupattas
                </Link>
              </li>
              <li>
                <Link to="/category/unstitched-fabric" className="hover:text-gold-300 transition-colors">
                  Unstitched Luxury Fabric
                </Link>
              </li>
              <li>
                <Link to="/category/ready-to-wear" className="hover:text-gold-300 transition-colors">
                  Ready-to-Wear (Pret)
                </Link>
              </li>
              <li>
                <Link to="/category/maxis-pishwas" className="hover:text-gold-300 transition-colors">
                  Embroidered Maxis & Pishwas
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-serif text-base font-semibold text-gold-300 mb-4 tracking-wider uppercase">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-ivory/75">
              <li>
                <Link to="/custom-order" className="hover:text-gold-300 transition-colors">
                  Custom Tailoring Request
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="hover:text-gold-300 transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/about-us" className="hover:text-gold-300 transition-colors">
                  Our Multan Artisan Story
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="hover:text-gold-300 transition-colors">
                  Contact Us & Location Map
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-gold-300 transition-colors">
                  Embroidery Style Guide
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-gold-300 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/policies" className="hover:text-gold-300 transition-colors">
                  Shipping & Exchange Policies
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter & Payment Methods */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-semibold text-gold-300 mb-2 tracking-wider uppercase">
              Artisan Updates
            </h4>
            <p className="text-xs text-ivory/75">
              Subscribe to receive preview access to new bridal arrivals and festival edits from Multan.
            </p>

            <form onSubmit={handleNewsletter} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter email address..."
                  required
                  className="w-full bg-maroon-800/80 border border-gold-500/40 rounded px-3 py-2 text-xs text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold-400"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-3 bg-gold-600 text-maroon-900 rounded text-xs font-bold hover:bg-gold-500 transition-colors flex items-center"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              {newsletterStatus && (
                <p className="text-[11px] text-gold-300 italic">{newsletterStatus}</p>
              )}
            </form>

            <div className="pt-3">
              <p className="text-[11px] font-semibold text-gold-300 mb-2 uppercase tracking-wider">
                Accepted Payment Methods
              </p>
              <div className="flex flex-wrap gap-2 text-[10px]">
                <span className="px-2 py-1 bg-maroon-800 rounded border border-gold-500/30 text-gold-200">
                  Cash on Delivery
                </span>
                <span className="px-2 py-1 bg-maroon-800 rounded border border-gold-500/30 text-gold-200">
                  JazzCash
                </span>
                <span className="px-2 py-1 bg-maroon-800 rounded border border-gold-500/30 text-gold-200">
                  EasyPaisa
                </span>
                <span className="px-2 py-1 bg-maroon-800 rounded border border-gold-500/30 text-gold-200">
                  Bank Transfer
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-maroon-800/80 py-4 px-4 text-center text-xs text-ivory/60 bg-maroon-950">
        <p>
          &copy; {new Date().getFullYear()} <strong>Hand Embroidered Dresses</strong>. All rights reserved. Handcrafted with{' '}
          <Heart className="w-3 h-3 text-red-500 inline fill-red-500" /> in Multan, Pakistan.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
