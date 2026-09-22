import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Upload,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Phone
} from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { PROVINCES, CITIES_BY_PROVINCE, ALL_PAKISTANI_CITIES } from '../utils/pakistaniLocations';
import { formatPKR } from '../utils/formatCurrency';
import Breadcrumbs from '../components/common/Breadcrumbs';
import api from '../services/api';

export const Checkout = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const {
    items,
    getSubtotal,
    getShippingFee,
    getDiscountAmount,
    getGrandTotal,
    coupon,
    clearCart
  } = useCartStore();

  const [customer, setCustomer] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    streetAddress: user?.addresses?.[0]?.streetAddress || '',
    apartment: user?.addresses?.[0]?.apartment || '',
    province: user?.addresses?.[0]?.province || 'Punjab',
    city: user?.addresses?.[0]?.city || 'Multan',
    postalCode: user?.addresses?.[0]?.postalCode || ''
  });

  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [customerNotes, setCustomerNotes] = useState('');
  const [paymentProofFile, setPaymentProofFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const subtotal = getSubtotal();
  const shippingFee = getShippingFee(customer.city);
  const discount = getDiscountAmount();
  const grandTotal = Math.max(0, subtotal + shippingFee - discount);

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const availableCities = CITIES_BY_PROVINCE[customer.province] || ALL_PAKISTANI_CITIES;

  const handleInputChange = (field, value) => {
    setCustomer(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'province') {
        updated.city = CITIES_BY_PROVINCE[value]?.[0] || 'Multan';
      }
      return updated;
    });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!customer.name || !customer.phone || !customer.streetAddress || !customer.city) {
      setError('Please provide your full delivery name, contact phone, and street address.');
      return;
    }

    setLoading(true);

    try {
      // 1. Create order
      const orderPayload = {
        customer,
        items,
        paymentMethod,
        customerNotes,
        couponCode: coupon?.code || null,
        discountAmount: discount
      };

      const res = await api.post('/orders', orderPayload);
      const createdOrder = res.data.order;

      // 2. Upload payment proof if provided
      if (paymentProofFile && createdOrder._id) {
        const formData = new FormData();
        formData.append('paymentProof', paymentProofFile);
        await api.post(`/orders/${createdOrder._id}/payment-proof`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      // 3. Clear cart and navigate to confirmation
      clearCart();
      navigate(`/order-confirmation/${createdOrder._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: 'Bag', link: '/cart' }, { label: 'Checkout' }]} />

      <h1 className="font-serif text-3xl font-bold text-maroon-800 my-6">
        Secure Checkout
      </h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-xs text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Shipping and Payment Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Delivery Address Section */}
            <div className="bg-white p-6 rounded-xl border border-gold-300/60 shadow-sm space-y-4">
              <h2 className="font-serif font-bold text-lg text-maroon-800 flex items-center gap-2 pb-2 border-b border-gold-200">
                <Truck className="w-5 h-5 text-gold-600" />
                <span>1. Delivery Information (Pakistan)</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Full Recipient Name *</label>
                  <input
                    type="text"
                    required
                    value={customer.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g. Fatima Khan"
                    className="w-full p-2.5 bg-ivory-50 border border-gold-300 rounded focus:bg-white focus:outline-none focus:border-maroon-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={customer.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="03186229753"
                    className="w-full p-2.5 bg-ivory-50 border border-gold-300 rounded focus:bg-white focus:outline-none focus:border-maroon-800"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={customer.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="orders@gmail.com"
                    className="w-full p-2.5 bg-ivory-50 border border-gold-300 rounded focus:bg-white focus:outline-none focus:border-maroon-800"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold mb-1">Street Address / House No. / Area *</label>
                  <input
                    type="text"
                    required
                    value={customer.streetAddress}
                    onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                    placeholder="House / Flat No., Street, Sector, Landmark..."
                    className="w-full p-2.5 bg-ivory-50 border border-gold-300 rounded focus:bg-white focus:outline-none focus:border-maroon-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Province *</label>
                  <select
                    value={customer.province}
                    onChange={(e) => handleInputChange('province', e.target.value)}
                    className="w-full p-2.5 bg-ivory-50 border border-gold-300 rounded focus:bg-white focus:outline-none focus:border-maroon-800 font-medium"
                  >
                    {PROVINCES.map((prov) => (
                      <option key={prov} value={prov}>{prov}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">City *</label>
                  <select
                    value={customer.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full p-2.5 bg-ivory-50 border border-gold-300 rounded focus:bg-white focus:outline-none focus:border-maroon-800 font-medium"
                  >
                    {availableCities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Postal Code (Optional)</label>
                  <input
                    type="text"
                    value={customer.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    placeholder="e.g. 66000"
                    className="w-full p-2.5 bg-ivory-50 border border-gold-300 rounded"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Order Notes (Optional)</label>
                  <input
                    type="text"
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    placeholder="Any special instructions for the tailor or courier..."
                    className="w-full p-2.5 bg-ivory-50 border border-gold-300 rounded"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="bg-white p-6 rounded-xl border border-gold-300/60 shadow-sm space-y-4">
              <h2 className="font-serif font-bold text-lg text-maroon-800 flex items-center gap-2 pb-2 border-b border-gold-200">
                <CreditCard className="w-5 h-5 text-gold-600" />
                <span>2. Select Payment Method</span>
              </h2>

              <div className="space-y-3 text-xs">
                {/* Cash on Delivery */}
                <label className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  paymentMethod === 'Cash on Delivery'
                    ? 'border-maroon-800 bg-maroon-50/20'
                    : 'border-gray-200 hover:border-gold-300'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Cash on Delivery"
                        checked={paymentMethod === 'Cash on Delivery'}
                        onChange={() => setPaymentMethod('Cash on Delivery')}
                        className="w-4 h-4 text-maroon-800"
                      />
                      <div>
                        <p className="font-bold text-sm text-charcoal">Cash on Delivery (COD)</p>
                        <p className="text-charcoal-muted">Pay in cash directly to TCS/Leopards rider when you inspect the parcel.</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      Most Popular
                    </span>
                  </div>
                </label>

                {/* JazzCash */}
                <label className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  paymentMethod === 'JazzCash'
                    ? 'border-maroon-800 bg-maroon-50/20'
                    : 'border-gray-200 hover:border-gold-300'
                }`}>
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="JazzCash"
                      checked={paymentMethod === 'JazzCash'}
                      onChange={() => setPaymentMethod('JazzCash')}
                      className="w-4 h-4 text-maroon-800 mt-1"
                    />
                    <div className="space-y-1">
                      <p className="font-bold text-sm text-charcoal">JazzCash Mobile Wallet</p>
                      <p className="text-charcoal-muted">
                        Transfer to <strong>03186229753</strong> (Title: <strong>Hand Embroidered Dresses</strong>).
                      </p>
                    </div>
                  </div>
                </label>

                {/* EasyPaisa */}
                <label className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  paymentMethod === 'EasyPaisa'
                    ? 'border-maroon-800 bg-maroon-50/20'
                    : 'border-gray-200 hover:border-gold-300'
                }`}>
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="EasyPaisa"
                      checked={paymentMethod === 'EasyPaisa'}
                      onChange={() => setPaymentMethod('EasyPaisa')}
                      className="w-4 h-4 text-maroon-800 mt-1"
                    />
                    <div className="space-y-1">
                      <p className="font-bold text-sm text-charcoal">EasyPaisa Mobile Account</p>
                      <p className="text-charcoal-muted">
                        Transfer to <strong>03186229753</strong> (Title: <strong>Hand Embroidered Dresses</strong>).
                      </p>
                    </div>
                  </div>
                </label>

                {/* Bank Transfer */}
                <label className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  paymentMethod === 'Bank Transfer'
                    ? 'border-maroon-800 bg-maroon-50/20'
                    : 'border-gray-200 hover:border-gold-300'
                }`}>
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Bank Transfer"
                      checked={paymentMethod === 'Bank Transfer'}
                      onChange={() => setPaymentMethod('Bank Transfer')}
                      className="w-4 h-4 text-maroon-800 mt-1"
                    />
                    <div className="space-y-1">
                      <p className="font-bold text-sm text-charcoal">Direct Bank Transfer</p>
                      <p className="text-charcoal-muted">
                        Bank: <strong>Meezan Bank Ltd.</strong> | Title: <strong>Hand Embroidered Dresses</strong> | Account: <strong>01020304050607</strong>
                      </p>
                    </div>
                  </div>
                </label>
              </div>

              {/* Receipt Upload if Prepaid */}
              {paymentMethod !== 'Cash on Delivery' && (
                <div className="mt-4 p-4 bg-gold-50/50 rounded-lg border border-gold-300 space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-bold text-maroon-800">
                    <Upload className="w-4 h-4 text-gold-600" />
                    <span>Attach Payment Screenshot / Receipt (Optional)</span>
                  </div>
                  <p className="text-[11px] text-charcoal-muted">
                    You can upload your transaction slip now, or send it to us via WhatsApp on <strong>03186229753</strong> after placing the order.
                  </p>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setPaymentProofFile(e.target.files[0])}
                    className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-maroon-800 file:text-white hover:file:bg-maroon-900"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gold-300/60 shadow-sm space-y-4 sticky top-28">
              <h3 className="font-serif font-bold text-lg text-maroon-800 pb-2 border-b border-gold-200">
                Order Review ({items.length} items)
              </h3>

              {/* Items Miniature */}
              <div className="max-h-56 overflow-y-auto divide-y divide-gray-100 pr-1 text-xs">
                {items.map((item, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={item.image} alt={item.title} className="w-10 h-12 object-cover rounded" />
                      <div className="truncate">
                        <p className="font-medium text-charcoal truncate">{item.title}</p>
                        <p className="text-[10px] text-gray-400">Qty: {item.quantity} | {item.size}</p>
                      </div>
                    </div>
                    <span className="font-bold text-maroon-800 shrink-0">
                      {formatPKR(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs border-t border-gray-100 pt-3 text-charcoal">
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">Subtotal</span>
                  <span className="font-semibold">{formatPKR(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">Nationwide Courier</span>
                  <span className="font-semibold">
                    {shippingFee === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : formatPKR(shippingFee)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-semibold">
                    <span>Discount</span>
                    <span>-{formatPKR(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-serif font-bold text-maroon-800 pt-3 border-t border-gold-200">
                  <span>Grand Total</span>
                  <span>{formatPKR(grandTotal)}</span>
                </div>
              </div>

              {/* Submit Order Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-maroon-800 hover:bg-maroon-900 disabled:opacity-50 text-white font-serif font-bold text-sm tracking-wider uppercase rounded shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Registering Order...' : 'Place Order Now'}</span>
                <ArrowRight className="w-4 h-4 text-gold-300" />
              </button>

              <div className="pt-2 text-[10px] text-charcoal-muted text-center space-y-1">
                <p>🔒 100% Secure Checkout Guaranteed</p>
                <p>Support / WhatsApp: <strong>03186229753</strong></p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
