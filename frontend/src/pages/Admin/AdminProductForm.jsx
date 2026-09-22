import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, Sparkles, Image, Check } from 'lucide-react';
import { EMBROIDERY_TYPES, FABRICS, SIZES } from '../../utils/constants';
import api from '../../services/api';

export const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    sku: `HED-${Math.floor(100 + Math.random() * 900)}`,
    description: '',
    price: '',
    salePrice: '',
    onSale: false,
    stock: 10,
    category: '',
    embroideryType: EMBROIDERY_TYPES[0],
    fabric: FABRICS[0],
    sizes: ['S', 'M', 'L'],
    colors: [{ name: 'Deep Maroon', hex: '#5C061D' }],
    images: [{ url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80', isPrimary: true }],
    careInstructions: 'Dry clean recommended. Gentle hand wash in cold water.',
    craftStory: 'Handcrafted in Multan with traditional needlework techniques.',
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    status: 'active'
  });

  const [newImageUrl, setNewImageUrl] = useState('');
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#000000');

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('/categories');
        const cats = res.data.categories || [];
        setCategories(cats);
        if (!isEdit && cats.length > 0) {
          setForm(prev => ({ ...prev, category: cats[0]._id }));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCats();
  }, [isEdit]);

  useEffect(() => {
    if (isEdit) {
      const loadProduct = async () => {
        try {
          const res = await api.get(`/products/${id}`);
          const p = res.data.product;
          setForm({
            ...p,
            category: p.category?._id || p.category,
            salePrice: p.salePrice || '',
            sizes: p.sizes || [],
            colors: p.colors || [],
            images: p.images || []
          });
        } catch (err) {
          console.error(err);
        } finally {
          setFetching(false);
        }
      };
      loadProduct();
    }
  }, [id, isEdit]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSizeToggle = (sz) => {
    setForm(prev => {
      const exists = prev.sizes.includes(sz);
      const updated = exists ? prev.sizes.filter(s => s !== sz) : [...prev.sizes, sz];
      return { ...prev, sizes: updated };
    });
  };

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    setForm(prev => ({
      ...prev,
      images: [...prev.images, { url: newImageUrl.trim(), isPrimary: prev.images.length === 0 }]
    }));
    setNewImageUrl('');
  };

  const handleRemoveImage = (index) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleAddColor = () => {
    if (!newColorName.trim()) return;
    setForm(prev => ({
      ...prev,
      colors: [...prev.colors, { name: newColorName.trim(), hex: newColorHex }]
    }));
    setNewColorName('');
  };

  const handleRemoveColor = (index) => {
    setForm(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        salePrice: form.onSale && form.salePrice ? Number(form.salePrice) : null,
        stock: Number(form.stock)
      };

      if (isEdit) {
        await api.put(`/products/${id}`, payload);
      } else {
        await api.post('/products', payload);
      }
      navigate('/admin/products');
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving product');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="text-center py-20 text-xs text-gray-500">Loading product editor...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <Link
          to="/admin/products"
          className="text-xs text-maroon-800 font-semibold hover:underline flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Products</span>
        </Link>
        <h2 className="font-serif text-2xl font-bold text-maroon-800">
          {isEdit ? 'Edit Handcrafted Dress' : 'Create New Boutique Dress'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-sm text-xs">
        {/* Core Identifiers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block font-semibold mb-1">Dress Title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g. Multani Royal Zardozi Velvet Kurti"
              className="w-full p-2.5 border border-gray-300 rounded focus:border-maroon-800"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">SKU Code *</label>
            <input
              type="text"
              required
              value={form.sku}
              onChange={(e) => handleChange('sku', e.target.value.toUpperCase())}
              className="w-full p-2.5 border border-gray-300 rounded font-mono uppercase"
            />
          </div>
        </div>

        {/* Category, Embroidery & Fabric */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-semibold mb-1">Category *</label>
            <select
              value={form.category}
              onChange={(e) => handleChange('category', e.target.value)}
              required
              className="w-full p-2.5 border border-gray-300 rounded font-medium"
            >
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Embroidery Type *</label>
            <select
              value={form.embroideryType}
              onChange={(e) => handleChange('embroideryType', e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded font-medium"
            >
              {EMBROIDERY_TYPES.map((emb) => (
                <option key={emb} value={emb}>{emb}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Fabric *</label>
            <select
              value={form.fabric}
              onChange={(e) => handleChange('fabric', e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded font-medium"
            >
              {FABRICS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-ivory-100 rounded-lg border border-gold-200">
          <div>
            <label className="block font-semibold mb-1">Price (PKR) *</label>
            <input
              type="number"
              required
              value={form.price}
              onChange={(e) => handleChange('price', e.target.value)}
              placeholder="18500"
              className="w-full p-2 bg-white border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Sale Price (PKR)</label>
            <input
              type="number"
              value={form.salePrice}
              onChange={(e) => handleChange('salePrice', e.target.value)}
              placeholder="15999"
              className="w-full p-2 bg-white border border-gray-300 rounded"
            />
          </div>

          <div className="flex items-center gap-2 pt-5">
            <input
              type="checkbox"
              id="onSale"
              checked={form.onSale}
              onChange={(e) => handleChange('onSale', e.target.checked)}
              className="w-4 h-4 text-maroon-800"
            />
            <label htmlFor="onSale" className="font-bold text-maroon-800 cursor-pointer">
              Enable Sale Discount
            </label>
          </div>

          <div>
            <label className="block font-semibold mb-1">Inventory Stock Count *</label>
            <input
              type="number"
              required
              value={form.stock}
              onChange={(e) => handleChange('stock', e.target.value)}
              className="w-full p-2 bg-white border border-gray-300 rounded font-bold"
            />
          </div>
        </div>

        {/* Sizes Checkboxes */}
        <div>
          <label className="block font-semibold mb-2">Available Sizing Options</label>
          <div className="flex flex-wrap gap-2">
            {SIZES.map((sz) => (
              <button
                type="button"
                key={sz}
                onClick={() => handleSizeToggle(sz)}
                className={`px-3 py-1.5 rounded border transition-colors ${
                  form.sizes.includes(sz)
                    ? 'bg-maroon-800 text-white font-bold border-maroon-800'
                    : 'bg-white border-gray-300 text-charcoal'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* Color Variants */}
        <div className="space-y-3">
          <label className="block font-semibold">Color Variants</label>
          <div className="flex flex-wrap gap-2 items-center">
            {form.colors.map((c, i) => (
              <span
                key={i}
                className="px-2.5 py-1 bg-ivory-100 border border-gold-300 rounded-full flex items-center gap-1.5"
              >
                <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: c.hex }} />
                <span>{c.name}</span>
                <Trash2
                  className="w-3 h-3 text-red-500 cursor-pointer hover:text-red-700"
                  onClick={() => handleRemoveColor(i)}
                />
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newColorName}
              onChange={(e) => setNewColorName(e.target.value)}
              placeholder="Color name (e.g. Maroon)"
              className="p-1.5 border border-gray-300 rounded w-48 text-xs"
            />
            <input
              type="color"
              value={newColorHex}
              onChange={(e) => setNewColorHex(e.target.value)}
              className="w-8 h-8 rounded border p-0 cursor-pointer"
            />
            <button
              type="button"
              onClick={handleAddColor}
              className="px-3 py-1.5 bg-gray-200 text-charcoal rounded font-semibold text-xs hover:bg-gray-300"
            >
              Add Color
            </button>
          </div>
        </div>

        {/* Gallery Image URLs */}
        <div className="space-y-3">
          <label className="block font-semibold">Product Images (URLs)</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {form.images.map((img, i) => (
              <div key={i} className="relative aspect-[3/4] rounded-lg border overflow-hidden group">
                <img src={img.url} alt="product" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(i)}
                  className="absolute top-1 right-1 p-1 bg-white/90 text-red-600 rounded-full shadow"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="url"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="Paste image URL (Unsplash or Cloudinary)..."
              className="flex-1 p-2 border border-gray-300 rounded text-xs"
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="px-4 py-2 bg-maroon-800 text-white rounded font-bold text-xs"
            >
              Add Image
            </button>
          </div>
        </div>

        {/* Descriptions */}
        <div className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Product Description *</label>
            <textarea
              rows={4}
              required
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Fabric Care Instructions</label>
              <textarea
                rows={2}
                value={form.careInstructions}
                onChange={(e) => handleChange('careInstructions', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Artisan Craft Narrative</label>
              <textarea
                rows={2}
                value={form.craftStory}
                onChange={(e) => handleChange('craftStory', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        {/* Status & Featured Flags */}
        <div className="flex flex-wrap items-center justify-between p-4 bg-gray-50 rounded-lg border gap-4">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => handleChange('isFeatured', e.target.checked)}
                className="w-4 h-4 text-maroon-800"
              />
              <span className="font-semibold">Featured on Homepage</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isBestSeller}
                onChange={(e) => handleChange('isBestSeller', e.target.checked)}
                className="w-4 h-4 text-maroon-800"
              />
              <span className="font-semibold">Bestseller Badge</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isNewArrival}
                onChange={(e) => handleChange('isNewArrival', e.target.checked)}
                className="w-4 h-4 text-maroon-800"
              />
              <span className="font-semibold">New Arrival</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <label className="font-semibold">Visibility Status:</label>
            <select
              value={form.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="p-1.5 border border-gray-300 rounded font-bold"
            >
              <option value="active">Active (Visible)</option>
              <option value="draft">Draft (Hidden)</option>
            </select>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-maroon-800 hover:bg-maroon-900 disabled:opacity-50 text-white font-serif font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4 text-gold-300" />
          <span>{loading ? 'Saving Dress...' : 'Save Dress to Catalog'}</span>
        </button>
      </form>
    </div>
  );
};

export default AdminProductForm;
