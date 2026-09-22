import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Layers,
  ClipboardList,
  Users,
  Percent,
  Star,
  Scissors,
  Mail,
  BookOpen,
  Image as ImageIcon,
  Settings as SettingsIcon,
  LogOut,
  ChevronRight,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: ShoppingBag },
    { name: 'Categories', path: '/admin/categories', icon: Layers },
    { name: 'Orders', path: '/admin/orders', icon: ClipboardList },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Coupons & Discounts', path: '/admin/coupons', icon: Percent },
    { name: 'Reviews Moderation', path: '/admin/reviews', icon: Star },
    { name: 'Custom Tailoring', path: '/admin/custom-orders', icon: Scissors },
    { name: 'Messages Inbox', path: '/admin/messages', icon: Mail },
    { name: 'Heritage Blog', path: '/admin/blogs', icon: BookOpen },
    { name: 'Banners & Sliders', path: '/admin/banners', icon: ImageIcon },
    { name: 'Store Settings', path: '/admin/settings', icon: SettingsIcon },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-maroon-900 text-ivory flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-4 border-b border-maroon-800 flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-2">
              <span className="text-lg font-serif font-bold text-gold-400">
                HED ADMIN
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-ivory/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-4 py-2 text-[10px] uppercase font-bold text-gold-500 tracking-wider">
            Boutique Operations
          </div>

          {/* Nav list */}
          <nav className="px-2 space-y-1 overflow-y-auto max-h-[calc(100vh-160px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-maroon-800 text-gold-300 font-bold border-l-4 border-gold-500'
                      : 'text-ivory/80 hover:bg-maroon-800/60 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 text-gold-500 shrink-0" />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-maroon-800 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between text-xs text-gold-300 hover:text-white px-2 py-1.5 rounded bg-maroon-800/40"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Live Store</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-xs text-red-300 hover:text-red-100 hover:bg-red-950/40 px-2 py-1.5 rounded transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:text-maroon-800"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-sm sm:text-base font-serif font-bold text-maroon-800">
              Hand Embroidered Dresses Management Portal
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-charcoal">{user?.name || 'Store Manager'}</p>
              <p className="text-[11px] text-gray-500">Administrator</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-maroon-800 text-white font-bold flex items-center justify-center text-xs">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-8 flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
