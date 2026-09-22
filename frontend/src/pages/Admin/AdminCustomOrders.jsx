import React, { useState, useEffect } from 'react';
import { Scissors, Eye, MessageCircle, DollarSign, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { formatPKR } from '../../utils/formatCurrency';
import api from '../../services/api';

export const AdminCustomOrders = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeRequest, setActiveRequest] = useState(null);

  const [quotePrice, setQuotePrice] = useState('');
  const [quoteDays, setQuoteDays] = useState('');
  const [quoteNotes, setQuoteNotes] = useState('');
  const [quoteStatus, setQuoteStatus] = useState('quoted');
  const [saving, setSaving] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get('/custom-orders/admin/all');
      setRequests(res.data.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleOpenQuote = (req) => {
    setActiveRequest(req);
    setQuotePrice(req.adminQuotation?.price || req.estimatedBudgetPKR || '');
    setQuoteDays(req.adminQuotation?.timelineDays || 21);
    setQuoteNotes(req.adminQuotation?.notes || '');
    setQuoteStatus(req.status || 'quoted');
  };

  const handleSaveQuote = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/custom-orders/admin/${activeRequest._id}/quote`, {
        price: Number(quotePrice),
        timelineDays: Number(quoteDays),
        notes: quoteNotes,
        status: quoteStatus
      });
      setActiveRequest(null);
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update quote');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-maroon-800">
          Bespoke Custom Tailoring Requests
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Review bridal inquiries, client measurements, reference photos, and assign quotes.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-600 border-b">
                <th className="p-3">Ref Number</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Dress Type</th>
                <th className="p-3">Fabric & Color</th>
                <th className="p-3">Budget</th>
                <th className="p-3">Deadline</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-6 text-center text-gray-400">Loading requests...</td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-6 text-center text-gray-400">No bespoke requests received yet.</td>
                </tr>
              ) : (
                requests.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50">
                    <td className="p-3 font-mono font-bold text-maroon-800">{r.requestNumber}</td>
                    <td className="p-3">
                      <p className="font-bold text-charcoal">{r.customerName}</p>
                      <p className="text-[10px] text-gray-400">{r.phone} • {r.city}</p>
                    </td>
                    <td className="p-3 font-medium text-maroon-800">{r.dressType}</td>
                    <td className="p-3 text-gray-600">
                      <p className="font-medium">{r.fabricChoice}</p>
                      <p className="text-[10px] text-gray-400">{r.colorChoice}</p>
                    </td>
                    <td className="p-3 font-bold text-charcoal">{formatPKR(r.estimatedBudgetPKR)}</td>
                    <td className="p-3 text-gray-500">
                      {r.targetDeadline ? new Date(r.targetDeadline).toLocaleDateString('en-PK') : 'Flexible'}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.status === 'quoted'
                          ? 'bg-blue-100 text-blue-800'
                          : r.status === 'in_crafting'
                          ? 'bg-gold-100 text-gold-800'
                          : r.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleOpenQuote(r)}
                        className="px-3 py-1 bg-maroon-800 text-white rounded font-bold text-[11px] hover:bg-maroon-900"
                      >
                        Inspect & Quote
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quote & Measurement Details Modal */}
      {activeRequest && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl border border-gold-300 overflow-hidden text-xs">
            <div className="p-4 bg-maroon-800 text-white flex justify-between items-center">
              <div>
                <h3 className="font-serif font-bold text-lg">
                  Bespoke Request: {activeRequest.requestNumber}
                </h3>
                <p className="text-[11px] text-gold-300">
                  Customer: {activeRequest.customerName} ({activeRequest.phone} - {activeRequest.city})
                </p>
              </div>
              <button
                onClick={() => setActiveRequest(null)}
                className="text-white hover:text-gold-300 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* Measurements Display */}
              <div>
                <h4 className="font-bold text-maroon-800 uppercase tracking-wider mb-2">
                  Client Measurements ({activeRequest.measurements?.unit || 'inches'})
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-ivory-100 p-3 rounded-lg border">
                  <div>Length: <strong>{activeRequest.measurements?.shirtLength || '-'}</strong></div>
                  <div>Shoulder: <strong>{activeRequest.measurements?.shoulder || '-'}</strong></div>
                  <div>Chest: <strong>{activeRequest.measurements?.chest || '-'}</strong></div>
                  <div>Waist: <strong>{activeRequest.measurements?.waist || '-'}</strong></div>
                  <div>Hips: <strong>{activeRequest.measurements?.hips || '-'}</strong></div>
                  <div>Sleeve: <strong>{activeRequest.measurements?.sleeveLength || '-'}</strong></div>
                  <div>Trouser Length: <strong>{activeRequest.measurements?.trouserLength || '-'}</strong></div>
                  <div>Trouser Waist: <strong>{activeRequest.measurements?.trouserWaist || '-'}</strong></div>
                </div>
              </div>

              {/* Reference Photos */}
              {activeRequest.referenceImages && activeRequest.referenceImages.length > 0 && (
                <div>
                  <h4 className="font-bold text-maroon-800 uppercase tracking-wider mb-2">
                    Client Design Reference Photos
                  </h4>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {activeRequest.referenceImages.map((img, i) => (
                      <a key={i} href={img} target="_blank" rel="noopener noreferrer">
                        <img src={img} alt="reference" className="w-24 h-32 object-cover rounded border" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Embroidery Requirements */}
              <div>
                <h4 className="font-bold text-maroon-800 uppercase tracking-wider mb-1">
                  Embroidery Requirements:
                </h4>
                <p className="bg-gray-50 p-3 rounded border text-charcoal">
                  {activeRequest.embroideryDetails}
                </p>
              </div>

              {/* Quotation Form */}
              <form onSubmit={handleSaveQuote} className="p-4 bg-gold-50/50 rounded-lg border border-gold-300 space-y-3">
                <h4 className="font-bold text-maroon-800 uppercase tracking-wider">
                  Artisan Quotation & Timeline
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Quoted Price (PKR) *</label>
                    <input
                      type="number"
                      required
                      value={quotePrice}
                      onChange={(e) => setQuotePrice(e.target.value)}
                      className="w-full p-2 bg-white border border-gold-300 rounded font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Estimated Days *</label>
                    <input
                      type="number"
                      required
                      value={quoteDays}
                      onChange={(e) => setQuoteDays(e.target.value)}
                      className="w-full p-2 bg-white border border-gold-300 rounded"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Bespoke Status</label>
                    <select
                      value={quoteStatus}
                      onChange={(e) => setQuoteStatus(e.target.value)}
                      className="w-full p-2 bg-white border border-gold-300 rounded font-bold"
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Under Review</option>
                      <option value="quoted">Quoted & Ready</option>
                      <option value="in_crafting">In Crafting on Adda</option>
                      <option value="completed">Completed & Dispatched</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Quotation Notes for Customer</label>
                  <input
                    type="text"
                    value={quoteNotes}
                    onChange={(e) => setQuoteNotes(e.target.value)}
                    placeholder="e.g. Includes pure micro velvet fabric, French wire bullion, and dyed dupatta."
                    className="w-full p-2 bg-white border border-gold-300 rounded"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-2.5 bg-maroon-800 text-white font-serif font-bold uppercase rounded hover:bg-maroon-900"
                  >
                    {saving ? 'Updating...' : 'Save & Update Quotation'}
                  </button>
                  <a
                    href={`https://wa.me/${activeRequest.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `As-salamu alaykum ${activeRequest.customerName}! Regarding your custom dress request #${activeRequest.requestNumber} at Hand Embroidered Dresses Multan: our quotation is ready at Rs. ${Number(quotePrice).toLocaleString()}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 bg-[#25D366] text-white font-bold rounded flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-white" />
                    <span>WhatsApp Client</span>
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomOrders;
