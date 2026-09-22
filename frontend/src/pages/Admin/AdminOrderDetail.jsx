import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Printer,
  Truck,
  CheckCircle2,
  AlertCircle,
  Save,
  CreditCard,
  MapPin,
  Clock,
  ExternalLink
} from 'lucide-react';
import { formatPKR } from '../../utils/formatCurrency';
import { ORDER_STATUSES, PAYMENT_STATUSES } from '../../utils/constants';
import api from '../../services/api';

export const AdminOrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const [orderStatus, setOrderStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [courierName, setCourierName] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${id}`);
      const o = res.data.order;
      setOrder(o);
      setOrderStatus(o.orderStatus);
      setPaymentStatus(o.paymentStatus);
      setTrackingNumber(o.trackingNumber || '');
      setCourierName(o.courierName || 'TCS Pakistan');
      setAdminNotes(o.adminNotes || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg('');

    try {
      const res = await api.put(`/orders/admin/${id}/status`, {
        orderStatus,
        paymentStatus,
        trackingNumber,
        courierName,
        adminNotes
      });
      setOrder(res.data.order);
      setSaveMsg('Order updated successfully!');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-xs text-gray-500">Loading order details...</div>;
  }

  if (!order) {
    return <div className="text-center py-20 text-xs text-red-600">Order not found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-gray-200 gap-4">
        <div className="flex items-center gap-3">
          <Link to="/admin/orders" className="p-2 rounded hover:bg-gray-100 text-gray-600">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="font-serif text-2xl font-bold text-maroon-800">
              Order #{order.orderNumber}
            </h2>
            <p className="text-xs text-gray-500">
              Placed on {new Date(order.createdAt).toLocaleString('en-PK')}
            </p>
          </div>
        </div>

        <a
          href={`/api/orders/${order._id}/invoice`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-ivory-100 hover:bg-gold-50 border border-gold-300 text-maroon-800 rounded text-xs font-semibold flex items-center gap-1.5 shadow-sm"
        >
          <Printer className="w-3.5 h-3.5 text-gold-600" />
          <span>Print Packing Slip</span>
        </a>
      </div>

      {saveMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{saveMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Customer Info & Items */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer Address Details */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm text-xs space-y-3">
            <h3 className="font-serif font-bold text-sm text-maroon-800 uppercase tracking-wider border-b pb-2 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-gold-600" />
              <span>Customer & Delivery Details</span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-gray-400">Recipient Name</p>
                <p className="font-bold text-charcoal">{order.customer.name}</p>
              </div>
              <div>
                <p className="text-gray-400">Contact Phone</p>
                <p className="font-bold text-charcoal">{order.customer.phone}</p>
              </div>
              <div>
                <p className="text-gray-400">Email Address</p>
                <p className="text-charcoal">{order.customer.email}</p>
              </div>
              <div>
                <p className="text-gray-400">Destination City</p>
                <p className="font-bold text-maroon-800">{order.customer.city}, {order.customer.province}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-400">Street Address</p>
                <p className="text-charcoal font-medium">
                  {order.customer.streetAddress}
                  {order.customer.apartment && `, ${order.customer.apartment}`}
                </p>
              </div>
              {order.customerNotes && (
                <div className="col-span-2 bg-amber-50 p-2.5 rounded border border-amber-200">
                  <p className="font-bold text-amber-900">Customer Note:</p>
                  <p className="text-amber-800 italic">{order.customerNotes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Ordered Dresses */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm text-xs space-y-3">
            <h3 className="font-serif font-bold text-sm text-maroon-800 uppercase tracking-wider border-b pb-2">
              Ordered Products ({order.items.length})
            </h3>
            <div className="divide-y divide-gray-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.title} className="w-12 h-14 object-cover rounded border" />
                    <div>
                      <p className="font-bold text-charcoal">{item.title}</p>
                      <p className="text-[11px] text-gray-400">
                        Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-maroon-800">{formatPKR(item.total)}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-200 space-y-1.5 text-right">
              <p className="text-gray-500">Subtotal: <span className="font-semibold text-charcoal">{formatPKR(order.subtotal)}</span></p>
              <p className="text-gray-500">Delivery Fee: <span className="font-semibold text-charcoal">{order.shippingFee === 0 ? 'FREE' : formatPKR(order.shippingFee)}</span></p>
              {order.discount > 0 && <p className="text-emerald-700">Discount: -{formatPKR(order.discount)}</p>}
              <p className="font-serif text-base font-bold text-maroon-800 pt-1 border-t">
                Total Amount: {formatPKR(order.totalAmount)}
              </p>
            </div>
          </div>

          {/* Payment Proof Slip if present */}
          {order.paymentProof && (
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm text-xs space-y-3">
              <h3 className="font-serif font-bold text-sm text-maroon-800 uppercase tracking-wider border-b pb-2 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-gold-600" />
                <span>Uploaded Payment Proof Slip</span>
              </h3>
              <div className="max-w-xs border rounded overflow-hidden">
                <a href={order.paymentProof} target="_blank" rel="noopener noreferrer">
                  <img src={order.paymentProof} alt="Payment Receipt" className="w-full h-auto object-cover" />
                </a>
              </div>
              <p className="text-[11px] text-gray-400">Click image to inspect full transaction receipt.</p>
            </div>
          )}
        </div>

        {/* Right: Status Updaters & Courier Assignment */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleUpdate} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm text-xs space-y-4">
            <h3 className="font-serif font-bold text-sm text-maroon-800 uppercase tracking-wider border-b pb-2">
              Update Order Status & Dispatch
            </h3>

            <div>
              <label className="block font-semibold mb-1">Order Fulfillment Status</label>
              <select
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded font-bold"
              >
                {ORDER_STATUSES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Payment Verification Status</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded font-bold"
              >
                {PAYMENT_STATUSES.map((pst) => (
                  <option key={pst} value={pst}>{pst}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Courier Service</label>
              <input
                type="text"
                value={courierName}
                onChange={(e) => setCourierName(e.target.value)}
                placeholder="TCS Pakistan / Leopards / M&P"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Tracking Number / Consignment #</label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="e.g. 77492104910"
                className="w-full p-2 border border-gray-300 rounded font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Internal Admin Notes</label>
              <textarea
                rows={2}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="e.g. Verified JazzCash transaction ID #12345"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 bg-maroon-800 hover:bg-maroon-900 disabled:opacity-50 text-white font-serif font-bold text-xs uppercase tracking-wider rounded shadow transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4 text-gold-300" />
              <span>{saving ? 'Updating...' : 'Save Status & Notify Customer'}</span>
            </button>
          </form>

          {/* Timeline History */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm text-xs space-y-3">
            <h3 className="font-serif font-bold text-sm text-maroon-800 uppercase tracking-wider border-b pb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-gold-600" />
              <span>Order Timeline History</span>
            </h3>
            <div className="space-y-2">
              {order.timeline?.map((ev, i) => (
                <div key={i} className="p-2 bg-ivory-50 rounded border border-gray-100">
                  <span className="font-bold text-maroon-800">{ev.status}</span>
                  <p className="text-gray-500">{ev.note}</p>
                  <span className="text-[10px] text-gray-400 block mt-0.5">
                    {new Date(ev.timestamp).toLocaleString('en-PK')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
