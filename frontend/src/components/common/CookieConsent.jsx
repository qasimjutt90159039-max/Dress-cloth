import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';

export const CookieConsent = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('hed_cookie_consent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('hed_cookie_consent', 'accepted');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-50 bg-maroon-900 text-ivory p-4 rounded-lg shadow-2xl border border-gold-500/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
      <div className="flex items-start gap-2.5">
        <ShieldCheck className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
        <p className="text-ivory/80 leading-relaxed">
          We use cookies to preserve your shopping bag and deliver a bespoke Multani boutique shopping experience.
        </p>
      </div>
      <button
        onClick={handleAccept}
        className="w-full sm:w-auto px-4 py-1.5 bg-gold-600 hover:bg-gold-500 text-maroon-950 font-bold rounded text-xs transition-colors shrink-0"
      >
        Accept
      </button>
    </div>
  );
};

export default CookieConsent;
