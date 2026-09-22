import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '../components/common/ProductCard';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { ProductCardSkeleton } from '../components/common/SkeletonLoader';
import api from '../services/api';

export const CategoryPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/categories/slug/${slug}`);
        setCategory(res.data.category);
        setProducts(res.data.products || []);
      } catch (err) {
        console.error('Error fetching category:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="font-serif text-3xl font-bold text-maroon-800">Category Not Found</h2>
        <p className="text-xs text-charcoal-muted">This collection may have been relocated or updated.</p>
        <Link to="/shop" className="px-6 py-2.5 bg-maroon-800 text-white rounded text-xs font-semibold inline-block">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Category Hero Banner */}
      <div className="relative h-64 sm:h-80 bg-maroon-950 overflow-hidden flex items-center justify-center text-center">
        <img
          src={category.image}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-maroon-950 via-maroon-950/60 to-transparent" />
        <div className="relative z-10 max-w-2xl px-4 space-y-3">
          <span className="text-[10px] uppercase font-bold text-gold-400 tracking-[0.3em] bg-maroon-900/60 px-3 py-1 rounded-full border border-gold-400/30">
            Multan Heritage Collection
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-ivory">
            {category.name}
          </h1>
          <p className="text-xs sm:text-sm text-ivory/80 leading-relaxed max-w-lg mx-auto">
            {category.description}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ label: category.name }]} />

        <div className="flex items-center justify-between my-6 pb-2 border-b border-gold-300/40">
          <p className="text-xs text-charcoal-muted font-medium">
            Showing {products.length} exclusive pieces
          </p>
          <Link
            to={`/shop?category=${category.slug}`}
            className="text-xs font-semibold text-maroon-800 hover:text-gold-700"
          >
            Apply Filters & Sorting &rarr;
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gold-200">
            <p className="text-sm font-semibold text-charcoal">New pieces being crafted for this collection.</p>
            <Link to="/shop" className="mt-3 inline-block text-xs text-maroon-800 font-bold hover:underline">
              Explore other collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
