import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle,
  Package,
  Printer,
  MessageCircle,
  Truck,
  ArrowRight,
  MapPin,
  Calendar
} from 'lucide-react';
import { formatPKR } from '../utils/formatCurrency';
import api from '../services/api';

export const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data.order);
      } catch (err) {
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-serif text-lg text-maroon-800">Finalizing your order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-maroon-800">Order Not Found</h2>
        <Link to="/" className="px-6 py-2.5 bg-maroon-800 text-white rounded text-xs font-semibold inline-block">
          Return to Home
        </Link>
      </div>
    );
  }

  const encodedWhatsAppMsg = encodeURIComponent(
    `As-salamu alaykum Hand Embroidered Dresses team! I just placed order #${order.orderNumber} for Rs. ${order.totalAmount.toLocaleString()} to ${order.customer.city}. Please confirm my booking.`
  );
  const whatsAppUrl = `https://wa.me/923186229753?text=${encodedWhatsAppMsg}`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Success Badge */}
      <div className="text-center space-y-3 pb-8 border-b border-gold-300/40">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full mx-auto flex items-center justify-center shadow-inner">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-800">
          Shukriya, {order.customer.name}!
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-muted max-w-md mx-auto">
          Your order has been safely placed with our Multan workshop. Our artisans are preparing your hand-embroidered garments.
        </p>

        <div className="inline-block bg-ivory-100 border border-gold-400/60 px-5 py-2.5 rounded-lg text-sm font-bold text-maroon-800 shadow-sm mt-2">
          Order Number: <span className="text-gold-700 tracking-wider font-mono">{order.orderNumber}</span>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
        <a
          href={whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow transition-colors"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span>Confirm on WhatsApp (03186229753)</span>
        </a>

        <a
          href={`/api/orders/${order._id}/invoice`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3.5 bg-ivory-100 hover:bg-gold-50 border border-gold-400 text-maroon-800 rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
        >
          <Printer className="w-4 h-4 text-gold-600" />
          <span>Print Official Invoice / Slip</span>
        </a>
      </div>

      {/* Order Details Card */}
      <div className="bg-white rounded-xl border border-gold-300/60 shadow-sm p-6 space-y-6">
        {/* Customer & Shipping Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pb-4 border-b border-gray-100">
          <div>
            <span className="font-bold text-maroon-800 uppercase tracking-wider block mb-1">
              Delivery Address
            </span>
            <p className="text-charcoal font-medium">{order.customer.name}</p>
            <p className="text-charcoal-muted">
              {order.customer.streetAddress}
              {order.customer.apartment && `, ${order.customer.apartment}`}
            </p>
            <p className="text-charcoal-muted">
              {order.customer.city}, {order.customer.province} {order.customer.postalCode}
            </p>
            <p className="text-charcoal-muted">Phone: {order.customer.phone}</p>
          </div>

          <div>
            <span className="font-bold text-maroon-800 uppercase tracking-wider block mb-1">
              Payment & Shipping
            </span>
            <p className="text-charcoal">
              Payment: <strong>{order.paymentMethod}</strong> ({order.paymentStatus})
            </p>
            <p className="text-charcoal">
              Courier: <strong>{order.courierName || 'TCS Express'}</strong>
            </p>
            <p className="text-charcoal">
              Status: <span className="font-bold text-emerald-800">{order.orderStatus}</span>
            </p>
            <p className="text-charcoal-muted mt-1">
              Estimated Delivery: <strong>2 - 4 business days</strong>
            </p>
          </div>
        </div>

        {/* Ordered Items Table */}
        <div className="space-y-3">
          <h3 className="font-serif font-bold text-sm text-maroon-800 uppercase tracking-wider">
            Items Ordered
          </h3>
          <div className="divide-y divide-gray-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img src={item.image} alt={item.title} className="w-12 h-14 object-cover rounded border" />
                  <div>
                    <p className="font-semibold text-charcoal">{item.title}</p>
                    <p className="text-[11px] text-gray-400">
                      Size: {item.size} | Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-maroon-800">{formatPKR(item.total)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="space-y-1.5 text-xs pt-4 border-t border-gray-100 text-charcoal">
          <div className="flex justify-between">
            <span className="text-charcoal-muted">Subtotal</span>
            <span>{formatPKR(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-charcoal-muted">Courier Shipping Fee</span>
            <span>{order.shippingFee === 0 ? 'FREE' : formatPKR(order.shippingFee)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-800 font-semibold">
              <span>Discount</span>
              <span>-{formatPKR(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-serif font-bold text-maroon-800 pt-2 border-t border-gold-200">
            <span>Total Amount (PKR)</span>
            <span>{formatPKR(order.totalAmount)}</span>
          </div>
        </div>
      </div>

      <div className="text-center pt-8">
        <Link
          to="/track-order"
          className="text-xs font-semibold text-maroon-800 hover:text-gold-700 underline"
        >
          Track this parcel anytime using Order Number & Phone &rarr;
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
