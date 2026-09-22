import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, Heart, Check, ArrowRight } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { formatPKR } from '../../utils/formatCurrency';

export const QuickViewModal = ({ product, isOpen, onClose }) => {
  if (!isOpen || !product) return null;

  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'Standard');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || 'Default');
  const [selectedImage, setSelectedImage] = useState(product.images?.[0]?.url);
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);

  const isLiked = isInWishlist(product._id);
  const activePrice = (product.onSale && product.salePrice) ? product.salePrice : product.price;

  const handleAddToCart = () => {
    addItem(product, selectedSize, selectedColor, quantity);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl border border-gold-300 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-maroon-800 shadow-sm transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Gallery */}
          <div className="p-6 bg-ivory-100 flex flex-col justify-between">
            <div className="aspect-[3/4] rounded-lg overflow-hidden border border-gold-200 bg-white mb-3">
              <img
                src={selectedImage || product.images?.[0]?.url}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img.url)}
                    className={`w-14 h-16 rounded overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImage === img.url ? 'border-maroon-800 ring-1 ring-maroon-800' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-gold-700 uppercase tracking-widest bg-gold-100 px-2 py-0.5 rounded">
                  {product.embroideryType}
                </span>
                <span className="text-xs text-gray-400">SKU: {product.sku}</span>
              </div>

              <h3 className="font-serif text-xl font-bold text-charcoal">{product.title}</h3>

              <div className="flex items-baseline gap-2 mt-2">
                <span className="font-serif text-2xl font-bold text-maroon-800">
                  {formatPKR(activePrice)}
                </span>
                {product.onSale && product.salePrice && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatPKR(product.price)}
                  </span>
                )}
              </div>

              <p className="text-xs text-charcoal-muted mt-3 line-clamp-3 leading-relaxed">
                {product.description}
              </p>

              <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                {/* Size Selector */}
                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1.5">
                      Select Size: <span className="text-maroon-800">{selectedSize}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          className={`px-3 py-1.5 text-xs font-medium rounded border transition-all ${
                            selectedSize === s
                              ? 'border-maroon-800 bg-maroon-800 text-white font-bold'
                              : 'border-gray-200 bg-white text-charcoal hover:border-gold-400'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Selector */}
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1.5">
                      Color: <span className="text-maroon-800">{selectedColor}</span>
                    </label>
                    <div className="flex gap-2">
                      {product.colors.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => setSelectedColor(c.name)}
                          title={c.name}
                          className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center ${
                            selectedColor === c.name ? 'border-maroon-800 ring-2 ring-gold-400 scale-110' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: c.hex }}
                        >
                          {selectedColor === c.name && (
                            <Check className="w-3.5 h-3.5 text-white drop-shadow" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-4 border-t border-gray-100">
              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 bg-maroon-800 hover:bg-maroon-900 text-white text-xs font-serif font-bold uppercase tracking-wider rounded flex items-center justify-center gap-2 shadow transition-colors"
                >
                  <ShoppingBag className="w-4 h-4 text-gold-300" />
                  <span>{addedMessage ? 'Added to Bag!' : 'Add to Bag'}</span>
                </button>
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3 rounded border transition-colors ${
                    isLiked ? 'bg-red-50 border-red-200 text-red-600' : 'border-gray-300 text-gray-500 hover:text-maroon-800'
                  }`}
                  title="Save to Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-600' : ''}`} />
                </button>
              </div>

              <div className="text-center pt-1">
                <Link
                  to={`/product/${product.slug}`}
                  onClick={onClose}
                  className="text-xs text-maroon-800 hover:text-gold-700 font-semibold inline-flex items-center gap-1"
                >
                  <span>View Full Product Details & Sizing</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
