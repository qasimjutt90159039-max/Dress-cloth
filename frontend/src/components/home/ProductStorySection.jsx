import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Scissors, Clock } from 'lucide-react';
import { formatPKR } from '../../utils/formatCurrency';

export const ProductStorySection = () => {
  const stories = [
    {
      title: "The Multani Kashikari Blue Tile Kurti",
      hours: "48 Artisan Hours",
      craft: "Tarkashi & Shadow Needlework",
      story: "Drawing spiritual design inspiration from the cobalt and turquoise glazed tiles of Multan's 800-year-old mausoleums, this kurti features drawn-thread openwork and delicate floral arches.",
      image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
      price: 4600,
      link: "/shop?search=blue"
    },
    {
      title: "Heirloom Shahi Noorani Zardozi Lehenga",
      hours: "320 Artisan Hours",
      craft: "Pure French Wire Bullion & Dabka",
      story: "Crafted by four master ustads working concurrently on a traditional adda frame. Over 300 grams of metallic gold coils, glass cut beads, and genuine velvet borders make this an enduring family treasure.",
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
      price: 65000,
      link: "/category/bridal-dresses"
    },
    {
      title: "Imperial Kashmiri Tilla Velvet Shawl",
      hours: "180 Artisan Hours",
      craft: "Metallic Tilla Cord Embroidery",
      story: "Sourced with genuine 9000 micro-velvet, each corner paisley (kalka) and running border is hand-stitched with tilla thread to ensure heavy drape without stiffness.",
      image: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80",
      price: 28000,
      link: "/category/shawls-dupattas"
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold-700 font-bold">
            Artisan Spotlight
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-800 mt-1">
            Behind the Stitches: Product Stories
          </h2>
        </div>
        <Link
          to="/about-us"
          className="text-xs font-serif font-bold text-maroon-800 hover:text-gold-700 flex items-center gap-1.5 uppercase tracking-wider"
        >
          <span>Read Our Full Multan Story</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stories.map((story, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gold-300/40 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[4/3] overflow-hidden bg-ivory-100">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-3 left-3 bg-maroon-900/90 backdrop-blur-sm text-gold-300 text-[10px] font-bold px-2.5 py-1 rounded flex items-center gap-1.5 border border-gold-500/30">
                  <Clock className="w-3 h-3 text-gold-400" />
                  <span>{story.hours}</span>
                </div>
              </div>

              <div className="p-5 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs text-gold-700 font-semibold">
                  <Scissors className="w-3.5 h-3.5" />
                  <span>{story.craft}</span>
                </div>

                <h3 className="font-serif text-xl font-bold text-charcoal">{story.title}</h3>

                <p className="text-xs text-charcoal-muted leading-relaxed line-clamp-4">
                  {story.story}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0 flex items-center justify-between border-t border-gray-100 mt-4">
              <div>
                <span className="text-[10px] text-gray-400 uppercase">Starting At</span>
                <p className="font-serif font-bold text-maroon-800 text-base">
                  {formatPKR(story.price)}
                </p>
              </div>
              <Link
                to={story.link}
                className="px-4 py-2 text-xs font-semibold bg-ivory-200 text-maroon-800 rounded hover:bg-gold-500 hover:text-white transition-colors"
              >
                View Piece
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductStorySection;
