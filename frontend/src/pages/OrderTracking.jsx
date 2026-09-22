import React, { useState } from 'react';
import { Search, Package, CheckCircle2, Clock, Truck, MapPin, AlertCircle } from 'lucide-react';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { formatPKR } from '../utils/formatCurrency';
import api from '../services/api';

export const OrderTracking = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderNumber || !phone) return;

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const res = await api.post('/orders/track', {
        orderNumber: orderNumber.trim(),
        phone: phone.trim()
      });
      setOrder(res.data.order);
    } catch (err) {
      setError(err.response?.data?.message || 'No order found with this Order Number and Phone.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: 'Order Registered', status: 'Pending' },
    { title: 'Confirmed by Multan Boutique', status: 'Confirmed' },
    { title: 'Artisan Preparing / Stitching', status: 'Processing' },
    { title: 'Dispatched with Courier', status: 'Shipped' },
    { title: 'Delivered to Doorstep', status: 'Delivered' }
  ];

  const getStepIndex = (currentStatus) => {
    switch (currentStatus) {
      case 'Pending': return 0;
      case 'Confirmed': return 1;
      case 'Processing': return 2;
      case 'Shipped': return 3;
      case 'Delivered': return 4;
      default: return 0;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumbs items={[{ label: 'Order Tracking' }]} />

      <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
        <h1 className="font-serif text-3xl font-bold text-maroon-800">
          Track Your Multani Dress Parcel
        </h1>
        <p className="text-xs text-charcoal-muted leading-relaxed">
          Enter your Order Number (e.g. HED-2026-000123) and the mobile phone number used during checkout to check live shipment status.
        </p>
      </div>

      {/* Tracking Search Form */}
      <div className="bg-white p-6 rounded-xl border border-gold-300/60 shadow-sm mb-8">
        <form onSubmit={handleTrack} className="grid grid-cols-1 sm:grid-cols-12 gap-4 text-xs">
          <div className="sm:col-span-5">
            <label className="block font-semibold mb-1">Order Number *</label>
            <input
              type="text"
              required
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
              placeholder="HED-2026-000123"
              className="w-full p-2.5 bg-ivory-50 border border-gold-300 rounded font-mono uppercase focus:outline-none focus:border-maroon-800"
            />
          </div>

          <div className="sm:col-span-5">
            <label className="block font-semibold mb-1">Contact Phone *</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="03186229753"
              className="w-full p-2.5 bg-ivory-50 border border-gold-300 rounded focus:outline-none focus:border-maroon-800"
            />
          </div>

          <div className="sm:col-span-2 flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-maroon-800 text-white font-serif font-bold uppercase rounded hover:bg-maroon-900 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{loading ? '...' : 'Track'}</span>
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Results Display */}
      {order && (
        <div className="bg-white rounded-xl border border-gold-300/60 shadow-lg p-6 space-y-8 animate-in fade-in duration-300">
          {/* Header Summary */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-gold-200 gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-gold-700">Parcel Status</span>
              <h3 className="font-serif text-2xl font-bold text-maroon-800">{order.orderStatus}</h3>
              <p className="text-xs text-gray-400">Order: {order.orderNumber} • Placed {new Date(order.createdAt).toLocaleDateString('en-PK')}</p>
            </div>

            {order.trackingNumber ? (
              <div className="bg-ivory-100 p-3 rounded-lg border border-gold-300 text-xs">
                <p className="text-gray-500">Courier: <strong>{order.courierName}</strong></p>
                <p className="font-mono font-bold text-maroon-800">Tracking #: {order.trackingNumber}</p>
              </div>
            ) : (
              <div className="text-xs text-charcoal-muted bg-ivory-100 p-2.5 rounded">
                Awaiting courier dispatch from Multan hub
              </div>
            )}
          </div>

          {/* Progress Timeline Tracker */}
          <div className="py-4">
            <div className="grid grid-cols-5 gap-2 text-center text-xs">
              {steps.map((step, idx) => {
                const isCompleted = idx <= getStepIndex(order.orderStatus);
                const isCurrent = idx === getStepIndex(order.orderStatus);
                return (
                  <div key={idx} className="flex flex-col items-center space-y-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                        isCompleted
                          ? 'bg-maroon-800 text-white ring-4 ring-gold-200'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                    </div>
                    <span className={`text-[11px] font-medium leading-tight ${isCurrent ? 'text-maroon-800 font-bold' : 'text-charcoal-muted'}`}>
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Event Log */}
          {order.timeline && order.timeline.length > 0 && (
            <div className="space-y-2 pt-4 border-t border-gray-100">
              <h4 className="text-xs font-bold uppercase text-charcoal tracking-wider">
                Status History Log
              </h4>
              <div className="space-y-2">
                {order.timeline.map((event, i) => (
                  <div key={i} className="text-xs flex items-start gap-3 p-2 bg-ivory-50 rounded border border-gray-100">
                    <Clock className="w-3.5 h-3.5 text-gold-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-maroon-800 mr-2">{event.status}:</span>
                      <span className="text-charcoal-muted">{event.note}</span>
                      <span className="text-[10px] text-gray-400 block mt-0.5">
                        {new Date(event.timestamp).toLocaleString('en-PK')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary of Items in Shipment */}
          <div className="pt-4 border-t border-gray-100">
            <h4 className="text-xs font-bold uppercase text-charcoal tracking-wider mb-3">
              Shipment Contents ({order.items.length} items)
            </h4>
            <div className="space-y-2">
              {order.items.map((it, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs p-2 bg-white rounded border">
                  <span>{it.title} ({it.size}) × {it.quantity}</span>
                  <span className="font-bold text-maroon-800">{formatPKR(it.total)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
