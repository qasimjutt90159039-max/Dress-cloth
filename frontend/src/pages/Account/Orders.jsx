import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Printer, ExternalLink, Clock, ChevronRight } from 'lucide-react';
import { formatPKR } from '../../utils/formatCurrency';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import api from '../../services/api';

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my-orders');
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error('Failed to load customer orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Breadcrumbs items={[{ label: 'My Account', link: '/account/profile' }, { label: 'Order History' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gold-300/40 gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-maroon-800">
            My Order History
          </h1>
          <p className="text-xs text-charcoal-muted mt-1">
            Review status, invoices, and tracking information for all your past purchases.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-charcoal-muted">Retrieving your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-gold-300/40 text-center space-y-4">
          <Package className="w-12 h-12 text-gold-500 mx-auto" />
          <h3 className="font-serif text-xl font-bold text-maroon-800">No Orders Placed Yet</h3>
          <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
            You haven't placed any orders with us yet. Discover our authentic Multani hand embroidery!
          </p>
          <Link to="/shop" className="px-6 py-2.5 bg-maroon-800 text-white rounded text-xs font-semibold inline-block">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white p-5 rounded-xl border border-gold-300/60 shadow-sm space-y-4 hover:border-gold-500 transition-colors"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-3 border-b border-gray-100 gap-2 text-xs">
                <div>
                  <span className="font-mono font-bold text-maroon-800 text-sm">{order.orderNumber}</span>
                  <span className="text-gray-400 block sm:inline sm:ml-2">
                    {new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                    order.orderStatus === 'Delivered'
                      ? 'bg-emerald-100 text-emerald-800'
                      : order.orderStatus === 'Cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gold-100 text-gold-800'
                  }`}>
                    {order.orderStatus}
                  </span>
                  <span className="text-gray-400">|</span>
                  <span className="font-bold text-maroon-800">{formatPKR(order.totalAmount)}</span>
                </div>
              </div>

              {/* Items miniature */}
              <div className="divide-y divide-gray-50">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.title} className="w-10 h-12 object-cover rounded border" />
                      <div>
                        <p className="font-medium text-charcoal">{item.title}</p>
                        <p className="text-[10px] text-gray-400">Size: {item.size} • Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-charcoal">{formatPKR(item.total)}</span>
                  </div>
                ))}
              </div>

              {/* Action Links */}
              <div className="flex flex-wrap items-center justify-between pt-2 border-t border-gray-100 text-xs">
                <p className="text-charcoal-muted text-[11px]">
                  Payment: <strong>{order.paymentMethod}</strong> ({order.paymentStatus})
                </p>
                <div className="flex items-center gap-3 pt-2 sm:pt-0">
                  <a
                    href={`/api/orders/${order._id}/invoice`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-maroon-800 font-semibold hover:underline flex items-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5 text-gold-600" />
                    <span>Print Invoice</span>
                  </a>
                  <Link
                    to={`/order-confirmation/${order._id}`}
                    className="text-maroon-800 font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>View Confirmation</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
