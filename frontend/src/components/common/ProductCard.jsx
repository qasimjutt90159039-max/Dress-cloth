import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingBag, Star, Sparkles } from 'lucide-react';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useCartStore } from '../../store/useCartStore';
import { formatPKR } from '../../utils/formatCurrency';
import QuickViewModal from './QuickViewModal';

export const ProductCard = ({ product }) => {
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { addItem } = useCartStore();

  const [isHovered, setIsHovered] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const isLiked = isInWishlist(product._id);
  const activePrice = (product.onSale && product.salePrice) ? product.salePrice : product.price;

  // Percentage discount
  const discountPercent = product.onSale && product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const primaryImage = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80';
  const secondaryImage = product.images?.[1]?.url || primaryImage;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, product.sizes?.[0] || 'Standard', product.colors?.[0]?.name || 'Default', 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <>
      <div
        className="group relative bg-white rounded-lg border border-gold-300/40 hover:border-gold-500 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5">
          {product.onSale && (
            <span className="bg-maroon-800 text-ivory text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
          {product.isNewArrival && !product.onSale && (
            <span className="bg-emerald-800 text-ivory text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
              NEW
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-gold-600 text-maroon-900 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" /> BESTSELLER
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="absolute top-2.5 right-2.5 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-500 hover:text-red-600 hover:bg-white transition-all shadow-sm"
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 transition-colors ${isLiked ? 'fill-red-600 text-red-600' : ''}`} />
        </button>

        {/* Image Container with Zoom */}
        <Link to={`/product/${product.slug}`} className="block relative aspect-[3/4] overflow-hidden bg-ivory-100">
          <img
            src={isHovered ? secondaryImage : primaryImage}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />

          {/* Quick View Button on Hover */}
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setQuickViewOpen(true);
              }}
              className="px-3 py-1.5 bg-white text-charcoal hover:bg-gold-500 hover:text-white text-xs font-semibold rounded shadow flex items-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Quick View</span>
            </button>
            <button
              onClick={handleQuickAdd}
              className="px-3 py-1.5 bg-maroon-800 text-white hover:bg-maroon-900 text-xs font-semibold rounded shadow flex items-center gap-1.5 transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-gold-300" />
              <span>{justAdded ? 'Added!' : 'Add to Bag'}</span>
            </button>
          </div>
        </Link>

        {/* Product Meta */}
        <div className="p-3.5 flex flex-col flex-1 justify-between space-y-2">
          <div>
            <div className="flex items-center justify-between text-[11px] text-gold-700 font-semibold mb-1">
              <span className="uppercase tracking-wider truncate max-w-[150px]">
                {product.embroideryType}
              </span>
              <div className="flex items-center gap-0.5 text-gold-600 font-bold">
                <Star className="w-3 h-3 fill-gold-500 text-gold-500" />
                <span>{product.rating || 5.0}</span>
                <span className="text-gray-400 text-[10px]">({product.numReviews || 0})</span>
              </div>
            </div>

            <Link to={`/product/${product.slug}`} className="block">
              <h3 className="font-serif text-sm sm:text-base font-semibold text-charcoal group-hover:text-maroon-800 transition-colors line-clamp-2 leading-snug">
                {product.title}
              </h3>
            </Link>

            <p className="text-[11px] text-charcoal-muted mt-1">
              Fabric: <span className="text-charcoal font-medium">{product.fabric}</span>
            </p>
          </div>

          {/* Pricing */}
          <div className="pt-2 border-t border-gray-100 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-base sm:text-lg font-bold text-maroon-800">
                {formatPKR(activePrice)}
              </span>
              {product.onSale && product.salePrice && (
                <span className="text-xs text-gray-400 line-through">
                  {formatPKR(product.price)}
                </span>
              )}
            </div>

            {product.stock <= 3 && product.stock > 0 && (
              <span className="text-[10px] text-red-600 font-semibold">
                Only {product.stock} left!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewOpen && (
        <QuickViewModal
          product={product}
          isOpen={quickViewOpen}
          onClose={() => setQuickViewOpen(false)}
        />
      )}
    </>
  );
};

export default ProductCard;
