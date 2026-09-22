import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Layers, Check } from 'lucide-react';
import api from '../../services/api';

export const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    image: '',
    isFeatured: false
  });

  const fetchCats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories');
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, form);
      } else {
        await api.post('/categories', form);
      }
      setForm({ name: '', description: '', image: '', isFeatured: false });
      setEditingId(null);
      fetchCats();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving category');
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat._id);
    setForm({
      name: cat.name,
      description: cat.description || '',
      image: cat.image || '',
      isFeatured: !!cat.isFeatured
    });
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCats();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-maroon-800">
          Category & Collection Management
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Organize boutique departments (Bridal, Party Wear, Casual, Shawls, etc.)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Create / Edit Form */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-gray-200 shadow-sm text-xs space-y-4">
          <h3 className="font-serif font-bold text-base text-maroon-800 border-b pb-2">
            {editingId ? 'Edit Category' : 'Create New Category'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block font-semibold mb-1">Category Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Luxury Velvet Shawls"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Banner Image URL</label>
              <input
                type="url"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe this handcrafted dress collection..."
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isFeatured"
                checked={form.isFeatured}
                onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                className="w-4 h-4 text-maroon-800"
              />
              <label htmlFor="isFeatured" className="font-semibold text-charcoal cursor-pointer">
                Feature on Homepage Grid
              </label>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-maroon-800 text-white font-serif font-bold uppercase rounded text-xs hover:bg-maroon-900"
              >
                {editingId ? 'Update Category' : 'Save Category'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm({ name: '', description: '', image: '', isFeatured: false });
                  }}
                  className="px-4 py-2 border rounded text-xs text-gray-500"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Categories Table */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-600 border-b">
                <th className="p-3">Category</th>
                <th className="p-3">Slug</th>
                <th className="p-3 text-center">Featured</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-gray-400">Loading categories...</td>
                </tr>
              ) : (
                categories.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <img src={c.image} alt={c.name} className="w-10 h-10 object-cover rounded border" />
                        <div>
                          <p className="font-bold text-charcoal">{c.name}</p>
                          <p className="text-[10px] text-gray-400 line-clamp-1">{c.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-mono text-gray-500">{c.slug}</td>
                    <td className="p-3 text-center">
                      {c.isFeatured ? (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">
                          Yes
                        </span>
                      ) : (
                        <span className="text-gray-400">No</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEdit(c)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(c._id, c.name)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
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
    </div>
  );
};

export default AdminCategories;
