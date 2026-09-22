import React from 'react';
import { Star, Quote, CheckCircle } from 'lucide-react';

export const Testimonials = () => {
  const reviews = [
    {
      name: "Ayesha Malik",
      city: "DHA Phase 5, Lahore",
      product: "Shahi Noorani Zardozi Bridal Lehenga",
      rating: 5,
      comment: "I was hesitant ordering my Barat bridal lehenga online, but the team at Hand Embroidered Dresses Multan video-called me from their Hussain Agahi shop to show the adda work! The weight, finishing, and embroidery exceeded all designer boutiques in Lahore.",
      date: "September 2026"
    },
    {
      name: "Dr. Samina Rizvi",
      city: "Clifton, Karachi",
      product: "Multani Chikan Kaari Pure Lawn Kurti",
      rating: 5,
      comment: "The sheer breathability of this lawn combined with the neatness of the shadow stitches is unbelievable. Karachi humid weather demands this exact craftsmanship. Received via TCS in 3 days.",
      date: "August 2026"
    },
    {
      name: "Zainab Farooq",
      city: "F-7/2, Islamabad",
      product: "Imperial Kashmiri Tilla Velvet Shawl",
      rating: 5,
      comment: "The antique gold tilla border gleams so subtly in ambient lighting. Draped it for my brother's winter wedding and received endless compliments from relatives. Truly an heirloom!",
      date: "October 2026"
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-gold-700 font-bold">
          Trusted Across Pakistan
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-800">
          Words from Our Valued Patrons
        </h2>
        <div className="w-16 h-0.5 bg-gold-500 mx-auto mt-3" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((rev, i) => (
          <div
            key={i}
            className="p-6 bg-white rounded-xl border border-gold-300/40 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between relative"
          >
            <Quote className="w-8 h-8 text-gold-200 absolute top-4 right-4 pointer-events-none" />

            <div className="space-y-3">
              <div className="flex text-gold-500 gap-1">
                {Array.from({ length: rev.rating }).map((_, r) => (
                  <Star key={r} className="w-4 h-4 fill-gold-500 text-gold-500" />
                ))}
              </div>

              <p className="text-xs text-charcoal leading-relaxed italic">
                "{rev.comment}"
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-maroon-800 flex items-center gap-1">
                  <span>{rev.name}</span>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
                </h4>
                <p className="text-[11px] text-charcoal-muted">{rev.city}</p>
                <p className="text-[10px] text-gold-700 font-medium truncate max-w-[180px]">
                  {rev.product}
                </p>
              </div>
              <span className="text-[10px] text-gray-400">{rev.date}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
