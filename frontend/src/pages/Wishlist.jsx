import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlistStore } from '../store/useWishlistStore';
import { useCartStore } from '../store/useCartStore';
import { formatPKR } from '../utils/formatCurrency';
import Breadcrumbs from '../components/common/Breadcrumbs';

export const Wishlist = () => {
  const { items, removeFromWishlist } = useWishlistStore();
  const { addItem } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-ivory-200 text-maroon-800 mx-auto flex items-center justify-center">
          <Heart className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-maroon-800">Your Wishlist is Empty</h2>
        <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
          Save your favourite Multani bridal, party wear, and lawn dresses to keep track of them.
        </p>
        <Link
          to="/shop"
          className="px-8 py-3 bg-maroon-800 text-white font-serif font-bold text-xs uppercase tracking-wider rounded inline-block hover:bg-maroon-900 transition-colors"
        >
          Discover Dresses
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: 'Saved Wishlist' }]} />

      <div className="flex items-center justify-between my-6 pb-3 border-b border-gold-300/40">
        <div>
          <h1 className="font-serif text-3xl font-bold text-maroon-800">My Wishlist</h1>
          <p className="text-xs text-charcoal-muted mt-1">{items.length} dresses saved for later</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {items.map((prod) => {
          const activePrice = (prod.onSale && prod.salePrice) ? prod.salePrice : prod.price;
          return (
            <div
              key={prod._id}
              className="bg-white rounded-lg border border-gold-300/40 overflow-hidden shadow-sm flex flex-col justify-between"
            >
              <div className="relative aspect-[3/4] bg-ivory-100 overflow-hidden group">
                <Link to={`/product/${prod.slug}`}>
                  <img
                    src={prod.images?.[0]?.url || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'}
                    alt={prod.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                <button
                  onClick={() => removeFromWishlist(prod._id)}
                  className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/90 text-red-600 hover:bg-red-50 shadow-sm"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-gold-700 uppercase tracking-wider block">
                    {prod.embroideryType}
                  </span>
                  <Link to={`/product/${prod.slug}`}>
                    <h3 className="font-serif text-sm font-semibold text-charcoal hover:text-maroon-800 line-clamp-2 mt-0.5">
                      {prod.title}
                    </h3>
                  </Link>
                  <p className="font-serif font-bold text-sm text-maroon-800 mt-1">
                    {formatPKR(activePrice)}
                  </p>
                </div>

                <button
                  onClick={() => addItem(prod, prod.sizes?.[0] || 'Standard', prod.colors?.[0]?.name || 'Default', 1)}
                  className="w-full py-2 bg-maroon-800 hover:bg-maroon-900 text-white font-serif font-bold text-xs uppercase tracking-wider rounded flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-gold-300" />
                  <span>Add to Bag</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;
