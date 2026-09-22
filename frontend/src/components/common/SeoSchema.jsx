import React from 'react';

export const SeoSchema = () => {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    "name": "Hand Embroidered Dresses",
    "image": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
    "telephone": "+92 318 6229753",
    "url": "https://handembroidered.pk",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Shop No. 7, Bata Wali, Hussain Agahi Main Chowk Bazar, Ghali Colony, near Firdouse Market, Inner City",
      "addressLocality": "Multan",
      "postalCode": "66000",
      "addressCountry": "PK"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 30.1984,
      "longitude": 71.4687
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "10:00",
        "closes": "22:00"
      }
    ],
    "priceRange": "PKR 2500 - PKR 65000",
    "currenciesAccepted": "PKR",
    "paymentAccepted": "Cash on Delivery, JazzCash, EasyPaisa, Bank Transfer"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
    />
  );
};

export default SeoSchema;
