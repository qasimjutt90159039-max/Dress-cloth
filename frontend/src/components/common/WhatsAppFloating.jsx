import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export const WhatsAppFloating = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  const phone = '923186229753';
  const message = encodeURIComponent(
    'As-salamu alaykum! I am browsing Hand Embroidered Dresses Multan and would like assistance with an order or product inquiry.'
  );
  const whatsappUrl = `https://wa.me/${phone}?text=${message}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Tooltip Popup */}
      {showTooltip && (
        <div className="mb-2 p-3 bg-white text-charcoal rounded-lg shadow-xl border border-gold-300 max-w-xs flex items-start gap-2 text-xs animate-bounce">
          <div>
            <p className="font-bold text-maroon-800">Need help choosing?</p>
            <p className="text-[11px] text-charcoal-muted">Chat with our Multan artisans on WhatsApp!</p>
          </div>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-gray-400 hover:text-gray-600 p-0.5"
            aria-label="Close message"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp 03186229753"
        className="w-14 h-14 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-all duration-300 group"
      >
        <MessageCircle className="w-7 h-7 fill-white text-white group-hover:rotate-12 transition-transform" />
      </a>
    </div>
  );
};

export default WhatsAppFloating;
