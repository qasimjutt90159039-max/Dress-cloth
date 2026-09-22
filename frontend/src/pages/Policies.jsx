import React, { useState } from 'react';
import { Truck, RotateCcw, Shield, FileText } from 'lucide-react';
import Breadcrumbs from '../components/common/Breadcrumbs';

export const Policies = () => {
  const [activeTab, setActiveTab] = useState('shipping');

  const tabs = [
    { id: 'shipping', label: 'Shipping & Delivery', icon: Truck },
    { id: 'returns', label: 'Return & Exchange', icon: RotateCcw },
    { id: 'privacy', label: 'Privacy Policy', icon: Shield },
    { id: 'terms', label: 'Terms & Conditions', icon: FileText }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Breadcrumbs items={[{ label: 'Store Policies' }]} />

      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-800">
          Store Policies & Customer Commitments
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-muted">
          Clear, transparent policies for our patrons across Pakistan and overseas.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center border-b border-gold-300/40">
        <div className="flex flex-wrap gap-2 sm:gap-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-4 text-xs font-serif font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
                  isActive
                    ? 'border-maroon-800 text-maroon-800 font-extrabold'
                    : 'border-transparent text-charcoal-muted hover:text-maroon-800'
                }`}
              >
                <Icon className="w-4 h-4 text-gold-600" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white p-6 sm:p-10 rounded-2xl border border-gold-300/60 shadow-sm text-xs sm:text-sm text-charcoal leading-relaxed space-y-6">
        {activeTab === 'shipping' && (
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-maroon-800">
              Shipping & Delivery Policy
            </h2>
            <p>
              At <strong>Hand Embroidered Dresses</strong>, we operate our primary dispatch center from our store in <strong>Hussain Agahi Bazar, Multan</strong>. We partner with Pakistan's premier courier services—including TCS Express, Leopards Courier, Trax, and M&P—to ensure safe and prompt doorstep delivery nationwide.
            </p>
            <h4 className="font-bold text-maroon-800 pt-2">Delivery Timelines:</h4>
            <ul className="list-disc list-inside space-y-1 text-charcoal-muted pl-2">
              <li><strong>Ready-to-Wear (Pret) & Unstitched Fabric:</strong> Dispatched within 24 hours. Transit time to major cities (Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad) is 2 to 4 business days.</li>
              <li><strong>Bespoke Custom Orders:</strong> Crafted according to agreed timeline (usually 14 to 30 days depending on embroidery density).</li>
            </ul>
            <h4 className="font-bold text-maroon-800 pt-2">Shipping Charges:</h4>
            <p className="text-charcoal-muted">
              Standard nationwide courier delivery is flat <strong>Rs. 250</strong>. Orders totaling <strong>Rs. 5,000 or above</strong> automatically qualify for <strong>FREE NATIONWIDE DELIVERY</strong>.
            </p>
          </div>
        )}

        {activeTab === 'returns' && (
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-maroon-800">
              Return & Exchange Policy
            </h2>
            <p>
              We want you to be completely delighted with your heirloom Multani garments. We offer a friendly <strong>7-Day Exchange Policy</strong> starting from the day your parcel is delivered.
            </p>
            <h4 className="font-bold text-maroon-800 pt-2">Conditions for Exchange:</h4>
            <ul className="list-disc list-inside space-y-1 text-charcoal-muted pl-2">
              <li>Items must be unused, unwashed, unaltered, and with all original tags attached.</li>
              <li>Notify us via WhatsApp at <strong>03186229753</strong> or email <strong>orders@handembroidered.pk</strong> within 7 days of delivery.</li>
              <li>Customers can exchange for a different size, alternative color, or another dress of equivalent value.</li>
              <li>Custom bridal lehengas and tailored outfits made to personal measurements are non-refundable, but we provide free fitting adjustments if needed.</li>
            </ul>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-maroon-800">
              Privacy Policy
            </h2>
            <p>
              Your personal privacy is of paramount importance to us. When you register, browse, or place an order on <strong>handembroidered.pk</strong>, your delivery details, contact numbers, and payment slips are securely encrypted.
            </p>
            <p className="text-charcoal-muted">
              We never sell, rent, or distribute your private contact details or addresses to any third-party advertisers. Information collected is used strictly to fulfill your order, provide courier tracking SMS updates, and inform you of bespoke order progress.
            </p>
          </div>
        )}

        {activeTab === 'terms' && (
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-maroon-800">
              Terms & Conditions
            </h2>
            <p>
              By accessing and purchasing from <strong>Hand Embroidered Dresses</strong>, you agree to our standard boutique terms of service:
            </p>
            <ul className="list-disc list-inside space-y-1 text-charcoal-muted pl-2">
              <li>Every item is handcrafted by artisans. Minor subtle nuances in thread shade or stitch placement reflect genuine handmade authenticity and are not defects.</li>
              <li>All prices are quoted in Pakistani Rupees (PKR / Rs.) and are inclusive of standard applicable taxes.</li>
              <li>Cash on Delivery orders are subject to telephonic or WhatsApp confirmation before dispatch from our Multan shop.</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Policies;
