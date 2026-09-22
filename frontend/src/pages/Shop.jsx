import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Filter,
  Grid,
  List,
  SlidersHorizontal,
  X,
  RotateCcw,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import ProductCard from '../components/common/ProductCard';
import Breadcrumbs from '../components/common/Breadcrumbs';
import Pagination from '../components/common/Pagination';
import { ProductCardSkeleton } from '../components/common/SkeletonLoader';
import { formatPKR } from '../utils/formatCurrency';
import api from '../services/api';

export const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Filter options loaded from meta endpoint
  const [filterMeta, setFilterMeta] = useState({
    categories: [],
    embroideryTypes: [],
    fabrics: [],
    sizes: ["XS", "S", "M", "L", "XL", "XXL", "Unstitched"],
    minPrice: 2500,
    maxPrice: 65000
  });

  // Query state from searchParams
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const currentCategory = searchParams.get('category') || '';
  const currentEmbroidery = searchParams.get('embroideryType') || '';
  const currentFabric = searchParams.get('fabric') || '';
  const currentSize = searchParams.get('size') || '';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentSearch = searchParams.get('search') || '';
  const currentInStock = searchParams.get('inStock') === 'true';
  const currentOnSale = searchParams.get('onSale') === 'true';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';

  // Fetch filter metadata once
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const res = await api.get('/products/meta/filters');
        if (res.data.filters) {
          setFilterMeta(res.data.filters);
        }
      } catch (err) {
        console.error('Failed to load filter metadata:', err);
      }
    };
    fetchMeta();
  }, []);

  // Fetch products when query params change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const query = searchParams.toString();
        const res = await api.get(`/products?${query}&limit=12`);
        setProducts(res.data.products || []);
        setTotalCount(res.data.total || 0);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchParams]);

  // Update query params helper
  const updateQuery = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === '' || value === null || value === undefined) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    // Always reset page to 1 on filter changes
    if (key !== 'page') {
      newParams.delete('page');
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters =
    currentCategory ||
    currentEmbroidery ||
    currentFabric ||
    currentSize ||
    currentSearch ||
    currentInStock ||
    currentOnSale ||
    currentMinPrice ||
    currentMaxPrice;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'Shop All Products' }]} />

      {/* Page Title & Banner */}
      <div className="mb-8 text-center sm:text-left flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-4 border-b border-gold-300/40">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-800">
            Handcrafted Boutique Collection
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
            Showing {totalCount} authentic Pakistani hand-embroidered dresses from Multan.
          </p>
        </div>

        {/* Sorting & View Mode Controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded bg-maroon-800 text-white"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <label className="text-charcoal-muted hidden sm:inline">Sort By:</label>
            <select
              value={currentSort}
              onChange={(e) => updateQuery('sort', e.target.value)}
              className="px-3 py-2 text-xs bg-white border border-gold-300 rounded focus:outline-none focus:border-maroon-800 text-charcoal font-medium"
            >
              <option value="newest">Newest Additions</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="popularity">Most Popular</option>
            </select>
          </div>

          {/* Grid/List View Toggle */}
          <div className="hidden sm:flex border border-gold-300 rounded overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-colors ${
                viewMode === 'grid' ? 'bg-maroon-800 text-white' : 'bg-white text-gray-500 hover:bg-gold-50'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition-colors ${
                viewMode === 'list' ? 'bg-maroon-800 text-white' : 'bg-white text-gray-500 hover:bg-gold-50'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="mb-6 flex flex-wrap items-center gap-2 bg-ivory-100 p-3 rounded-lg border border-gold-200 text-xs">
          <span className="font-bold text-maroon-800">Active Filters:</span>
          {currentSearch && (
            <span className="px-2.5 py-1 bg-white rounded-full border border-gold-300 flex items-center gap-1">
              Search: "{currentSearch}"
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateQuery('search', '')} />
            </span>
          )}
          {currentCategory && (
            <span className="px-2.5 py-1 bg-white rounded-full border border-gold-300 flex items-center gap-1">
              Category: {currentCategory}
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateQuery('category', '')} />
            </span>
          )}
          {currentEmbroidery && (
            <span className="px-2.5 py-1 bg-white rounded-full border border-gold-300 flex items-center gap-1">
              Craft: {currentEmbroidery}
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateQuery('embroideryType', '')} />
            </span>
          )}
          {currentFabric && (
            <span className="px-2.5 py-1 bg-white rounded-full border border-gold-300 flex items-center gap-1">
              Fabric: {currentFabric}
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateQuery('fabric', '')} />
            </span>
          )}
          {currentSize && (
            <span className="px-2.5 py-1 bg-white rounded-full border border-gold-300 flex items-center gap-1">
              Size: {currentSize}
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateQuery('size', '')} />
            </span>
          )}
          {currentOnSale && (
            <span className="px-2.5 py-1 bg-maroon-800 text-white rounded-full flex items-center gap-1">
              On Sale
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateQuery('onSale', '')} />
            </span>
          )}
          <button
            onClick={clearAllFilters}
            className="text-red-600 font-bold hover:underline ml-2 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Reset All
          </button>
        </div>
      )}

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block space-y-6">
          <div className="bg-white p-5 rounded-xl border border-gold-300/60 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-serif font-bold text-base text-maroon-800 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-gold-600" />
                <span>Filters</span>
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-red-600 hover:underline font-medium"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Availability / Sale Toggles */}
            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentInStock}
                  onChange={(e) => updateQuery('inStock', e.target.checked ? 'true' : '')}
                  className="rounded text-maroon-800 focus:ring-maroon-800 w-4 h-4"
                />
                <span className="font-medium text-charcoal">In Stock Only</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentOnSale}
                  onChange={(e) => updateQuery('onSale', e.target.checked ? 'true' : '')}
                  className="rounded text-maroon-800 focus:ring-maroon-800 w-4 h-4"
                />
                <span className="font-medium text-maroon-800 font-bold">On Sale / Discounted</span>
              </label>
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal pb-1 border-b border-gray-100">
                Categories
              </h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 text-xs">
                {filterMeta.categories?.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => updateQuery('category', currentCategory === cat.slug ? '' : cat.slug)}
                    className={`w-full text-left py-1 px-2 rounded transition-colors flex justify-between ${
                      currentCategory === cat.slug
                        ? 'bg-maroon-800 text-white font-bold'
                        : 'text-charcoal-soft hover:bg-ivory-100'
                    }`}
                  >
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Embroidery Types */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal pb-1 border-b border-gray-100">
                Embroidery Craft
              </h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 text-xs">
                {filterMeta.embroideryTypes?.map((type) => (
                  <button
                    key={type}
                    onClick={() => updateQuery('embroideryType', currentEmbroidery === type ? '' : type)}
                    className={`w-full text-left py-1 px-2 rounded transition-colors ${
                      currentEmbroidery === type
                        ? 'bg-maroon-800 text-white font-bold'
                        : 'text-charcoal-soft hover:bg-ivory-100'
                    }`}
                  >
                    <span>{type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Fabric Filter */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal pb-1 border-b border-gray-100">
                Fabric
              </h4>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 text-xs">
                {filterMeta.fabrics?.map((fab) => (
                  <button
                    key={fab}
                    onClick={() => updateQuery('fabric', currentFabric === fab ? '' : fab)}
                    className={`w-full text-left py-1 px-2 rounded transition-colors ${
                      currentFabric === fab
                        ? 'bg-maroon-800 text-white font-bold'
                        : 'text-charcoal-soft hover:bg-ivory-100'
                    }`}
                  >
                    <span>{fab}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal pb-1 border-b border-gray-100">
                Size
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {filterMeta.sizes?.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => updateQuery('size', currentSize === sz ? '' : sz)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded border transition-colors ${
                      currentSize === sz
                        ? 'bg-maroon-800 border-maroon-800 text-white'
                        : 'border-gray-200 bg-white text-charcoal hover:border-gold-400'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal pb-1 border-b border-gray-100">
                Price Range (PKR)
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-gray-500">Min Rs.</label>
                  <input
                    type="number"
                    value={currentMinPrice}
                    placeholder="Min"
                    onChange={(e) => updateQuery('minPrice', e.target.value)}
                    className="w-full p-1.5 border border-gold-300 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500">Max Rs.</label>
                  <input
                    type="number"
                    value={currentMaxPrice}
                    placeholder="Max"
                    onChange={(e) => updateQuery('maxPrice', e.target.value)}
                    className="w-full p-1.5 border border-gold-300 rounded text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid / List */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-xl border border-gold-200 p-12 text-center space-y-4 shadow-sm">
              <Sparkles className="w-10 h-10 text-gold-500 mx-auto" />
              <h3 className="font-serif text-2xl font-bold text-maroon-800">
                No Dresses Found
              </h3>
              <p className="text-xs text-charcoal-muted max-w-md mx-auto">
                We couldn't find any dresses matching your exact filter selections. Try clearing one or more filters or browse all our collections.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-6 py-2.5 bg-maroon-800 text-white font-semibold text-xs rounded hover:bg-maroon-900 transition-colors uppercase tracking-wider"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6'
                  : 'space-y-4'
              }
            >
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => updateQuery('page', page)}
          />
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 overflow-hidden">
          <div
            onClick={() => setMobileFilterOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-white p-6 shadow-2xl overflow-y-auto flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h3 className="font-serif font-bold text-lg text-maroon-800">Filters</h3>
                  <button onClick={() => setMobileFilterOpen(false)}>
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase text-charcoal">Categories</h4>
                  <div className="space-y-1 text-xs">
                    {filterMeta.categories?.map((cat) => (
                      <button
                        key={cat._id}
                        onClick={() => {
                          updateQuery('category', currentCategory === cat.slug ? '' : cat.slug);
                          setMobileFilterOpen(false);
                        }}
                        className={`block w-full text-left py-1.5 px-2 rounded ${
                          currentCategory === cat.slug ? 'bg-maroon-800 text-white font-bold' : ''
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Embroidery Types */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase text-charcoal">Embroidery Craft</h4>
                  <div className="space-y-1 text-xs">
                    {filterMeta.embroideryTypes?.map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          updateQuery('embroideryType', currentEmbroidery === type ? '' : type);
                          setMobileFilterOpen(false);
                        }}
                        className={`block w-full text-left py-1.5 px-2 rounded ${
                          currentEmbroidery === type ? 'bg-maroon-800 text-white font-bold' : ''
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 space-y-2">
                <button
                  onClick={() => {
                    clearAllFilters();
                    setMobileFilterOpen(false);
                  }}
                  className="w-full py-2.5 text-xs text-red-600 font-semibold border border-red-200 rounded"
                >
                  Reset All
                </button>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full py-2.5 text-xs font-bold uppercase bg-maroon-800 text-white rounded"
                >
                  View Results
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
