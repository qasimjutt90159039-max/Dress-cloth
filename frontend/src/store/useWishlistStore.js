import { create } from 'zustand';

const savedWishlist = JSON.parse(localStorage.getItem('hed_wishlist') || '[]');

export const useWishlistStore = create((set, get) => ({
  items: savedWishlist,

  toggleWishlist: (product) => {
    const current = get().items;
    const exists = current.some(p => p._id === product._id);
    let updated;

    if (exists) {
      updated = current.filter(p => p._id !== product._id);
    } else {
      updated = [...current, product];
    }

    localStorage.setItem('hed_wishlist', JSON.stringify(updated));
    set({ items: updated });
    return !exists;
  },

  isInWishlist: (productId) => {
    return get().items.some(p => p._id === productId);
  },

  removeFromWishlist: (productId) => {
    const updated = get().items.filter(p => p._id !== productId);
    localStorage.setItem('hed_wishlist', JSON.stringify(updated));
    set({ items: updated });
  }
}));
