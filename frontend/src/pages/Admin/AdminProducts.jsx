import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, ExternalLink, Sparkles, AlertCircle } from 'lucide-react';
import { formatPKR } from '../../utils/formatCurrency';
import Pagination from '../../components/common/Pagination';
import api from '../../services/api';

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `/products?page=${currentPage}&limit=10`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (categoryFilter) url += `&category=${categoryFilter}`;

      const res = await api.get(url);
      setProducts(res.data.products || []);
      setTotalCount(res.data.total || 0);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, categoryFilter]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCats();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      return;
    }
    try {
      await api.delete(`/products/${id}`);
      setActionMsg(`Product "${title}" deleted successfully.`);
      fetchProducts();
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-maroon-800">
            Product Catalog Management
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Total {totalCount} hand-embroidered dresses in store database.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="px-4 py-2 bg-maroon-800 hover:bg-maroon-900 text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4 text-gold-300" />
          <span>Add New Dress</span>
        </Link>
      </div>

      {actionMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 font-semibold">
          {actionMsg}
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, SKU, craft..."
            className="p-2 border border-gray-300 rounded w-full sm:w-64"
          />
          <button type="submit" className="px-3 bg-maroon-800 text-white rounded font-bold">
            <Search className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="w-full sm:w-auto flex items-center gap-2">
          <label className="text-gray-500">Filter Category:</label>
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="p-2 border border-gray-300 rounded font-medium"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-600 border-b">
                <th className="p-3">Product</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Embroidery Craft</th>
                <th className="p-3">Fabric</th>
                <th className="p-3 text-right">Price</th>
                <th className="p-3 text-center">Stock</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-gray-400">Loading catalog...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-gray-400">No dresses found.</td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80'}
                          alt={p.title}
                          className="w-10 h-12 object-cover rounded border"
                        />
                        <div className="min-w-0 max-w-xs">
                          <p className="font-semibold text-charcoal truncate">{p.title}</p>
                          <span className="text-[10px] text-gray-400">{p.category?.name}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-mono text-gray-600">{p.sku}</td>
                    <td className="p-3 text-gold-700 font-medium">{p.embroideryType}</td>
                    <td className="p-3 text-gray-600">{p.fabric}</td>
                    <td className="p-3 text-right font-bold text-maroon-800">
                      {p.onSale && p.salePrice ? (
                        <div>
                          <span>{formatPKR(p.salePrice)}</span>
                          <span className="text-[10px] text-gray-400 line-through block">{formatPKR(p.price)}</span>
                        </div>
                      ) : (
                        formatPKR(p.price)
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        p.stock <= 3 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/product/${p.slug}`}
                          target="_blank"
                          className="p-1.5 text-gray-400 hover:text-maroon-800"
                          title="View on store"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          to={`/admin/products/edit/${p._id}`}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit dress"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(p._id, p.title)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          title="Delete dress"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default AdminProducts;
