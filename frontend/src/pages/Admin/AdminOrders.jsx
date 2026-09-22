import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Printer, ExternalLink, Filter, Package, AlertCircle } from 'lucide-react';
import { formatPKR } from '../../utils/formatCurrency';
import Pagination from '../../components/common/Pagination';
import api from '../../services/api';

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let url = `/orders/admin/all?page=${currentPage}&limit=12`;
      if (statusFilter) url += `&status=${statusFilter}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      const res = await api.get(url);
      setOrders(res.data.orders || []);
      setTotal(res.data.total || 0);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error('Error fetching admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchOrders();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-maroon-800">
            Customer Orders Management
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Total {total} orders registered across Pakistan.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order #, customer, phone..."
            className="p-2 border border-gray-300 rounded w-full sm:w-64"
          />
          <button type="submit" className="px-3 bg-maroon-800 text-white rounded font-bold">
            <Search className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="w-full sm:w-auto flex items-center gap-2">
          <label className="text-gray-500">Order Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="p-2 border border-gray-300 rounded font-medium"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-600 border-b">
                <th className="p-3">Order Number</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Destination City</th>
                <th className="p-3">Date</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Order Status</th>
                <th className="p-3 text-right">Amount</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-gray-400">Loading orders...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-gray-400">No orders found.</td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-gray-50">
                    <td className="p-3">
                      <Link
                        to={`/admin/orders/${ord._id}`}
                        className="font-mono font-bold text-maroon-800 hover:underline"
                      >
                        {ord.orderNumber}
                      </Link>
                    </td>
                    <td className="p-3">
                      <p className="font-semibold text-charcoal">{ord.customer.name}</p>
                      <p className="text-[10px] text-gray-400">{ord.customer.phone}</p>
                    </td>
                    <td className="p-3 text-gray-600 font-medium">{ord.customer.city}</td>
                    <td className="p-3 text-gray-500">
                      {new Date(ord.createdAt).toLocaleDateString('en-PK')}
                    </td>
                    <td className="p-3">
                      <span className="block font-medium">{ord.paymentMethod}</span>
                      <span className={`text-[10px] font-bold ${
                        ord.paymentStatus === 'Paid' ? 'text-emerald-700' : 'text-amber-700'
                      }`}>
                        ({ord.paymentStatus})
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
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/api/orders/${ord._id}/invoice`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-gray-400 hover:text-maroon-800"
                          title="Print Invoice"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </a>
                        <Link
                          to={`/admin/orders/${ord._id}`}
                          className="px-2.5 py-1 bg-ivory-200 hover:bg-gold-200 text-maroon-800 rounded font-semibold text-[11px]"
                        >
                          Details
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default AdminOrders;
