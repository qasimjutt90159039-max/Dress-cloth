import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2, Truck, CreditCard, Bell, MapPin } from 'lucide-react';
import api from '../../services/api';

export const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const [form, setForm] = useState({
    storeName: 'Hand Embroidered Dresses',
    phone: '03186229753',
    whatsapp: '+923186229753',
    email: 'info@handembroidered.pk',
    address: 'Shop No. 7, Bata Wali, Hussain Agahi Main Chowk Bazar, Ghali Colony, near Firdouse Market, Inner City, Multan, 66000, Pakistan',
    defaultShippingFee: 250,
    freeShippingThreshold: 5000,
    enableCOD: true,
    enableJazzCash: true,
    jazzCashNumber: '03186229753',
    jazzCashTitle: 'Hand Embroidered Dresses',
    enableEasyPaisa: true,
    easyPaisaNumber: '03186229753',
    easyPaisaTitle: 'Hand Embroidered Dresses',
    enableBankTransfer: true,
    bankName: 'Meezan Bank Ltd.',
    bankAccountTitle: 'Hand Embroidered Dresses',
    bankAccountNumber: '01020304050607',
    bankIBAN: 'PK92MEZN0001020304050607',
    announcementBarText: '✨ Nationwide Delivery Across Pakistan | Free Shipping on orders over Rs. 5,000 | Authentic Multani Hand Embroidery',
    showAnnouncementBar: true
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        if (res.data.settings) {
          setForm(res.data.settings);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg('');

    try {
      await api.put('/settings', form);
      setSaveMsg('Store settings saved successfully!');
      setTimeout(() => setSaveMsg(''), 3500);
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-xs text-gray-500">Loading settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <div>
          <h2 className="font-serif text-2xl font-bold text-maroon-800">
            Store Operations & Gateway Settings
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure Pakistani payment accounts, delivery rates, and store contact info.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-5 py-2.5 bg-maroon-800 hover:bg-maroon-900 disabled:opacity-50 text-white font-serif font-bold text-xs uppercase tracking-wider rounded shadow flex items-center gap-2"
        >
          <Save className="w-4 h-4 text-gold-300" />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {saveMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{saveMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Shipping & Delivery Tariffs */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-base text-maroon-800 flex items-center gap-2 border-b pb-2">
            <Truck className="w-4 h-4 text-gold-600" />
            <span>Courier Rates & Free Shipping Rule</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Standard Courier Tariff (PKR)</label>
              <input
                type="number"
                value={form.defaultShippingFee}
                onChange={(e) => handleChange('defaultShippingFee', Number(e.target.value))}
                className="w-full p-2.5 border border-gray-300 rounded font-bold"
              />
              <p className="text-[10px] text-gray-400 mt-1">Default flat rate applied to domestic shipments.</p>
            </div>

            <div>
              <label className="block font-semibold mb-1">Free Delivery Threshold (PKR)</label>
              <input
                type="number"
                value={form.freeShippingThreshold}
                onChange={(e) => handleChange('freeShippingThreshold', Number(e.target.value))}
                className="w-full p-2.5 border border-gray-300 rounded font-bold"
              />
              <p className="text-[10px] text-gray-400 mt-1">Orders above this amount automatically receive free delivery.</p>
            </div>
          </div>
        </div>

        {/* Pakistani Payment Accounts Configuration */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-base text-maroon-800 flex items-center gap-2 border-b pb-2">
            <CreditCard className="w-4 h-4 text-gold-600" />
            <span>Payment Methods & Merchant Accounts</span>
          </h3>

          <div className="space-y-4">
            {/* COD */}
            <div className="p-3 bg-gray-50 rounded border flex items-center justify-between">
              <div>
                <span className="font-bold text-charcoal">Cash on Delivery (COD)</span>
                <p className="text-gray-400 text-[11px]">Allow customers to pay rider at their doorstep.</p>
              </div>
              <input
                type="checkbox"
                checked={form.enableCOD}
                onChange={(e) => handleChange('enableCOD', e.target.checked)}
                className="w-4 h-4 text-maroon-800"
              />
            </div>

            {/* JazzCash */}
            <div className="p-4 bg-gray-50 rounded border space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-charcoal">JazzCash Wallet</span>
                <input
                  type="checkbox"
                  checked={form.enableJazzCash}
                  onChange={(e) => handleChange('enableJazzCash', e.target.checked)}
                  className="w-4 h-4 text-maroon-800"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 mb-1">JazzCash Account Number</label>
                  <input
                    type="text"
                    value={form.jazzCashNumber}
                    onChange={(e) => handleChange('jazzCashNumber', e.target.value)}
                    className="w-full p-2 bg-white border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">JazzCash Account Title</label>
                  <input
                    type="text"
                    value={form.jazzCashTitle}
                    onChange={(e) => handleChange('jazzCashTitle', e.target.value)}
                    className="w-full p-2 bg-white border border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>

            {/* EasyPaisa */}
            <div className="p-4 bg-gray-50 rounded border space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-charcoal">EasyPaisa Account</span>
                <input
                  type="checkbox"
                  checked={form.enableEasyPaisa}
                  onChange={(e) => handleChange('enableEasyPaisa', e.target.checked)}
                  className="w-4 h-4 text-maroon-800"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 mb-1">EasyPaisa Mobile Number</label>
                  <input
                    type="text"
                    value={form.easyPaisaNumber}
                    onChange={(e) => handleChange('easyPaisaNumber', e.target.value)}
                    className="w-full p-2 bg-white border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">EasyPaisa Account Title</label>
                  <input
                    type="text"
                    value={form.easyPaisaTitle}
                    onChange={(e) => handleChange('easyPaisaTitle', e.target.value)}
                    className="w-full p-2 bg-white border border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>

            {/* Bank Transfer */}
            <div className="p-4 bg-gray-50 rounded border space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-charcoal">Direct Bank Wire Transfer</span>
                <input
                  type="checkbox"
                  checked={form.enableBankTransfer}
                  onChange={(e) => handleChange('enableBankTransfer', e.target.checked)}
                  className="w-4 h-4 text-maroon-800"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={form.bankName}
                    onChange={(e) => handleChange('bankName', e.target.value)}
                    className="w-full p-2 bg-white border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Account Title</label>
                  <input
                    type="text"
                    value={form.bankAccountTitle}
                    onChange={(e) => handleChange('bankAccountTitle', e.target.value)}
                    className="w-full p-2 bg-white border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Account Number</label>
                  <input
                    type="text"
                    value={form.bankAccountNumber}
                    onChange={(e) => handleChange('bankAccountNumber', e.target.value)}
                    className="w-full p-2 bg-white border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">IBAN</label>
                  <input
                    type="text"
                    value={form.bankIBAN}
                    onChange={(e) => handleChange('bankIBAN', e.target.value)}
                    className="w-full p-2 bg-white border border-gray-300 rounded uppercase font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Announcement Bar & Business Info */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-base text-maroon-800 flex items-center gap-2 border-b pb-2">
            <Bell className="w-4 h-4 text-gold-600" />
            <span>Announcement Strip & Store Identity</span>
          </h3>

          <div>
            <label className="block font-semibold mb-1">Announcement Bar Text</label>
            <input
              type="text"
              value={form.announcementBarText}
              onChange={(e) => handleChange('announcementBarText', e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold mb-1">Store Phone / WhatsApp</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Store Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="sm:col-span-1">
              <label className="block font-semibold mb-1">Address in Multan</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 bg-maroon-800 hover:bg-maroon-900 disabled:opacity-50 text-white font-serif font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4 text-gold-300" />
          <span>{saving ? 'Updating Settings...' : 'Save All Settings'}</span>
        </button>
      </form>
    </div>
  );
};

export default AdminSettings;
