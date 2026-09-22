import React, { useState, useEffect } from 'react';
import { Percent, Plus, Trash2, Tag } from 'lucide-react';
import { formatPKR } from '../../utils/formatCurrency';
import api from '../../services/api';

export const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    code: '',
    discountType: 'percentage',
    discountAmount: 10,
    minOrderAmount: 3000,
    maxDiscount: '',
    validUntil: '2028-12-31',
    usageLimit: 200
  });

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await api.get('/coupons');
      setCoupons(res.data.coupons || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/coupons', {
        ...form,
        discountAmount: Number(form.discountAmount),
        minOrderAmount: Number(form.minOrderAmount),
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
        usageLimit: Number(form.usageLimit)
      });
      setForm({
        code: '',
        discountType: 'percentage',
        discountAmount: 10,
        minOrderAmount: 3000,
        maxDiscount: '',
        validUntil: '2028-12-31',
        usageLimit: 200
      });
      fetchCoupons();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving coupon');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await api.delete(`/coupons/${id}`);
      fetchCoupons();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-maroon-800">
          Coupons & Discount Promotions
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Create promotional vouchers for new customer onboarding or festival campaigns.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Create Coupon Form */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-gray-200 shadow-sm text-xs space-y-4">
          <h3 className="font-serif font-bold text-base text-maroon-800 border-b pb-2 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-gold-600" />
            <span>Generate New Coupon</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block font-semibold mb-1">Coupon Code *</label>
              <input
                type="text"
                required
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="e.g. MULTAN20"
                className="w-full p-2 border border-gray-300 rounded uppercase font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Discount Type</label>
                <select
                  value={form.discountType}
                  onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded font-medium"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed PKR (Rs.)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">
                  Discount Value {form.discountType === 'percentage' ? '(%)' : '(Rs.)'} *
                </label>
                <input
                  type="number"
                  required
                  value={form.discountAmount}
                  onChange={(e) => setForm({ ...form, discountAmount: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Min Order Amount (PKR)</label>
                <input
                  type="number"
                  value={form.minOrderAmount}
                  onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Max Cap (For % coupons)</label>
                <input
                  type="number"
                  value={form.maxDiscount}
                  onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
                  placeholder="Optional max Rs."
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Valid Until *</label>
                <input
                  type="date"
                  required
                  value={form.validUntil}
                  onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Usage Limit</label>
                <input
                  type="number"
                  value={form.usageLimit}
                  onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-maroon-800 text-white font-serif font-bold uppercase rounded text-xs hover:bg-maroon-900 mt-2"
            >
              Activate Coupon
            </button>
          </form>
        </div>

        {/* Coupons List */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-600 border-b">
                <th className="p-3">Code</th>
                <th className="p-3">Discount</th>
                <th className="p-3">Min Order</th>
                <th className="p-3">Usage</th>
                <th className="p-3">Expires</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-400">Loading coupons...</td>
                </tr>
              ) : (
                coupons.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50">
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-gold-100 text-maroon-900 font-mono font-bold rounded">
                        {c.code}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-charcoal">
                      {c.discountType === 'percentage' ? `${c.discountAmount}%` : formatPKR(c.discountAmount)}
                    </td>
                    <td className="p-3 text-gray-500">{formatPKR(c.minOrderAmount)}</td>
                    <td className="p-3 text-gray-500">
                      {c.timesUsed} / {c.usageLimit || '∞'}
                    </td>
                    <td className="p-3 text-gray-500">
                      {new Date(c.validUntil).toLocaleDateString('en-PK')}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDelete(c._id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Delete coupon"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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

export default AdminCoupons;
