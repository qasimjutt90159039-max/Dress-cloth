import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const FeaturedCategories = () => {
  const categories = [
    {
      title: 'Bridal Wear',
      subtitle: 'Heirloom Zardozi Lehengas & Ghararas',
      link: '/category/bridal-dresses',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      tag: 'Grand Barat & Walima'
    },
    {
      title: 'Luxury Party Wear',
      subtitle: 'Resham, Gota & Chiffon Peshwas',
      link: '/category/party-wear',
      image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
      tag: 'Festive & Formal'
    },
    {
      title: 'Casual & Daily Wear',
      subtitle: 'Pure Lawn Multani Chikan Kaari',
      link: '/category/casual-daily-wear',
      image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
      tag: 'Daily Grace'
    },
    {
      title: 'Shawls & Dupattas',
      subtitle: 'Kashmiri Tilla Velvet & Phulkari',
      link: '/category/shawls-dupattas',
      image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
      tag: 'Winter Drapes'
    },
    {
      title: 'Unstitched Luxury Fabric',
      subtitle: 'Heavily Embroidered 3-Piece Suits',
      link: '/category/unstitched-fabric',
      image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80',
      tag: 'Bespoke Craft'
    },
    {
      title: 'Ready-to-Wear (Pret)',
      subtitle: 'Stitched Silk Co-ords & Designer Tunics',
      link: '/category/ready-to-wear',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
      tag: 'Pret-a-Porter'
    },
    {
      title: 'Kids Handcrafted Dresses',
      subtitle: 'Embroidered Anarkalis, Ghararas & Frocks',
      link: '/category/kids-dresses',
      image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80',
      tag: 'Little Princesses'
    },
    {
      title: 'Embroidered Maxis & Pishwas',
      subtitle: 'Floor-Length Kalidar & Mughal Gowns',
      link: '/category/maxis-pishwas',
      image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=800&q=80',
      tag: 'Grand Silhouettes'
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-gold-700 font-bold">
          Curated Pakistani Collections
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-800">
          Shop by Boutique Category
        </h2>
        <p className="text-xs sm:text-sm text-charcoal-muted">
          Each category represents decades of generational needlework, handcrafted by master artisans in Multan.
        </p>
      </div>

      {/* Categories Grid (8 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat, idx) => (
          <Link
            key={idx}
            to={cat.link}
            className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gold-300/40 flex flex-col h-80 bg-charcoal"
          >
            {/* Background Image with Zoom Effect */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700 ease-out brightness-90 group-hover:brightness-75"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
            </div>

            {/* Tag Badge */}
            <div className="relative z-10 p-4">
              <span className="inline-block px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase bg-gold-500/90 text-maroon-900 rounded backdrop-blur-sm shadow-sm">
                {cat.tag}
              </span>
            </div>

            {/* Card Footer Content */}
            <div className="relative z-10 mt-auto p-5 space-y-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="font-serif text-xl font-bold text-white group-hover:text-gold-300 transition-colors">
                {cat.title}
              </h3>
              <p className="text-xs text-ivory/80 line-clamp-1">
                {cat.subtitle}
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-gold-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>View Collection</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FeaturedCategories;
