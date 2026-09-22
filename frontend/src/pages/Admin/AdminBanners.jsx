import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Image } from 'lucide-react';
import api from '../../services/api';

export const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    badge: 'Handcrafted in Multan',
    buttonText: 'Explore Collection',
    link: '/shop',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=80',
    isActive: true,
    order: 0
  });

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await api.get('/banners/admin/all');
      setBanners(res.data.banners || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/banners/${editingId}`, form);
      } else {
        await api.post('/banners', form);
      }
      setEditingId(null);
      setForm({
        title: '',
        subtitle: '',
        badge: 'Handcrafted in Multan',
        buttonText: 'Explore Collection',
        link: '/shop',
        image: '',
        isActive: true,
        order: 0
      });
      fetchBanners();
    } catch (err) {
      alert('Failed to save banner');
    }
  };

  const handleEdit = (b) => {
    setEditingId(b._id);
    setForm(b);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this banner?')) return;
    try {
      await api.delete(`/banners/${id}`);
      fetchBanners();
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-maroon-800">
          Homepage Hero Banners & Promotional Sliders
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Configure slides, badges, background images, and direct call-to-action buttons.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-gray-200 shadow-sm text-xs space-y-4">
          <h3 className="font-serif font-bold text-base text-maroon-800 border-b pb-2">
            {editingId ? 'Edit Banner Slide' : 'Add New Banner Slide'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block font-semibold mb-1">Headline Title *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded font-serif text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Subtitle Description</label>
              <textarea
                rows={2}
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Top Badge Pill</label>
                <input
                  type="text"
                  value={form.badge}
                  onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Button Text</label>
                <input
                  type="text"
                  value={form.buttonText}
                  onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Link Target</label>
                <input
                  type="text"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Display Order</label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Hero Image URL *</label>
              <input
                type="url"
                required
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://..."
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="bannerActive"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="w-4 h-4 text-maroon-800"
              />
              <label htmlFor="bannerActive" className="font-semibold cursor-pointer">
                Active & Visible on Homepage
              </label>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-maroon-800 text-white font-serif font-bold uppercase rounded hover:bg-maroon-900 text-xs"
              >
                {editingId ? 'Update Slide' : 'Save Banner Slide'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm({
                      title: '',
                      subtitle: '',
                      badge: 'Handcrafted in Multan',
                      buttonText: 'Explore Collection',
                      link: '/shop',
                      image: '',
                      isActive: true,
                      order: 0
                    });
                  }}
                  className="px-4 py-2 border rounded text-xs text-gray-500"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Banners List */}
        <div className="lg:col-span-7 space-y-4">
          {banners.map((b) => (
            <div
              key={b._id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col sm:flex-row items-center justify-between p-4 gap-4 text-xs"
            >
              <div className="flex items-center gap-4 min-w-0">
                <img src={b.image} alt={b.title} className="w-24 h-16 object-cover rounded border shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-gold-700 bg-gold-50 px-2 py-0.5 rounded">
                    {b.badge}
                  </span>
                  <h4 className="font-serif font-bold text-sm text-charcoal truncate mt-1">{b.title}</h4>
                  <p className="text-gray-400 text-[11px] truncate">{b.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleEdit(b)}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(b._id)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminBanners;
