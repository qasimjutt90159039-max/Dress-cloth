import React from 'react';
import { Sparkles, Truck, ShieldCheck, RefreshCw, Award, HeartHandshake } from 'lucide-react';

export const TrustBadges = () => {
  const badges = [
    {
      icon: Sparkles,
      title: 'Multan Handcrafted',
      desc: 'Authentic generational needlework'
    },
    {
      icon: ShieldCheck,
      title: 'Cash on Delivery',
      desc: 'Pay upon parcel inspection'
    },
    {
      icon: Truck,
      title: 'Nationwide Delivery',
      desc: 'Delivering to all Pakistani cities'
    },
    {
      icon: Award,
      title: '100% Pure Fabrics',
      desc: 'Finest Lawn, Chiffon & Silk'
    },
    {
      icon: RefreshCw,
      title: '7-Day Easy Exchange',
      desc: 'Hassle-free size replacement'
    }
  ];

  return (
    <div className="bg-ivory-100 border-y border-gold-300/40 py-8 px-4 sm:px-6 lg:px-8 my-10">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
        {badges.map((b, i) => {
          const Icon = b.icon;
          return (
            <div key={i} className="flex flex-col items-center space-y-2 p-3">
              <div className="w-12 h-12 rounded-full bg-gold-500/10 border border-gold-400 flex items-center justify-center text-maroon-800">
                <Icon className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-sm text-charcoal">{b.title}</h4>
              <p className="text-[11px] text-charcoal-muted leading-tight">{b.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrustBadges;
