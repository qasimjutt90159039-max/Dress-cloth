import React, { useState, useEffect } from 'react';
import { Star, Check, X, Trash2, Eye } from 'lucide-react';
import api from '../../services/api';

export const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reviews/admin/all');
      setReviews(res.data.reviews || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleToggleApprove = async (id) => {
    try {
      await api.put(`/reviews/admin/${id}/toggle-approve`);
      fetchReviews();
    } catch (err) {
      alert('Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await api.delete(`/reviews/admin/${id}`);
      fetchReviews();
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-maroon-800">
          Customer Reviews Moderation
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Moderate verified buyer reviews and manage feedback displayed on product pages.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-600 border-b">
                <th className="p-3">Product</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Review Feedback</th>
                <th className="p-3">Date</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-gray-400">Loading reviews...</td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-gray-400">No reviews submitted yet.</td>
                </tr>
              ) : (
                reviews.map((rev) => (
                  <tr key={rev._id} className="hover:bg-gray-50">
                    <td className="p-3">
                      <p className="font-semibold text-charcoal truncate max-w-xs">{rev.product?.title || 'Product'}</p>
                    </td>
                    <td className="p-3 font-medium text-charcoal">{rev.customerName}</td>
                    <td className="p-3">
                      <div className="flex text-gold-500">
                        {Array.from({ length: rev.rating }).map((_, r) => (
                          <Star key={r} className="w-3.5 h-3.5 fill-gold-500 text-gold-500" />
                        ))}
                      </div>
                    </td>
                    <td className="p-3 max-w-sm text-gray-600 line-clamp-2">{rev.comment}</td>
                    <td className="p-3 text-gray-400">{new Date(rev.createdAt).toLocaleDateString('en-PK')}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        rev.isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {rev.isApproved ? 'Visible' : 'Hidden'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleApprove(rev._id)}
                          className={`px-2.5 py-1 rounded text-[11px] font-semibold ${
                            rev.isApproved
                              ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {rev.isApproved ? 'Hide' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleDelete(rev._id)}
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

export default AdminReviews;
