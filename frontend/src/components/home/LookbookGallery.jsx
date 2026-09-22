import React from 'react';
import { Instagram, Sparkles } from 'lucide-react';

export const LookbookGallery = () => {
  const lookbookImages = [
    {
      url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
      caption: "Zardozi Bridal Couture @handembroidereddresses.pk",
      height: "h-64 sm:h-80"
    },
    {
      url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
      caption: "Aari Silk Gharara Set #MultaniCraft",
      height: "h-72 sm:h-96"
    },
    {
      url: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
      caption: "Pure Lawn Chikan Kaari Summer Edit",
      height: "h-60 sm:h-72"
    },
    {
      url: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80",
      caption: "Kashmiri Tilla Micro Velvet Shawl",
      height: "h-72 sm:h-96"
    },
    {
      url: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80",
      caption: "Unstitched Luxury 3-Piece Raw Silk",
      height: "h-64 sm:h-80"
    }
  ];

  return (
    <section className="py-16 bg-ivory-50 border-t border-gold-300/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-gold-700 font-bold flex items-center justify-center gap-1.5">
            <Instagram className="w-3.5 h-3.5 text-gold-600" />
            <span>@handembroidereddresses.pk</span>
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-800">
            Artisan Lookbook Gallery
          </h2>
          <p className="text-xs text-charcoal-muted">
            Tag us in your festive and wedding moments wearing Hand Embroidered Dresses.
          </p>
          <div className="w-16 h-0.5 bg-gold-500 mx-auto mt-3" />
        </div>

        {/* Masonry-Style Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 items-end">
          {lookbookImages.map((item, idx) => (
            <div
              key={idx}
              className={`group relative rounded-lg overflow-hidden border border-gold-300/60 shadow-sm ${item.height}`}
            >
              <img
                src={item.url}
                alt="lookbook"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-maroon-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <p className="text-[11px] text-ivory/90 line-clamp-2">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LookbookGallery;
