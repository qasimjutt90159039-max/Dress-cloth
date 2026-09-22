import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export const ArtisanCraftSection = () => {
  return (
    <section className="py-20 bg-maroon-900 text-ivory relative overflow-hidden border-y-2 border-gold-500">
      {/* Subtle textile texture & floral motifs */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-gold-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-96 h-96 bg-maroon-700/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Editorial Collage */}
        <div className="relative">
          <div className="aspect-[4/5] rounded-2xl overflow-hidden border-2 border-gold-400 shadow-2xl bg-maroon-950">
            <img
              src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80"
              alt="Artisan needlework in Multan"
              className="w-full h-full object-cover opacity-90"
            />
          </div>

          {/* Floating Address Card */}
          <div className="absolute -bottom-6 -right-6 bg-white text-charcoal p-4 sm:p-5 rounded-xl shadow-2xl border border-gold-400 max-w-xs hidden sm:block">
            <div className="flex items-center gap-2 text-maroon-800 font-bold text-xs mb-1">
              <MapPin className="w-4 h-4 text-gold-600 shrink-0" />
              <span>Inner City Multan Boutique</span>
            </div>
            <p className="text-[11px] text-charcoal-muted leading-tight">
              Shop No. 7, Bata Wali, Hussain Agahi Main Chowk Bazar, Ghali Colony, Multan.
            </p>
          </div>
        </div>

        {/* Right Craft Description */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-600/20 border border-gold-400/30 text-gold-300 text-xs tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Preserving 5 Generations of Needlecraft</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-ivory leading-tight">
            Handcrafted with Soul in the Historic Alleys of Multan
          </h2>

          <p className="text-sm text-ivory/80 leading-relaxed">
            Nestled inside the vibrant Hussain Agahi Bazar near Firdouse Market, <strong>Hand Embroidered Dresses</strong> is dedicated to keeping Pakistan's handloom and needlecraft heritage alive. Every motif begins with traditional hand-carved woodblocks (chapa), followed by patient weeks of embroidery on stretched wooden adda frames.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
              <p className="text-xs text-ivory/90">
                <strong>Empowering Female Artisans:</strong> Our Chikankari and shadow work collections directly support over 200 women artisans across South Punjab villages.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
              <p className="text-xs text-ivory/90">
                <strong>Pure & Unadulterated Fabrics:</strong> We only embroider on premium lawn, micro-velvet, pure raw silk, and authentic chiffon that withstand decades.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
              <p className="text-xs text-ivory/90">
                <strong>Bespoke Bridal Tailoring:</strong> Have a specific color, measurement, or heirloom design in mind? Our Multan ustads craft customized bridal lehengas on request.
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap gap-4">
            <Link
              to="/about-us"
              className="px-6 py-3 bg-gold-600 hover:bg-gold-500 text-maroon-950 font-serif font-bold text-xs uppercase tracking-wider rounded shadow-lg transition-colors flex items-center gap-2"
            >
              <span>Our Artisan Story</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              to="/custom-order"
              className="px-6 py-3 border border-gold-400 text-ivory hover:bg-gold-500/10 font-serif text-xs uppercase tracking-wider rounded transition-colors"
            >
              Request Custom Order
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArtisanCraftSection;
