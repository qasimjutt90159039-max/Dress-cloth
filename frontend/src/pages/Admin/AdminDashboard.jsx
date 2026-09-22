import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  AlertTriangle,
  Users,
  TrendingUp,
  Package,
  Printer,
  ChevronRight,
  ExternalLink,
  Download
} from 'lucide-react';
import { formatPKR } from '../../utils/formatCurrency';
import api from '../../services/api';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/settings/dashboard-stats');
        setStats(res.data.stats);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleExportCSV = async () => {
    try {
      const res = await api.get('/orders/admin/all?limit=100');
      const orders = res.data.orders || [];

      let csv = 'OrderNumber,CustomerName,Phone,City,Status,TotalAmount,PaymentMethod,Date\n';
      orders.forEach(o => {
        csv += `"${o.orderNumber}","${o.customer.name}","${o.customer.phone}","${o.customer.city}","${o.orderStatus}",${o.totalAmount},"${o.paymentMethod}","${new Date(o.createdAt).toISOString()}"\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orders-export-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
    } catch (err) {
      console.error('Failed to export orders:', err);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-charcoal-muted">Loading boutique metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header & Export */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-maroon-800">
            Multan Boutique Overview
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time analytics for orders, sales, and artisan inventory.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-white border border-gold-300 text-maroon-800 rounded text-xs font-semibold hover:bg-gold-50 flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-gold-600" />
            <span>Export Orders to CSV</span>
          </button>
          <Link
            to="/admin/products/new"
            className="px-4 py-2 bg-maroon-800 hover:bg-maroon-900 text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow"
          >
            <Package className="w-3.5 h-3.5 text-gold-300" />
            <span>Add New Dress</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500">Total Net Revenue</p>
            <h3 className="font-serif text-2xl font-bold text-maroon-800 mt-1">
              {formatPKR(stats?.totalRevenue || 0)}
            </h3>
            <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5 mt-1">
              <TrendingUp className="w-3 h-3" /> All successful orders
            </span>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-lg">
            Rs.
          </div>
        </div>

        {/* Today's Sales */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500">Today's Sales</p>
            <h3 className="font-serif text-2xl font-bold text-maroon-800 mt-1">
              {formatPKR(stats?.todaySales || 0)}
            </h3>
            <span className="text-[10px] text-gray-500 block mt-1">
              {stats?.todayOrdersCount || 0} order(s) placed today
            </span>
          </div>
          <div className="w-12 h-12 rounded-full bg-gold-50 text-gold-700 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Orders Pending */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500">Pending Orders</p>
            <h3 className="font-serif text-2xl font-bold text-gold-700 mt-1">
              {stats?.pendingOrders || 0}
            </h3>
            <Link to="/admin/orders?status=Pending" className="text-[10px] text-maroon-800 font-bold hover:underline mt-1 block">
              Process new orders &rarr;
            </Link>
          </div>
          <div className="w-12 h-12 rounded-full bg-gold-100 text-gold-800 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Low Stock Warning */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500">Low Stock Alerts (&le;5)</p>
            <h3 className="font-serif text-2xl font-bold text-red-600 mt-1">
              {stats?.lowStockProducts || 0}
            </h3>
            <span className="text-[10px] text-gray-500 block mt-1">
              Restock required from Multan karigars
            </span>
          </div>
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Sales Trend Chart & Low Stock Side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales Bar Representation */}
        <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-gray-100">
            <h3 className="font-serif font-bold text-base text-maroon-800">
              Monthly Revenue Performance (PKR)
            </h3>
            <span className="text-xs text-gray-400">Past 6 Months</span>
          </div>

          <div className="pt-4 grid grid-cols-6 gap-3 items-end h-52">
            {stats?.salesChart?.map((chart) => {
              const maxSale = 1000000;
              const barHeight = Math.min(100, Math.max(15, (chart.sales / maxSale) * 100));
              return (
                <div key={chart.month} className="flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[10px] font-bold text-maroon-800">
                    {(chart.sales / 1000).toFixed(0)}k
                  </span>
                  <div
                    className="w-full bg-gradient-to-t from-maroon-900 to-gold-500 rounded-t-md transition-all duration-700"
                    style={{ height: `${barHeight}%` }}
                  />
                  <span className="text-xs text-gray-500 font-medium">{chart.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Low Stock Items List */}
        <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-gray-100">
            <h3 className="font-serif font-bold text-base text-maroon-800">
              Low Stock Warnings
            </h3>
            <Link to="/admin/products" className="text-xs text-maroon-800 hover:underline">
              View all
            </Link>
          </div>

          <div className="divide-y divide-gray-100 text-xs">
            {stats?.lowStockList?.map((p) => (
              <div key={p._id} className="py-2.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-charcoal truncate">{p.title}</p>
                  <p className="text-[10px] text-gray-400">SKU: {p.sku}</p>
                </div>
                <span className="font-bold text-red-600 px-2 py-0.5 bg-red-50 rounded shrink-0">
                  {p.stock} left
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
          <h3 className="font-serif font-bold text-base text-maroon-800">
            Recent Orders
          </h3>
          <Link to="/admin/orders" className="text-xs text-maroon-800 font-semibold hover:underline">
            View All Orders &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-500 border-b">
                <th className="p-3">Order Number</th>
                <th className="p-3">Customer</th>
                <th className="p-3">City</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Total Amount</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats?.recentOrders?.map((ord) => (
                <tr key={ord._id} className="hover:bg-gray-50">
                  <td className="p-3 font-mono font-bold text-maroon-800">{ord.orderNumber}</td>
                  <td className="p-3 font-medium text-charcoal">{ord.customer.name}</td>
                  <td className="p-3 text-gray-500">{ord.customer.city}</td>
                  <td className="p-3">
                    <span className="text-[11px] bg-gray-100 px-2 py-0.5 rounded text-charcoal">
                      {ord.paymentMethod}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ord.orderStatus === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : ord.orderStatus === 'Cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gold-100 text-gold-800'
                    }`}>
                      {ord.orderStatus}
                    </span>
                  </td>
                  <td className="p-3 text-right font-bold text-maroon-800">
                    {formatPKR(ord.totalAmount)}
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      to={`/admin/orders/${ord._id}`}
                      className="px-2.5 py-1 bg-ivory-200 hover:bg-gold-200 text-maroon-800 rounded font-semibold text-[11px]"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
