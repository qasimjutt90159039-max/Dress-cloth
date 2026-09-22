import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Phone, MessageCircle } from 'lucide-react';
import Breadcrumbs from '../components/common/Breadcrumbs';

export const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: "Where is your physical store located in Multan?",
      a: "Our flagship retail boutique and artisan workshop is located at Shop No. 7, Bata Wali, Hussain Agahi Main Chowk Bazar, Ghali Colony, near Firdouse Market, Inner City, Multan, 66000, Pakistan. We welcome walk-in visitors Monday through Saturday from 10:00 AM to 10:00 PM."
    },
    {
      q: "How long does nationwide delivery take across Pakistan?",
      a: "Ready-to-wear and unstitched in-stock items are dispatched within 24 hours from Multan. TCS, Leopards, and Trax couriers typically deliver to major cities (Lahore, Karachi, Islamabad, Faisalabad, Rawalpindi) within 2 to 4 business days. Other regional cities take 3 to 5 business days."
    },
    {
      q: "Is Cash on Delivery (COD) available in my city?",
      a: "Yes! We offer Cash on Delivery across all cities, towns, and union councils in Pakistan serviced by domestic couriers. You only pay when the rider hands over your parcel."
    },
    {
      q: "How can I submit custom measurements for bespoke bridal or formal wear?",
      a: "You can visit our 'Custom Tailoring' page and fill out our guided measurements form (covering bust, waist, hips, shirt length, etc.) along with reference photos. Alternatively, you can WhatsApp us directly at 03186229753 for an interactive video consultation with our head master tailor."
    },
    {
      q: "What is your Return and Exchange Policy?",
      a: "We offer a 7-day hassle-free exchange policy on all standard pret and unstitched items if there is any size mismatch or defect. Custom-stitched bespoke bridal orders are crafted to your exact verified specifications and cannot be refunded, though complimentary alterations are provided."
    },
    {
      q: "Are the dresses truly 100% hand embroidered?",
      a: "Yes. Every single piece in our boutique is handcrafted using traditional wooden adda frames. We use authentic French bullion wire, Dabka, Nakshi, pure cotton threads, and hand-cut mirrors. We take immense pride in supporting over 200 rural women and artisan families in South Punjab."
    },
    {
      q: "How do I take care of heavy Zardozi or Tilla embroidered dresses?",
      a: "Heavily embellished bridal and formal wear must always be dry cleaned by reputable professionals. Never spray perfume directly onto metallic embroidery. Iron only on the reverse side on low-to-medium heat, and store outfits wrapped in breathable cotton or muslin fabric."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Breadcrumbs items={[{ label: 'Frequently Asked Questions' }]} />

      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-800">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
          Everything you need to know about our Multani artisan dresses, shipping, sizing, and bespoke orders.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gold-300/60 shadow-sm divide-y divide-gray-100 overflow-hidden">
        {faqs.map((faq, idx) => (
          <div key={idx} className="transition-colors">
            <button
              onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}
              className="w-full p-5 text-left flex justify-between items-center gap-4 hover:bg-ivory-50 transition-colors"
            >
              <span className="font-serif font-bold text-sm sm:text-base text-charcoal">
                {faq.q}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-gold-600 shrink-0 transition-transform duration-300 ${
                  openIdx === idx ? 'rotate-180 text-maroon-800' : ''
                }`}
              />
            </button>

            {openIdx === idx && (
              <div className="px-5 pb-5 text-xs text-charcoal-muted leading-relaxed border-t border-gold-100 bg-ivory-50/50 pt-3">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Still need help CTA */}
      <div className="bg-ivory-100 p-6 rounded-xl border border-gold-300 text-center space-y-3">
        <h3 className="font-serif font-bold text-lg text-maroon-800">Still Have Questions?</h3>
        <p className="text-xs text-charcoal-muted max-w-md mx-auto">
          Our Multan boutique support team is available on WhatsApp to answer any specific dress inquiries.
        </p>
        <a
          href="https://wa.me/923186229753"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#25D366] text-white font-bold text-xs uppercase tracking-wider rounded-md shadow"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span>WhatsApp Us at 03186229753</span>
        </a>
      </div>
    </div>
  );
};

export default FAQ;
