import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Share2,
  Check,
  Star,
  Ruler,
  MessageCircle,
  Truck,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Info,
  Copy
} from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { formatPKR } from '../utils/formatCurrency';
import Breadcrumbs from '../components/common/Breadcrumbs';
import SizeGuideModal from '../components/common/SizeGuideModal';
import ProductCard from '../components/common/ProductCard';
import { ProductCardSkeleton } from '../components/common/SkeletonLoader';
import api from '../services/api';

export const ProductDetail = () => {
  const { slug } = useParams();
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('Standard');
  const [selectedColor, setSelectedColor] = useState('Default');
  const [quantity, setQuantity] = useState(1);
  const [sizeModalOpen, setSizeModalOpen] = useState(false);
  const [addedMessage, setAddedMessage] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // New review form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewName, setReviewName] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/slug/${slug}`);
        const p = res.data.product;
        setProduct(p);
        setSelectedImage(p.images?.[0]?.url || '');
        setSelectedSize(p.sizes?.[0] || 'Standard');
        setSelectedColor(p.colors?.[0]?.name || 'Default');

        // Fetch related products
        const relRes = await api.get(`/products/${p._id}/related`);
        setRelated(relRes.data.products || []);

        // Fetch reviews
        const revRes = await api.get(`/reviews/product/${p._id}`);
        setReviews(revRes.data.reviews || []);

        // Track recently viewed
        const recents = JSON.parse(localStorage.getItem('hed_recently_viewed') || '[]');
        const filtered = recents.filter(item => item._id !== p._id);
        filtered.unshift(p);
        localStorage.setItem('hed_recently_viewed', JSON.stringify(filtered.slice(0, 6)));

      } catch (err) {
        console.error('Error loading product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-pulse">
          <div className="aspect-[3/4] bg-ivory-200 rounded-xl" />
          <div className="space-y-4">
            <div className="h-4 bg-ivory-200 rounded w-1/4" />
            <div className="h-8 bg-ivory-200 rounded w-3/4" />
            <div className="h-6 bg-ivory-200 rounded w-1/3" />
            <div className="h-24 bg-ivory-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-maroon-800">Dress Not Found</h2>
        <p className="text-xs text-charcoal-muted">This dress is no longer available in our active catalog.</p>
        <Link to="/shop" className="px-6 py-2.5 bg-maroon-800 text-white rounded text-xs font-semibold inline-block">
          Explore Other Dresses
        </Link>
      </div>
    );
  }

  const isLiked = isInWishlist(product._id);
  const activePrice = (product.onSale && product.salePrice) ? product.salePrice : product.price;

  const handleAddToCart = () => {
    addItem(product, selectedSize, selectedColor, quantity);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;

    try {
      const res = await api.post('/reviews', {
        productId: product._id,
        customerName: reviewName,
        rating: reviewRating,
        comment: reviewComment
      });
      setReviews([res.data.review, ...reviews]);
      setReviewSubmitted(true);
      setReviewName('');
      setReviewComment('');
    } catch (err) {
      console.error('Failed to submit review:', err);
    }
  };

  // WhatsApp Inquiry URL
  const whatsAppProductMessage = encodeURIComponent(
    `As-salamu alaykum! I am inquiring about "${product.title}" (SKU: ${product.sku}) listed at Rs. ${activePrice.toLocaleString()} on your website. Is this in stock for delivery? Link: ${window.location.href}`
  );
  const whatsAppInquiryUrl = `https://wa.me/923186229753?text=${whatsAppProductMessage}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Shop', link: '/shop' },
          { label: product.category?.name || 'Category', link: `/category/${product.category?.slug}` },
          { label: product.title }
        ]}
      />

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-6">
        {/* Gallery Column */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-gold-300/60 shadow-lg bg-ivory-100 group">
            <img
              src={selectedImage || product.images?.[0]?.url}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-zoom-in"
            />

            {product.onSale && (
              <span className="absolute top-4 left-4 bg-maroon-800 text-ivory text-xs font-bold px-3 py-1 rounded shadow">
                SALE
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img.url)}
                  className={`w-20 h-24 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImage === img.url
                      ? 'border-maroon-800 ring-2 ring-gold-400'
                      : 'border-gold-200/60 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information & Purchase Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gold-700 tracking-wider uppercase bg-gold-100 px-2.5 py-1 rounded">
                {product.embroideryType}
              </span>
              <span className="text-xs text-charcoal-muted">SKU: {product.sku}</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal mt-2">
              {product.title}
            </h1>

            {/* Rating and Reviews Counter */}
            <div className="flex items-center gap-2 mt-2 text-xs">
              <div className="flex text-gold-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating || 5) ? 'fill-gold-500' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-charcoal">{product.rating || 5.0}</span>
              <span className="text-gray-400">({product.numReviews || reviews.length} customer reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mt-4">
              <span className="font-serif text-3xl font-bold text-maroon-800">
                {formatPKR(activePrice)}
              </span>
              {product.onSale && product.salePrice && (
                <span className="text-base text-gray-400 line-through">
                  {formatPKR(product.price)}
                </span>
              )}
            </div>

            <p className="text-xs text-emerald-800 font-semibold mt-1">
              ✓ Tax included. Free shipping on orders over Rs. 5,000 across Pakistan.
            </p>
          </div>

          <p className="text-xs text-charcoal leading-relaxed">
            {product.description}
          </p>

          {/* Size & Color Selection */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            {/* Size Selector with Modal Link */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-charcoal uppercase tracking-wider">
                    Select Size: <span className="text-maroon-800 font-semibold">{selectedSize}</span>
                  </label>
                  <button
                    onClick={() => setSizeModalOpen(true)}
                    className="text-xs text-maroon-800 font-semibold hover:underline flex items-center gap-1"
                  >
                    <Ruler className="w-3.5 h-3.5 text-gold-600" />
                    <span>View Size Guide</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-4 py-2 text-xs font-semibold rounded border transition-all ${
                        selectedSize === s
                          ? 'bg-maroon-800 border-maroon-800 text-white shadow-sm'
                          : 'bg-white border-gray-300 text-charcoal hover:border-gold-400'
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
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-2">
                  Color: <span className="text-maroon-800 font-semibold">{selectedColor}</span>
                </label>
                <div className="flex gap-2.5">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      title={c.name}
                      className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                        selectedColor === c.name
                          ? 'border-maroon-800 ring-2 ring-gold-400 scale-110'
                          : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    >
                      {selectedColor === c.name && (
                        <Check className="w-4 h-4 text-white drop-shadow" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                Quantity:
              </label>
              <div className="inline-flex border border-gray-300 rounded overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 bg-ivory-100 hover:bg-ivory-200 text-charcoal font-bold"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-xs font-bold flex items-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 bg-ivory-100 hover:bg-ivory-200 text-charcoal font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Stock status */}
            <div>
              {product.stock > 0 ? (
                <p className="text-xs text-emerald-800 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                  <span>In Stock ready for immediate dispatch from Multan</span>
                </p>
              ) : (
                <p className="text-xs text-red-600 font-bold">
                  Sold Out (Available via Bespoke Custom Order)
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 py-3.5 bg-maroon-800 hover:bg-maroon-900 disabled:opacity-50 text-white font-serif font-bold text-sm tracking-wider uppercase rounded shadow-lg transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-gold-300" />
                <span>{addedMessage ? 'Added to Bag!' : 'Add to Shopping Bag'}</span>
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3.5 rounded border transition-colors ${
                  isLiked ? 'bg-red-50 border-red-200 text-red-600' : 'border-gray-300 text-gray-500 hover:text-maroon-800'
                }`}
                title="Save to Wishlist"
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-600' : ''}`} />
              </button>
            </div>

            {/* Direct WhatsApp Ask Button */}
            <a
              href={whatsAppInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs uppercase tracking-wider rounded flex items-center justify-center gap-2 shadow transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Ask About This Dress on WhatsApp (03186229753)</span>
            </a>
          </div>

          {/* Share & Trust Assurances */}
          <div className="pt-4 border-t border-gray-100 space-y-3 text-xs text-charcoal">
            <div className="grid grid-cols-2 gap-3 bg-ivory-100 p-3.5 rounded-lg border border-gold-200/50">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-gold-600 shrink-0" />
                <span>Cash on Delivery (COD)</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-gold-600 shrink-0" />
                <span>7-Day Easy Exchange</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold-600 shrink-0" />
                <span>100% Multan Handcrafted</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold-600 shrink-0" />
                <span>Pure Grade Fabric</span>
              </div>
            </div>

            {/* Share Link */}
            <div className="flex items-center justify-between text-xs text-charcoal-muted pt-1">
              <span>Share this dress:</span>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1 text-maroon-800 hover:underline font-semibold"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fabric Care & Artisan Craft Narrative Tabs */}
      <div className="mt-16 border-t border-gold-300/40 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl border border-gold-300/40 shadow-sm space-y-3">
            <h3 className="font-serif text-xl font-bold text-maroon-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold-600" />
              <span>Artisan Needlework Story</span>
            </h3>
            <p className="text-xs text-charcoal leading-relaxed">
              {product.craftStory}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gold-300/40 shadow-sm space-y-3">
            <h3 className="font-serif text-xl font-bold text-maroon-800 flex items-center gap-2">
              <Info className="w-5 h-5 text-gold-600" />
              <span>Fabric & Preservation Care</span>
            </h3>
            <p className="text-xs text-charcoal leading-relaxed">
              {product.careInstructions}
            </p>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="mt-16 border-t border-gold-300/40 pt-10">
        <h3 className="font-serif text-2xl font-bold text-maroon-800 mb-6">
          Customer Reviews ({reviews.length})
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Reviews List */}
          <div className="lg:col-span-7 space-y-4">
            {reviews.length === 0 ? (
              <p className="text-xs text-charcoal-muted bg-white p-6 rounded-lg border border-gray-200 text-center">
                Be the first to review this handcrafted dress!
              </p>
            ) : (
              reviews.map((rev) => (
                <div key={rev._id} className="bg-white p-4 rounded-lg border border-gold-200/60 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-maroon-800">{rev.customerName}</span>
                    <div className="flex text-gold-500">
                      {Array.from({ length: rev.rating }).map((_, r) => (
                        <Star key={r} className="w-3.5 h-3.5 fill-gold-500" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-charcoal leading-relaxed">{rev.comment}</p>
                  <span className="text-[10px] text-gray-400 block">
                    Verified Buyer • {new Date(rev.createdAt).toLocaleDateString('en-PK')}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Add Review Form */}
          <div className="lg:col-span-5 bg-ivory-100 p-6 rounded-xl border border-gold-300/60 shadow-sm space-y-4">
            <h4 className="font-serif font-bold text-lg text-maroon-800">
              Leave a Review
            </h4>

            {reviewSubmitted ? (
              <p className="text-xs text-emerald-800 font-bold bg-emerald-50 p-3 rounded">
                Thank you for your feedback! Your review has been recorded.
              </p>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-medium mb-1">Your Rating:</label>
                  <div className="flex gap-1 text-gold-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="p-1"
                      >
                        <Star className={`w-5 h-5 ${star <= reviewRating ? 'fill-gold-500' : 'text-gray-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-medium mb-1">Your Name & City:</label>
                  <input
                    type="text"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="e.g. Fatima Tariq (Multan)"
                    required
                    className="w-full p-2 bg-white border border-gold-300 rounded text-xs"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Review Comments:</label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={3}
                    placeholder="Share your thoughts on the needlework, fabric softness, and delivery..."
                    required
                    className="w-full p-2 bg-white border border-gold-300 rounded text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-maroon-800 text-white font-serif font-bold uppercase rounded text-xs hover:bg-maroon-900 transition-colors"
                >
                  Submit Review
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-16 border-t border-gold-300/40 pt-10">
          <h3 className="font-serif text-2xl font-bold text-maroon-800 mb-6">
            You May Also Admire
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {related.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        </div>
      )}

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={sizeModalOpen}
        onClose={() => setSizeModalOpen(false)}
      />
    </div>
  );
};

export default ProductDetail;
