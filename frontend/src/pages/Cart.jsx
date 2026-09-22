import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  Tag,
  ArrowLeft
} from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { formatPKR } from '../utils/formatCurrency';
import Breadcrumbs from '../components/common/Breadcrumbs';
import api from '../services/api';

export const Cart = () => {
  const navigate = useNavigate();
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    getShippingFee,
    getDiscountAmount,
    getGrandTotal,
    coupon,
    applyCoupon,
    removeCoupon
  } = useCartStore();

  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState({ error: '', success: '' });
  const [loadingCoupon, setLoadingCoupon] = useState(false);

  const subtotal = getSubtotal();
  const shipping = getShippingFee();
  const discount = getDiscountAmount();
  const grandTotal = getGrandTotal();

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setLoadingCoupon(true);
    setCouponMsg({ error: '', success: '' });

    try {
      const res = await api.post('/coupons/validate', {
        code: couponCode.trim(),
        orderAmount: subtotal
      });
      applyCoupon(res.data.coupon);
      setCouponMsg({ error: '', success: `Coupon "${res.data.coupon.code}" applied!` });
      setCouponCode('');
    } catch (err) {
      setCouponMsg({ error: err.response?.data?.message || 'Invalid coupon', success: '' });
    } finally {
      setLoadingCoupon(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <div className="w-20 h-20 bg-ivory-200 text-maroon-800 rounded-full mx-auto flex items-center justify-center">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-maroon-800">Your Bag is Empty</h2>
        <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
          Explore our authentic Multan hand-embroidered collection and add pieces to your bag.
        </p>
        <Link
          to="/shop"
          className="px-8 py-3 bg-maroon-800 text-ivory font-serif font-bold text-xs uppercase tracking-wider rounded inline-block hover:bg-maroon-900 transition-colors"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: 'Shopping Bag' }]} />

      <h1 className="font-serif text-3xl font-bold text-maroon-800 my-6">
        Your Shopping Bag ({items.reduce((s, i) => s + i.quantity, 0)} Items)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Items List Column */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-xl border border-gold-300/60 shadow-sm overflow-hidden">
            <div className="hidden sm:grid grid-cols-12 gap-4 p-4 bg-ivory-100 text-xs font-serif font-bold text-maroon-800 border-b border-gold-200">
              <div className="col-span-6">Item</div>
              <div className="col-span-2 text-center">Unit Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            <div className="divide-y divide-gray-100">
              {items.map((item, idx) => (
                <div key={`${item.product}-${item.size}-${item.color}-${idx}`} className="p-4 flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center">
                  <div className="col-span-6 flex items-center gap-4 w-full">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-20 object-cover rounded border border-gold-200 shrink-0"
                    />
                    <div className="space-y-1">
                      <Link to={`/product/${item.slug}`} className="font-serif font-bold text-sm text-charcoal hover:text-maroon-800 line-clamp-1">
                        {item.title}
                      </Link>
                      <p className="text-[11px] text-charcoal-muted">
                        Size: <span className="text-maroon-800 font-semibold">{item.size}</span> | Color: {item.color}
                      </p>
                      <button
                        onClick={() => removeItem(item.product, item.size, item.color)}
                        className="text-[11px] text-red-600 hover:underline flex items-center gap-1 pt-1"
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </div>

                  <div className="col-span-2 text-center text-xs font-semibold text-charcoal hidden sm:block">
                    {formatPKR(item.price)}
                  </div>

                  <div className="col-span-2 flex items-center justify-center">
                    <div className="flex items-center border border-gray-300 rounded text-xs">
                      <button
                        onClick={() => updateQuantity(item.product, item.size, item.color, item.quantity - 1)}
                        className="p-1 px-2 text-gray-500 hover:bg-gray-100"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product, item.size, item.color, item.quantity + 1)}
                        className="p-1 px-2 text-gray-500 hover:bg-gray-100"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="col-span-2 text-right text-xs font-bold text-maroon-800 w-full sm:w-auto">
                    {formatPKR(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <Link to="/shop" className="text-xs font-semibold text-maroon-800 hover:underline flex items-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Continue Shopping</span>
            </Link>
            <button
              onClick={clearCart}
              className="text-xs text-red-600 hover:underline"
            >
              Clear Entire Bag
            </button>
          </div>
        </div>

        {/* Order Summary Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gold-300/60 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-lg text-maroon-800 pb-2 border-b border-gold-200">
              Order Summary
            </h3>

            {/* Coupon Code Input */}
            <div>
              <label className="block text-xs font-semibold mb-1.5">Have a Discount Coupon?</label>
              {coupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon "{coupon.code}" applied</span>
                  </div>
                  <button onClick={removeCoupon} className="text-red-500 hover:underline text-[11px] font-bold">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="e.g. WELCOME10"
                    className="flex-1 px-3 py-2 text-xs border border-gold-300 rounded uppercase focus:outline-none focus:border-maroon-800"
                  />
                  <button
                    type="submit"
                    disabled={loadingCoupon}
                    className="px-4 py-2 bg-maroon-800 text-white font-bold text-xs rounded hover:bg-maroon-900 disabled:opacity-50"
                  >
                    {loadingCoupon ? '...' : 'Apply'}
                  </button>
                </form>
              )}
              {couponMsg.error && <p className="text-[11px] text-red-600 mt-1">{couponMsg.error}</p>}
              {couponMsg.success && <p className="text-[11px] text-emerald-700 mt-1">{couponMsg.success}</p>}
            </div>

            {/* Breakdown */}
            <div className="space-y-2 text-xs border-t border-gray-100 pt-3">
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Subtotal</span>
                <span className="font-semibold text-charcoal">{formatPKR(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Shipping (Nationwide Express)</span>
                <span className="font-semibold text-charcoal">
                  {shipping === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : formatPKR(shipping)}
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

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 bg-maroon-800 hover:bg-maroon-900 text-white font-serif font-bold text-xs uppercase tracking-wider rounded shadow-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>Proceed to Secure Checkout</span>
              <ArrowRight className="w-4 h-4 text-gold-300" />
            </button>

            <p className="text-[10px] text-center text-charcoal-muted">
              🚚 Fast nationwide courier delivery across all Pakistani cities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
