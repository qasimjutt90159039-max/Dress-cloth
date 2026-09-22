import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

export const EmbroideryGrid = () => {
  const craftTypes = [
    {
      name: 'Zardozi Work',
      urdu: 'زردوزی کام',
      desc: 'Heavily raised metallic bullion and dabka wiring for royal bridal wear.',
      filter: 'Zardozi',
      color: 'border-amber-400/60 bg-amber-50/20'
    },
    {
      name: 'Aari Needlework',
      urdu: 'آری کا کام',
      desc: 'Flawless floral gradient chains crafted with fine hooked wooden needles.',
      filter: 'Aari Work',
      color: 'border-emerald-400/60 bg-emerald-50/20'
    },
    {
      name: 'Multani Chikan Kaari',
      urdu: 'ملتانی چکن کاری',
      desc: 'Signature fine shadow work and openwork tarkashi on airy pure lawn.',
      filter: 'Chikankari',
      color: 'border-rose-400/60 bg-rose-50/20'
    },
    {
      name: 'Sheesha (Mirror Work)',
      urdu: 'شیشہ / آئینہ کاری',
      desc: 'Authentic hand-encased reflective glass mirrors framing dupattas & kurtis.',
      filter: 'Sheesha / Mirror Work',
      color: 'border-blue-400/60 bg-blue-50/20'
    },
    {
      name: 'Kashmiri Tilla',
      urdu: 'کشمیری تلہ دوزی',
      desc: 'Gleaming gold and silver twisted metallic threads embroidered on micro velvet.',
      filter: 'Kashmiri Tilla',
      color: 'border-yellow-400/60 bg-yellow-50/20'
    },
    {
      name: 'Resham Threadwork',
      urdu: 'ریشم کی کڑھائی',
      desc: 'Lustrous multi-colored silk threads woven into botanical motifs.',
      filter: 'Resham Thread Embroidery',
      color: 'border-purple-400/60 bg-purple-50/20'
    },
    {
      name: 'Sindhi Ralli Patchwork',
      urdu: 'سندھی رلی پیچ ورک',
      desc: 'Ancient geometric textile applique patchwork and running thread stitches.',
      filter: 'Sindhi Ralli Patchwork',
      color: 'border-orange-400/60 bg-orange-50/20'
    },
    {
      name: 'Balochi Needlework',
      urdu: 'بلوچی دوچ',
      desc: 'Complex geometric folk doch embroidery with vibrant silk floss.',
      filter: 'Balochi Needlework',
      color: 'border-red-400/60 bg-red-50/20'
    }
  ];

  return (
    <section className="py-16 bg-ivory-100 border-y border-gold-300/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-gold-700 font-bold flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-gold-500" />
            <span>Artisan Needlework Disciplines</span>
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-800">
            Shop by Embroidery Craft
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-muted">
            Explore centuries-old needle techniques passed down through generations of Pakistani karigars.
          </p>
          <div className="w-16 h-0.5 bg-gold-500 mx-auto mt-3" />
        </div>

        {/* Tile Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {craftTypes.map((craft, idx) => (
            <Link
              key={idx}
              to={`/shop?embroideryType=${encodeURIComponent(craft.filter)}`}
              className={`p-5 rounded-xl border ${craft.color} hover:border-gold-500 bg-white hover:bg-gold-50/40 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-serif font-bold text-gold-700 tracking-wider">
                    {craft.urdu}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-gold-400 group-hover:scale-125 transition-transform" />
                </div>
                <h3 className="font-serif text-lg font-bold text-charcoal group-hover:text-maroon-800 transition-colors">
                  {craft.name}
                </h3>
                <p className="text-xs text-charcoal-muted mt-2 leading-relaxed">
                  {craft.desc}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-maroon-800 group-hover:text-gold-700">
                <span>Explore Pieces</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EmbroideryGrid;
