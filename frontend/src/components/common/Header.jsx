import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  Menu,
  X,
  Globe,
  ChevronDown,
  Phone,
  Sparkles,
  LogOut,
  Settings as AdminIcon,
  PackageCheck
} from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useLanguageStore } from '../../store/useLanguageStore';
import api from '../../services/api';

export const Header = () => {
  const navigate = useNavigate();
  const { toggleCart, getTotalItemsCount } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { user, isAuthenticated, isAdmin, logout } = useAuthStore();
  const { lang, toggleLanguage, t } = useLanguageStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const searchRef = useRef(null);

  const totalCartCount = getTotalItemsCount();

  // Handle Search Input with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await api.get(`/products?search=${encodeURIComponent(searchQuery)}&limit=5`);
        setSearchSuggestions(res.data.products || []);
      } catch (err) {
        setSearchSuggestions([]);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchSuggestions([]);
    }
  };

  const navLinks = [
    { name: t.home, path: '/' },
    { name: t.shop, path: '/shop' },
    { name: t.bridal, path: '/category/bridal-dresses' },
    { name: t.partyWear, path: '/category/party-wear' },
    { name: t.casualWear, path: '/category/casual-daily-wear' },
    { name: t.shawls, path: '/category/shawls-dupattas' },
    { name: t.unstitched, path: '/category/unstitched-fabric' },
    { name: t.readyToWear, path: '/category/ready-to-wear' },
    { name: t.customOrder, path: '/custom-order', highlight: true },
    { name: t.trackOrder, path: '/track-order' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-ivory/95 backdrop-blur-md border-b border-gold-400/20 shadow-sm transition-all">
      {/* Middle Branding Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-maroon-800 hover:text-gold-600 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Search Bar - Desktop */}
        <div className="hidden lg:block relative flex-1 max-w-xs" ref={searchRef}>
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-ivory-100 border border-gold-300/60 rounded-full focus:outline-none focus:border-maroon-800 focus:bg-white transition-all text-charcoal"
            />
            <Search className="w-4 h-4 text-gold-600 absolute left-3 top-2 pointer-events-none" />
          </form>

          {/* Autocomplete Dropdown */}
          {searchSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gold-200 overflow-hidden z-50">
              <div className="p-2 text-xs font-semibold text-charcoal-muted uppercase tracking-wider bg-ivory-100 border-b border-gold-100">
                Suggestions
              </div>
              {searchSuggestions.map((prod) => (
                <Link
                  key={prod._id}
                  to={`/product/${prod.slug}`}
                  onClick={() => setSearchSuggestions([])}
                  className="flex items-center gap-3 p-2.5 hover:bg-ivory-100 transition-colors border-b border-gray-100 last:border-0"
                >
                  <img
                    src={prod.images?.[0]?.url}
                    alt={prod.title}
                    className="w-10 h-12 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-charcoal truncate">{prod.title}</p>
                    <p className="text-xs text-maroon-800 font-semibold">
                      Rs. {(prod.onSale && prod.salePrice ? prod.salePrice : prod.price).toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Brand Logo & Tagline */}
        <div className="text-center flex-1 lg:flex-initial">
          <Link to="/" className="inline-block group">
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl sm:text-2xl font-serif font-bold text-maroon-800 tracking-wider group-hover:text-gold-600 transition-colors">
                HAND EMBROIDERED DRESSES
              </span>
            </div>
            <p className="text-[10px] sm:text-xs font-medium uppercase tracking-[0.25em] text-gold-700">
              MULTAN HERITAGE BOUTIQUE • PAKISTAN
            </p>
          </Link>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile Search Trigger */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="lg:hidden p-2 text-charcoal hover:text-maroon-800"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border border-gold-300 text-maroon-800 hover:bg-gold-50 transition-colors"
            title="Switch Language / زبان تبدیل کریں"
          >
            <Globe className="w-3.5 h-3.5 text-gold-600" />
            <span>{lang === 'en' ? 'اردو' : 'EN'}</span>
          </button>

          {/* Wishlist Link */}
          <Link
            to="/wishlist"
            className="relative p-2 text-charcoal hover:text-maroon-800 transition-colors"
            title={t.wishlist}
          >
            <Heart className="w-5 h-5" />
            {wishlistItems.length > 0 && (
              <span className="absolute top-1 right-1 bg-maroon-800 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          {/* Cart Trigger */}
          <button
            onClick={toggleCart}
            className="relative p-2 text-charcoal hover:text-maroon-800 transition-colors"
            title={t.cart}
            aria-label="View shopping bag"
          >
            <ShoppingBag className="w-5 h-5 text-maroon-800" />
            {totalCartCount > 0 && (
              <span className="absolute top-1 right-1 bg-gold-600 text-maroon-900 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* User Account / Dropdown */}
          <div className="relative">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 p-1.5 rounded-full hover:bg-ivory-200 text-charcoal text-xs font-medium"
                >
                  <div className="w-7 h-7 rounded-full bg-maroon-800 text-ivory flex items-center justify-center font-bold">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-charcoal-muted hidden sm:block" />
                </button>

                {userDropdownOpen && (
                  <div
                    onMouseLeave={() => setUserDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-xl border border-gold-200 py-1.5 z-50 text-xs"
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-semibold text-charcoal truncate">{user?.name}</p>
                      <p className="text-gray-500 text-[11px] truncate">{user?.email}</p>
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-maroon-800 hover:bg-gold-50 font-semibold"
                      >
                        <AdminIcon className="w-4 h-4 text-gold-600" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <Link
                      to="/account/orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-ivory-100 text-charcoal"
                    >
                      <PackageCheck className="w-4 h-4 text-gray-400" />
                      <span>My Orders</span>
                    </Link>

                    <Link
                      to="/account/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-ivory-100 text-charcoal"
                    >
                      <UserIcon className="w-4 h-4 text-gray-400" />
                      <span>Account Profile</span>
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                        navigate('/');
                      }}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 border-t border-gray-100"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t.logout}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-maroon-800 text-white hover:bg-maroon-900 transition-colors shadow-sm"
              >
                <UserIcon className="w-3.5 h-3.5 text-gold-300" />
                <span>{t.login}</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar Expansion */}
      {searchOpen && (
        <div className="lg:hidden p-3 bg-ivory-100 border-t border-gold-200">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-gold-300 rounded-full focus:outline-none focus:border-maroon-800"
            />
            <Search className="w-4 h-4 text-gold-600 absolute left-3 top-2.5" />
          </form>
        </div>
      )}

      {/* Navigation Links Bar - Desktop */}
      <nav className="hidden lg:block border-t border-gold-400/20 bg-ivory-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center space-x-7 py-2 text-xs font-medium tracking-wider uppercase">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`transition-colors py-1 relative hover:text-maroon-800 ${
                link.highlight
                  ? 'text-maroon-800 font-bold border-b-2 border-gold-500'
                  : 'text-charcoal-soft'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[110px] bg-black/50 z-50">
          <div className="bg-ivory w-4/5 max-w-sm h-full shadow-2xl p-6 overflow-y-auto">
            <div className="space-y-4 pb-6 border-b border-gold-200">
              {!isAuthenticated ? (
                <div className="flex gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2 text-xs font-semibold bg-maroon-800 text-white rounded-md"
                  >
                    {t.login}
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2 text-xs font-semibold border border-maroon-800 text-maroon-800 rounded-md"
                  >
                    {t.register}
                  </Link>
                </div>
              ) : (
                <div className="bg-ivory-200 p-3 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-maroon-800">{user?.name}</p>
                    <p className="text-[11px] text-charcoal-muted">{user?.email}</p>
                  </div>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-[11px] bg-gold-600 text-maroon-900 font-bold px-2.5 py-1 rounded"
                    >
                      Admin
                    </Link>
                  )}
                </div>
              )}
            </div>

            <div className="py-4 space-y-2">
              <p className="text-[10px] font-bold text-gold-700 tracking-wider uppercase mb-2">
                Boutique Categories
              </p>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm font-medium text-charcoal hover:text-maroon-800 border-b border-gray-100 last:border-0"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="pt-4 border-t border-gold-200 text-xs text-charcoal-muted space-y-2">
              <Link to="/about-us" onClick={() => setMobileMenuOpen(false)} className="block py-1">
                {t.aboutUs}
              </Link>
              <Link to="/contact-us" onClick={() => setMobileMenuOpen(false)} className="block py-1">
                {t.contactUs}
              </Link>
              <Link to="/blog" onClick={() => setMobileMenuOpen(false)} className="block py-1">
                {t.blog}
              </Link>
              <Link to="/faq" onClick={() => setMobileMenuOpen(false)} className="block py-1">
                {t.faq}
              </Link>
              <div className="pt-2 text-maroon-800 font-bold flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-gold-600" />
                <span>WhatsApp: 03186229753</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
