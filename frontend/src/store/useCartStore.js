import { create } from 'zustand';

// Generate or retrieve guest persistent identifier
const getOrCreateGuestId = () => {
  let id = localStorage.getItem('hed_guest_id');
  if (!id) {
    id = 'guest_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem('hed_guest_id', id);
  }
  return id;
};

const savedCart = JSON.parse(localStorage.getItem('hed_cart') || '[]');
const savedCoupon = JSON.parse(localStorage.getItem('hed_coupon') || 'null');

export const useCartStore = create((set, get) => ({
  items: savedCart,
  guestId: getOrCreateGuestId(),
  isOpen: false, // MiniCart drawer open state
  coupon: savedCoupon,

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set(state => ({ isOpen: !state.isOpen })),

  addItem: (product, size = 'Standard', color = 'Default', quantity = 1) => {
    const activePrice = (product.onSale && product.salePrice) ? product.salePrice : product.price;
    const currentItems = get().items;
    const existingIndex = currentItems.findIndex(
      i => i.product === product._id && i.size === size && i.color === color
    );

    let updatedItems;
    if (existingIndex > -1) {
      updatedItems = currentItems.map((item, index) => {
        if (index === existingIndex) {
          return { ...item, quantity: item.quantity + quantity };
        }
        return item;
      });
    } else {
      updatedItems = [
        ...currentItems,
        {
          product: product._id,
          title: product.title,
          slug: product.slug,
          image: product.images?.[0]?.url || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
          size,
          color,
          price: activePrice,
          originalPrice: product.price,
          quantity,
          stock: product.stock
        }
      ];
    }

    localStorage.setItem('hed_cart', JSON.stringify(updatedItems));
    set({ items: updatedItems, isOpen: true });
  },

  updateQuantity: (productId, size, color, newQuantity) => {
    if (newQuantity <= 0) {
      get().removeItem(productId, size, color);
      return;
    }

    const updatedItems = get().items.map(item => {
      if (item.product === productId && item.size === size && item.color === color) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    localStorage.setItem('hed_cart', JSON.stringify(updatedItems));
    set({ items: updatedItems });
  },

  removeItem: (productId, size, color) => {
    const updatedItems = get().items.filter(
      item => !(item.product === productId && item.size === size && item.color === color)
    );
    localStorage.setItem('hed_cart', JSON.stringify(updatedItems));
    set({ items: updatedItems });
  },

  clearCart: () => {
    localStorage.removeItem('hed_cart');
    localStorage.removeItem('hed_coupon');
    set({ items: [], coupon: null });
  },

  applyCoupon: (couponData) => {
    localStorage.setItem('hed_coupon', JSON.stringify(couponData));
    set({ coupon: couponData });
  },

  removeCoupon: () => {
    localStorage.removeItem('hed_coupon');
    set({ coupon: null });
  },

  getSubtotal: () => {
    return get().items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },

  getTotalItemsCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  getDiscountAmount: () => {
    const coupon = get().coupon;
    if (!coupon) return 0;
    const subtotal = get().getSubtotal();
    if (coupon.discountType === 'percentage') {
      const discount = (subtotal * coupon.discountValue) / 100;
      return coupon.maxDiscount ? Math.min(discount, coupon.maxDiscount) : discount;
    }
    return coupon.calculatedDiscount || coupon.discountValue || 0;
  },

  getShippingFee: (city = '') => {
    const subtotal = get().getSubtotal();
    if (subtotal >= 5000 || subtotal === 0) return 0; // Free delivery over Rs. 5,000
    if (city && city.toLowerCase() === 'multan') return 150; // Special local Multan rate
    return 250; // Nationwide courier tariff
  },

  getGrandTotal: (city = '') => {
    const subtotal = get().getSubtotal();
    if (subtotal === 0) return 0;
    const shipping = get().getShippingFee(city);
    const discount = get().getDiscountAmount();
    return Math.max(0, subtotal + shipping - discount);
  }
}));
