import React from 'react';
import { useLanguageStore } from '../../store/useLanguageStore';
import { Sparkles, Phone } from 'lucide-react';

export const AnnouncementBar = () => {
  const { t } = useLanguageStore();

  return (
    <div className="bg-maroon-800 text-ivory text-xs sm:text-sm py-2 px-4 border-b border-gold-500/30">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <Sparkles className="w-3.5 h-3.5 text-gold-400 shrink-0 animate-pulse" />
          <span className="font-medium tracking-wide">
            {t.announcement}
          </span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-xs text-gold-300">
          <a
            href="https://wa.me/923186229753"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Phone className="w-3 h-3 text-gold-400" />
            <span>03186229753 (Multan Boutique)</span>
          </a>
          <span>|</span>
          <span>Cash on Delivery</span>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
