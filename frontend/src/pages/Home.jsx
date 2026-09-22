import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSlider from '../components/home/HeroSlider';
import FeaturedCategories from '../components/home/FeaturedCategories';
import EmbroideryGrid from '../components/home/EmbroideryGrid';
import ProductStorySection from '../components/home/ProductStorySection';
import ArtisanCraftSection from '../components/home/ArtisanCraftSection';
import Testimonials from '../components/home/Testimonials';
import LookbookGallery from '../components/home/LookbookGallery';
import Newsletter from '../components/home/Newsletter';
import TrustBadges from '../components/common/TrustBadges';
import ProductCard from '../components/common/ProductCard';
import { ProductCardSkeleton } from '../components/common/SkeletonLoader';
import { ArrowRight, Sparkles } from 'lucide-react';
import api from '../services/api';

export const Home = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const [resNew, resBest] = await Promise.all([
          api.get('/products?newArrival=true&limit=8'),
          api.get('/products?bestSeller=true&limit=8')
        ]);
        setNewArrivals(resNew.data.products || []);
        setBestSellers(resBest.data.products || []);
      } catch (err) {
        console.error('Failed to load products from API:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, []);

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Hero Banner Slider */}
      <HeroSlider />

      {/* Trust Badges */}
      <TrustBadges />

      {/* Featured Categories */}
      <FeaturedCategories />

      {/* New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-gold-300/40 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-gold-700 font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-gold-600" />
              <span>Fresh from Multan Karigars</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-800">
              New Arrivals Collection
            </h2>
          </div>
          <Link
            to="/shop?newArrival=true"
            className="text-xs font-serif font-bold text-maroon-800 hover:text-gold-700 flex items-center gap-1 uppercase tracking-wider"
          >
            <span>View All New Arrivals</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Shop by Embroidery Type Tile Grid */}
      <EmbroideryGrid />

      {/* Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-gold-300/40 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-gold-700 font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-gold-600" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-800">
              Best Selling Masterpieces
            </h2>
          </div>
          <Link
            to="/shop?bestSeller=true"
            className="text-xs font-serif font-bold text-maroon-800 hover:text-gold-700 flex items-center gap-1 uppercase tracking-wider"
          >
            <span>View All Best Sellers</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {bestSellers.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Product Stories (Behind the Stitches) */}
      <ProductStorySection />

      {/* Multan Heritage & Artisan Story */}
      <ArtisanCraftSection />

      {/* Customer Testimonials */}
      <Testimonials />

      {/* Instagram Lookbook Gallery */}
      <LookbookGallery />

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
};

export default Home;
