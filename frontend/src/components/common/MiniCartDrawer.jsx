import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Sparkles,
  Tag
} from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { formatPKR } from '../../utils/formatCurrency';
import api from '../../services/api';

export const MiniCartDrawer = () => {
  const navigate = useNavigate();
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    getSubtotal,
    getShippingFee,
    getDiscountAmount,
    getGrandTotal,
    coupon,
    applyCoupon,
    removeCoupon
  } = useCartStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  if (!isOpen) return null;

  const subtotal = getSubtotal();
  const shippingFee = getShippingFee();
  const discount = getDiscountAmount();
  const grandTotal = getGrandTotal();

  // Free shipping progress calculation (Threshold: Rs. 5,000)
  const freeShippingThreshold = 5000;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setCouponLoading(true);
    setCouponError('');
    setCouponSuccess('');

    try {
      const res = await api.post('/coupons/validate', {
        code: couponInput.trim(),
        orderAmount: subtotal
      });
      applyCoupon(res.data.coupon);
      setCouponSuccess(`Coupon "${res.data.coupon.code}" applied!`);
      setCouponInput('');
    } catch (err) {
      setCouponError(err.response?.data?.message || 'Invalid coupon code');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleCheckoutClick = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark overlay backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-gold-300">
          {/* Header */}
          <div className="p-4 bg-ivory-100 border-b border-gold-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-maroon-800">
              <ShoppingBag className="w-5 h-5 text-gold-600" />
              <h2 className="font-serif font-bold text-lg tracking-wide">
                Your Shopping Bag ({items.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1 rounded-full text-charcoal-muted hover:text-maroon-800 hover:bg-ivory-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-gold-50 p-3 border-b border-gold-200 text-xs">
            {remainingForFreeShipping > 0 ? (
              <p className="text-maroon-800 mb-1.5 font-medium">
                Add <span className="font-bold">{formatPKR(remainingForFreeShipping)}</span> more to unlock{' '}
                <span className="text-emerald-800 font-bold">FREE DELIVERY</span> across Pakistan!
              </p>
            ) : (
              <p className="text-emerald-800 font-bold flex items-center gap-1 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                Congratulations! You qualified for FREE NATIONWIDE DELIVERY!
              </p>
            )}
            <div className="w-full bg-gold-200/60 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gold-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 divide-y divide-gray-100">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-ivory-200 mx-auto flex items-center justify-center text-gold-600">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-charcoal">Your bag is empty</h3>
                <p className="text-xs text-charcoal-muted max-w-xs mx-auto">
                  Explore our authentic Multan hand-embroidered collection and add timeless dresses to your wardrobe.
                </p>
                <button
                  onClick={() => {
                    closeCart();
                    navigate('/shop');
                  }}
                  className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider bg-maroon-800 text-white rounded-md hover:bg-maroon-900 transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              items.map((item, idx) => (
                <div key={`${item.product}-${item.size}-${item.color}-${idx}`} className="py-3.5 flex gap-3">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-20 object-cover rounded border border-gold-200/60"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-medium text-charcoal line-clamp-1">{item.title}</h4>
                    <p className="text-[11px] text-charcoal-muted mt-0.5">
                      Size: <span className="font-semibold text-maroon-800">{item.size}</span> | Color: {item.color}
                    </p>
                    <p className="text-xs font-bold text-maroon-800 mt-1">
                      {formatPKR(item.price)}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-gray-300 rounded">
                        <button
                          onClick={() => updateQuantity(item.product, item.size, item.color, item.quantity - 1)}
                          className="p-1 text-gray-500 hover:text-maroon-800"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product, item.size, item.color, item.quantity + 1)}
                          className="p-1 text-gray-500 hover:text-maroon-800"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Remove item */}
                      <button
                        onClick={() => removeItem(item.product, item.size, item.color)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bottom Summary & Actions */}
          {items.length > 0 && (
            <div className="p-4 bg-ivory-50 border-t border-gold-200 space-y-3">
              {/* Coupon Input */}
              {coupon ? (
                <div className="flex items-center justify-between p-2 bg-emerald-50 border border-emerald-200 rounded text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon "{coupon.code}" applied (-{formatPKR(discount)})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-red-500 font-bold hover:underline text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter Coupon (e.g. WELCOME10)"
                    className="flex-1 text-xs border border-gold-300 rounded px-3 py-1.5 focus:outline-none focus:border-maroon-800 uppercase"
                  />
                  <button
                    type="submit"
                    disabled={couponLoading}
                    className="px-3 py-1.5 text-xs font-semibold bg-maroon-800 text-white rounded hover:bg-maroon-900 disabled:opacity-50"
                  >
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </form>
              )}

              {couponError && <p className="text-[11px] text-red-600">{couponError}</p>}
              {couponSuccess && <p className="text-[11px] text-emerald-700">{couponSuccess}</p>}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-charcoal">
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">Subtotal</span>
                  <span className="font-semibold">{formatPKR(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">Estimated Delivery</span>
                  <span className="font-semibold">
                    {shippingFee === 0 ? <span className="text-emerald-700">FREE</span> : formatPKR(shippingFee)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-800">
                    <span>Discount</span>
                    <span className="font-semibold">-{formatPKR(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-maroon-800 pt-1.5 border-t border-gold-200">
                  <span>Grand Total</span>
                  <span>{formatPKR(grandTotal)}</span>
                </div>
              </div>

              {/* Direct Checkout Button */}
              <button
                onClick={handleCheckoutClick}
                className="w-full py-3 bg-maroon-800 hover:bg-maroon-900 text-ivory font-serif font-bold text-sm tracking-wider uppercase rounded flex items-center justify-center gap-2 shadow-lg shadow-maroon-900/20 transition-colors"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-gold-400" />
              </button>

              <p className="text-[10px] text-center text-charcoal-muted">
                🔒 Safe & Secure Checkout | Cash on Delivery Available Nationwide
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MiniCartDrawer;
