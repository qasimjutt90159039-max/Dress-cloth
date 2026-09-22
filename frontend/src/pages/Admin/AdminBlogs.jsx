import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, BookOpen } from 'lucide-react';
import api from '../../services/api';

export const AdminBlogs = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    author: 'Master Artisan, Multan',
    category: 'Craftsmanship & Heritage',
    readingTimeMinutes: 5
  });

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/blogs/admin/all');
      setPosts(res.data.posts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/blogs/${editingId}`, form);
      } else {
        await api.post('/blogs', form);
      }
      setEditingId(null);
      setForm({
        title: '',
        excerpt: '',
        content: '',
        coverImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
        author: 'Master Artisan, Multan',
        category: 'Craftsmanship & Heritage',
        readingTimeMinutes: 5
      });
      fetchBlogs();
    } catch (err) {
      alert('Failed to save article');
    }
  };

  const handleEdit = (p) => {
    setEditingId(p._id);
    setForm({
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      coverImage: p.coverImage,
      author: p.author,
      category: p.category,
      readingTimeMinutes: p.readingTimeMinutes || 5
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete article?')) return;
    try {
      await api.delete(`/blogs/${id}`);
      fetchBlogs();
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-maroon-800">
          Heritage Blog & Articles Manager
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Publish and update style guides, fabric care tutorials, and Multan artisan stories.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Editor Form */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-gray-200 shadow-sm text-xs space-y-4">
          <h3 className="font-serif font-bold text-base text-maroon-800 border-b pb-2">
            {editingId ? 'Edit Article' : 'Write New Article'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block font-semibold mb-1">Article Title *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Category</label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Cover Image URL</label>
              <input
                type="url"
                value={form.coverImage}
                onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Excerpt (Short Summary)</label>
              <textarea
                rows={2}
                required
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Full Article Content</label>
              <textarea
                rows={6}
                required
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-maroon-800 text-white font-serif font-bold uppercase rounded hover:bg-maroon-900 text-xs"
              >
                {editingId ? 'Update Article' : 'Publish Article'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm({
                      title: '',
                      excerpt: '',
                      content: '',
                      coverImage: '',
                      author: 'Master Artisan, Multan',
                      category: 'Craftsmanship & Heritage',
                      readingTimeMinutes: 5
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

        {/* Articles Table */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-600 border-b">
                <th className="p-3">Article</th>
                <th className="p-3">Category</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="3" className="p-6 text-center text-gray-400">Loading articles...</td>
                </tr>
              ) : (
                posts.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <img src={p.coverImage} alt={p.title} className="w-12 h-10 object-cover rounded border" />
                        <div>
                          <p className="font-bold text-charcoal line-clamp-1">{p.title}</p>
                          <p className="text-[10px] text-gray-400">{p.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-gold-700 font-medium">{p.category}</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEdit(p)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
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

export default AdminBlogs;
