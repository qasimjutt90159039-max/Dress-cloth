import React, { useState } from 'react';
import {
  Scissors,
  Upload,
  Ruler,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  MessageCircle
} from 'lucide-react';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { PAKISTANI_PROVINCES, POPULAR_CITIES } from '../utils/constants';
import api from '../services/api';

export const CustomOrder = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    city: 'Multan',
    dressType: 'Bridal Lehenga',
    fabricChoice: 'Pure Raw Silk & Micro Velvet',
    colorChoice: 'Deep Maroon & Antique Gold',
    embroideryDetails: 'Heavy Zardozi and Dabka work across lehenga panels and neckline with stone accents.',
    estimatedBudgetPKR: 45000,
    targetDeadline: '',
    unit: 'inches',
    shirtLength: '',
    shoulder: '',
    chest: '',
    waist: '',
    hips: '',
    sleeveLength: '',
    trouserLength: '',
    trouserWaist: '',
    additionalInstructions: ''
  });

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successResult, setSuccessResult] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = new FormData();
      data.append('customerName', formData.customerName);
      data.append('phone', formData.phone);
      data.append('email', formData.email);
      data.append('city', formData.city);
      data.append('dressType', formData.dressType);
      data.append('fabricChoice', formData.fabricChoice);
      data.append('colorChoice', formData.colorChoice);
      data.append('embroideryDetails', formData.embroideryDetails);
      data.append('estimatedBudgetPKR', formData.estimatedBudgetPKR);
      if (formData.targetDeadline) {
        data.append('targetDeadline', formData.targetDeadline);
      }

      const measurements = {
        unit: formData.unit,
        shirtLength: formData.shirtLength,
        shoulder: formData.shoulder,
        chest: formData.chest,
        waist: formData.waist,
        hips: formData.hips,
        sleeveLength: formData.sleeveLength,
        trouserLength: formData.trouserLength,
        trouserWaist: formData.trouserWaist,
        additionalInstructions: formData.additionalInstructions
      };
      data.append('measurements', JSON.stringify(measurements));

      files.forEach((file) => {
        data.append('referenceImages', file);
      });

      const res = await api.post('/custom-orders', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccessResult(res.data.customOrder);
      window.scrollTo(0, 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit tailoring request. Please check the form.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumbs items={[{ label: 'Bespoke Custom Tailoring' }]} />

      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto my-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-100 border border-gold-300 text-maroon-800 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-gold-600" />
          <span>Heirloom Bespoke Atelier</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-800">
          Custom Bridal & Formal Tailoring Request
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
          Commission a one-of-a-kind hand-embroidered masterpiece tailored specifically to your exact measurements, color palette, and event timeline by our master karigars in Multan.
        </p>
      </div>

      {successResult ? (
        <div className="bg-white rounded-2xl border-2 border-gold-400 p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h2 className="font-serif text-3xl font-bold text-maroon-800">
            Request Registered Successfully!
          </h2>

          <div className="bg-ivory-100 p-4 rounded-lg inline-block border border-gold-300">
            <p className="text-xs text-charcoal-muted">Your Bespoke Request Reference:</p>
            <p className="font-mono text-xl font-bold text-maroon-800 mt-1">
              {successResult.requestNumber}
            </p>
          </div>

          <p className="text-xs text-charcoal leading-relaxed max-w-lg mx-auto">
            Our head designer at our Multan boutique is reviewing your uploaded design references and sizing specifications. We will contact you via WhatsApp on <strong>{successResult.phone}</strong> within 24 hours with a comprehensive quotation and timeline estimate.
          </p>

          <div className="pt-4">
            <a
              href={`https://wa.me/923186229753?text=${encodeURIComponent(
                `As-salamu alaykum! I submitted Bespoke Custom Order request #${successResult.requestNumber} for a ${successResult.dressType}. Please connect me with the head artisan.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg inline-flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Discuss Directly on WhatsApp (03186229753)</span>
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 sm:p-10 rounded-2xl border border-gold-300/60 shadow-md">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-xs text-red-700">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Customer Info */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-maroon-800 border-b border-gold-200 pb-2">
              1. Customer Contact Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => handleChange('customerName', e.target.value)}
                  placeholder="e.g. Samina Khan"
                  className="w-full p-2.5 bg-ivory-50 border border-gold-300 rounded focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">WhatsApp / Contact Phone *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="03186229753"
                  className="w-full p-2.5 bg-ivory-50 border border-gold-300 rounded focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="contact@gmail.com"
                  className="w-full p-2.5 bg-ivory-50 border border-gold-300 rounded"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Your City *</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="e.g. Lahore, Karachi, Multan, Islamabad"
                  className="w-full p-2.5 bg-ivory-50 border border-gold-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Garment Specifications */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-maroon-800 border-b border-gold-200 pb-2">
              2. Garment & Embroidery Specifications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Dress Silhouette / Type *</label>
                <select
                  value={formData.dressType}
                  onChange={(e) => handleChange('dressType', e.target.value)}
                  className="w-full p-2.5 bg-ivory-50 border border-gold-300 rounded font-medium"
                >
                  <option value="Bridal Lehenga">Bridal Lehenga & Choli</option>
                  <option value="Bridal Maxi / Gown">Bridal Maxi / Flared Gown</option>
                  <option value="Farshi Gharara Set">Nawabi Farshi Gharara Set</option>
                  <option value="Peshwas & Dupatta">Floor Length Peshwas & Dupatta</option>
                  <option value="Kurti & Trouser">Formal Hand-Embroidered Kurti Set</option>
                  <option value="Custom Shawl">Custom Heavy Velvet Tilla Shawl</option>
                  <option value="Other Bespoke">Other Custom Silhouette</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Target Event Date / Deadline</label>
                <input
                  type="date"
                  value={formData.targetDeadline}
                  onChange={(e) => handleChange('targetDeadline', e.target.value)}
                  className="w-full p-2.5 bg-ivory-50 border border-gold-300 rounded"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Preferred Fabric *</label>
                <input
                  type="text"
                  required
                  value={formData.fabricChoice}
                  onChange={(e) => handleChange('fabricChoice', e.target.value)}
                  placeholder="e.g. Pure Micro Velvet, Raw Silk, Chiffon, Lawn"
                  className="w-full p-2.5 bg-ivory-50 border border-gold-300 rounded"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Preferred Color Combination *</label>
                <input
                  type="text"
                  required
                  value={formData.colorChoice}
                  onChange={(e) => handleChange('colorChoice', e.target.value)}
                  placeholder="e.g. Deep Maroon with Antique Gold Zari"
                  className="w-full p-2.5 bg-ivory-50 border border-gold-300 rounded"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold mb-1">Embroidery & Design Requirements *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.embroideryDetails}
                  onChange={(e) => handleChange('embroideryDetails', e.target.value)}
                  placeholder="Describe your desired needlework: Zardozi, Aari, Sheesha, Tilla, floral motifs, border density..."
                  className="w-full p-2.5 bg-ivory-50 border border-gold-300 rounded"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold mb-1">Estimated Budget (PKR)</label>
                <input
                  type="number"
                  value={formData.estimatedBudgetPKR}
                  onChange={(e) => handleChange('estimatedBudgetPKR', e.target.value)}
                  placeholder="45000"
                  className="w-full p-2.5 bg-ivory-50 border border-gold-300 rounded"
                />
              </div>

              {/* File Uploads */}
              <div className="sm:col-span-2 p-4 bg-gold-50/50 rounded-lg border border-dashed border-gold-400 space-y-2">
                <div className="flex items-center gap-2 text-maroon-800 font-bold">
                  <Upload className="w-4 h-4 text-gold-600" />
                  <span>Upload Reference Photos (Up to 5 pictures)</span>
                </div>
                <p className="text-[11px] text-charcoal-muted">
                  Attach screenshots of embroidery motifs, Pinterest references, or dress silhouettes you admire.
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-maroon-800 file:text-white hover:file:bg-maroon-900"
                />
                {files.length > 0 && (
                  <p className="text-[11px] text-emerald-800 font-medium">
                    {files.length} photo(s) selected: {files.map(f => f.name).join(', ')}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Measurements Form */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gold-200 pb-2">
              <h3 className="font-serif font-bold text-lg text-maroon-800 flex items-center gap-2">
                <Ruler className="w-5 h-5 text-gold-600" />
                <span>3. Body Measurements</span>
              </h3>
              <div className="flex border border-gold-300 rounded text-xs overflow-hidden">
                <button
                  type="button"
                  onClick={() => handleChange('unit', 'inches')}
                  className={`px-3 py-1 ${formData.unit === 'inches' ? 'bg-maroon-800 text-white font-bold' : 'bg-white'}`}
                >
                  Inches (")
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('unit', 'cm')}
                  className={`px-3 py-1 ${formData.unit === 'cm' ? 'bg-maroon-800 text-white font-bold' : 'bg-white'}`}
                >
                  cm
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-gray-600 mb-1">Shirt Length</label>
                <input
                  type="text"
                  value={formData.shirtLength}
                  onChange={(e) => handleChange('shirtLength', e.target.value)}
                  placeholder={`42 ${formData.unit}`}
                  className="w-full p-2 border border-gold-300 rounded bg-ivory-50"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Shoulder</label>
                <input
                  type="text"
                  value={formData.shoulder}
                  onChange={(e) => handleChange('shoulder', e.target.value)}
                  placeholder={`14.5 ${formData.unit}`}
                  className="w-full p-2 border border-gold-300 rounded bg-ivory-50"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Chest / Bust</label>
                <input
                  type="text"
                  value={formData.chest}
                  onChange={(e) => handleChange('chest', e.target.value)}
                  placeholder={`38 ${formData.unit}`}
                  className="w-full p-2 border border-gold-300 rounded bg-ivory-50"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Waist</label>
                <input
                  type="text"
                  value={formData.waist}
                  onChange={(e) => handleChange('waist', e.target.value)}
                  placeholder={`34 ${formData.unit}`}
                  className="w-full p-2 border border-gold-300 rounded bg-ivory-50"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Hips</label>
                <input
                  type="text"
                  value={formData.hips}
                  onChange={(e) => handleChange('hips', e.target.value)}
                  placeholder={`42 ${formData.unit}`}
                  className="w-full p-2 border border-gold-300 rounded bg-ivory-50"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Sleeve Length</label>
                <input
                  type="text"
                  value={formData.sleeveLength}
                  onChange={(e) => handleChange('sleeveLength', e.target.value)}
                  placeholder={`21 ${formData.unit}`}
                  className="w-full p-2 border border-gold-300 rounded bg-ivory-50"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Trouser Length</label>
                <input
                  type="text"
                  value={formData.trouserLength}
                  onChange={(e) => handleChange('trouserLength', e.target.value)}
                  placeholder={`38 ${formData.unit}`}
                  className="w-full p-2 border border-gold-300 rounded bg-ivory-50"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Trouser Waist</label>
                <input
                  type="text"
                  value={formData.trouserWaist}
                  onChange={(e) => handleChange('trouserWaist', e.target.value)}
                  placeholder={`32 ${formData.unit}`}
                  className="w-full p-2 border border-gold-300 rounded bg-ivory-50"
                />
              </div>
            </div>

            <div className="pt-2 text-xs">
              <label className="block text-gray-600 mb-1">Additional Fitting Notes (Neckline depth, flare, etc.)</label>
              <input
                type="text"
                value={formData.additionalInstructions}
                onChange={(e) => handleChange('additionalInstructions', e.target.value)}
                placeholder="e.g. Deep round neck back with dori tassels, 16-kali flair for lehenga"
                className="w-full p-2 border border-gold-300 rounded bg-ivory-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-maroon-800 hover:bg-maroon-900 disabled:opacity-50 text-white font-serif font-bold text-sm tracking-widest uppercase rounded-lg shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Scissors className="w-4 h-4 text-gold-400" />
            <span>{loading ? 'Submitting Bespoke Request...' : 'Submit Tailoring Request for Quote'}</span>
          </button>
        </form>
      )}
    </div>
  );
};

export default CustomOrder;
