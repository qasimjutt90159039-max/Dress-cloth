import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const HeroSlider = () => {
  const slides = [
    {
      badge: "Multan Heritage Masterpieces",
      title: "Royal Zardozi & Aari Bridal Heirlooms",
      subtitle: "Each garment is hand-embellished by generational karigars in the historic alleys of Multan, taking over 300 artisan hours.",
      ctaText: "Explore Bridal Collection",
      ctaLink: "/category/bridal-dresses",
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1800&q=85",
      tag: "Pure Silk & Velvet"
    },
    {
      badge: "Summer Breathable Luxury",
      title: "Pure Lawn Chikan Kaari & Shadow Work",
      subtitle: "Delicate shadow work, tarkashi, and phanda stitches on 100% fine combed lawn. Crafted for graceful summer living.",
      ctaText: "Shop Casual Wear",
      ctaLink: "/category/casual-daily-wear",
      image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1800&q=85",
      tag: "100% Pure Lawn"
    },
    {
      badge: "Winter Opulence",
      title: "Imperial Kashmiri Tilla Velvet Shawls",
      subtitle: "Lush micro-velvet wraps adorned with dense metallic gold tilla borders, reflecting centuries of royal grandeur.",
      ctaText: "Discover Shawls",
      ctaLink: "/category/shawls-dupattas",
      image: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1800&q=85",
      tag: "Micro Velvet 9000"
    }
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[current];

  return (
    <section className="relative bg-maroon-950 text-ivory overflow-hidden min-h-[560px] lg:min-h-[660px] flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={slide.image}
          alt={slide.title}
          className="w-full h-full object-cover object-center opacity-40 scale-105 transition-all duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-maroon-950 via-maroon-950/80 to-transparent" />
      </div>

      {/* Decorative Gold Border Frame */}
      <div className="absolute inset-4 pointer-events-none border border-gold-500/20 hidden md:block" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Text Content */}
        <div className="lg:col-span-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-600/20 border border-gold-500/40 text-gold-300 text-xs tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
            <span>{slide.badge}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-ivory leading-tight tracking-tight drop-shadow-md">
            {slide.title}
          </h1>

          <p className="text-sm sm:text-base text-ivory/80 max-w-2xl leading-relaxed">
            {slide.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              to={slide.ctaLink}
              className="px-8 py-3.5 bg-gold-600 hover:bg-gold-500 text-maroon-950 font-serif font-bold text-sm tracking-wider uppercase rounded shadow-xl hover:shadow-gold-500/20 transition-all flex items-center gap-2 group"
            >
              <span>{slide.ctaText}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/custom-order"
              className="px-6 py-3.5 border border-gold-400/60 hover:border-gold-300 text-ivory font-serif text-sm tracking-wider uppercase rounded hover:bg-gold-500/10 transition-all"
            >
              Custom Bespoke Tailoring
            </Link>
          </div>

          <div className="flex items-center gap-6 pt-6 text-xs text-gold-200/90 border-t border-gold-500/20">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-gold-400" />
              <span>Cash on Delivery Across Pakistan</span>
            </span>
            <span>•</span>
            <span>Shop in Multan: Hussain Agahi Bazar</span>
          </div>
        </div>

        {/* Asymmetric Product Preview Thumbnail */}
        <div className="hidden lg:block lg:col-span-4">
          <div className="relative p-2 bg-gradient-to-br from-gold-400/40 to-transparent rounded-2xl shadow-2xl">
            <div className="aspect-[4/5] rounded-xl overflow-hidden border-2 border-gold-400 shadow-inner bg-maroon-900">
              <img
                src={slide.image}
                alt="Product preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-maroon-900 border border-gold-400 px-4 py-2 rounded-lg shadow-xl text-center">
              <p className="text-[10px] uppercase tracking-widest text-gold-400 font-bold">Craft Authenticity</p>
              <p className="font-serif font-bold text-xs text-ivory">{slide.tag}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Slider Controls */}
      <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2">
        <button
          onClick={() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)}
          className="p-2.5 rounded-full bg-maroon-900/80 border border-gold-500/40 text-gold-300 hover:bg-maroon-800 transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex gap-1.5 px-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all ${
                current === i ? 'w-6 bg-gold-400' : 'w-2 bg-gold-400/30'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
          className="p-2.5 rounded-full bg-maroon-900/80 border border-gold-500/40 text-gold-300 hover:bg-maroon-800 transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};

export default HeroSlider;
