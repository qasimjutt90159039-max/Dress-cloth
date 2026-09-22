import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Sparkles, Heart, Award, Users, CheckCircle, ArrowRight } from 'lucide-react';
import Breadcrumbs from '../components/common/Breadcrumbs';

export const AboutUs = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      <Breadcrumbs items={[{ label: 'Our Multan Artisan Story' }]} />

      {/* Hero Narrative */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-100 border border-gold-300 text-maroon-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span>Generational Craftsmanship</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-maroon-800 leading-tight">
            The Living Heritage of Multani Hand Embroidery
          </h1>

          <p className="text-sm sm:text-base text-charcoal leading-relaxed">
            For centuries, the historic City of Saints—<strong>Multan</strong>—has been celebrated across the subcontinent for its poetic needlecraft and spiritual blue glazed tile work. At <strong>Hand Embroidered Dresses</strong>, we are proud stewards of this living tradition.
          </p>

          <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
            Operating from our flagship boutique at <strong>Shop No. 7, Bata Wali, Hussain Agahi Main Chowk Bazar, Ghali Colony, near Firdouse Market, Inner City, Multan</strong>, our workshop bridges ancient needle techniques with the elegance required by modern brides and discerning fashion lovers.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-ivory-100 rounded-lg border border-gold-200">
              <h4 className="font-serif font-bold text-xl text-maroon-800">5+ Generations</h4>
              <p className="text-xs text-charcoal-muted">Of master ustads guiding embroidery frames</p>
            </div>
            <div className="p-4 bg-ivory-100 rounded-lg border border-gold-200">
              <h4 className="font-serif font-bold text-xl text-maroon-800">200+ Artisans</h4>
              <p className="text-xs text-charcoal-muted">Village women empowered across South Punjab</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="aspect-[4/5] rounded-2xl overflow-hidden border-2 border-gold-400 shadow-2xl bg-maroon-900">
            <img
              src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80"
              alt="Artisan working on an adda embroidery frame in Multan"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* The 4 Craft Pillars */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-gold-700 font-bold">
            The Artisan Creed
          </p>
          <h2 className="font-serif text-3xl font-bold text-maroon-800">
            Why Discerning Clients Choose Our Multan Shop
          </h2>
          <div className="w-16 h-0.5 bg-gold-500 mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed">
          <div className="p-6 bg-white rounded-xl border border-gold-300/60 shadow-sm space-y-3">
            <Award className="w-8 h-8 text-gold-600" />
            <h3 className="font-serif text-lg font-bold text-maroon-800">100% Real Needlework</h3>
            <p className="text-charcoal-muted">
              We never substitute machine embroideries or plastic threads. Every dress utilizes genuine French bullion, pure Nakshi, Dabka, fine cotton threads, and hand-cut mirrors that endure for generations.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-gold-300/60 shadow-sm space-y-3">
            <Heart className="w-8 h-8 text-gold-600" />
            <h3 className="font-serif text-lg font-bold text-maroon-800">Fair Wages & Empowerment</h3>
            <p className="text-charcoal-muted">
              Our Chikankari, shadow work, and Ralli pieces are crafted by rural female needleworkers. By shopping directly with us, you eliminate middlemen and help support their households.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-gold-300/60 shadow-sm space-y-3">
            <Sparkles className="w-8 h-8 text-gold-600" />
            <h3 className="font-serif text-lg font-bold text-maroon-800">Pure Fabrics Only</h3>
            <p className="text-charcoal-muted">
              We handpick premium 80/80 count lawn, heavy micro-velvet, pure Banarsi silk, and pure crinkle chiffon so the embroidery rests on superior, breathable drapery.
            </p>
          </div>
        </div>
      </div>

      {/* Flagship Store Invitation */}
      <div className="bg-maroon-900 text-ivory rounded-2xl p-8 sm:p-12 border-2 border-gold-500 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 max-w-xl">
          <span className="text-xs uppercase tracking-widest text-gold-400 font-bold">
            Visit Us in Person
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-ivory">
            Experience the Craft at Our Hussain Agahi Store
          </h3>
          <p className="text-xs text-ivory/80 leading-relaxed">
            Visiting Multan? Come witness our ustads working on live adda frames and browse through hundreds of ready unstitched fabrics and bridal samples.
          </p>
          <div className="flex items-center gap-2 text-xs text-gold-300 pt-2 font-medium">
            <MapPin className="w-4 h-4 shrink-0 text-gold-400" />
            <span>Shop No. 7, Bata Wali, Hussain Agahi Main Chowk Bazar, Inner City, Multan</span>
          </div>
        </div>

        <Link
          to="/contact-us"
          className="px-8 py-3.5 bg-gold-600 hover:bg-gold-500 text-maroon-950 font-serif font-bold text-xs uppercase tracking-wider rounded shadow-xl shrink-0 transition-colors flex items-center gap-2"
        >
          <span>Store Map & Contact</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default AboutUs;
