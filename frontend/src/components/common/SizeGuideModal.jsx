import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';

export const SizeGuideModal = ({ isOpen, onClose }) => {
  const [unit, setUnit] = useState('inches'); // 'inches' | 'cm'

  if (!isOpen) return null;

  const kurtiSizes = [
    { size: 'XS', chest: 34, waist: 30, hip: 38, shoulder: 13.5, length: 38 },
    { size: 'S', chest: 36, waist: 32, hip: 40, shoulder: 14, length: 39 },
    { size: 'M', chest: 39, waist: 35, hip: 43, shoulder: 14.5, length: 40 },
    { size: 'L', chest: 42, waist: 38, hip: 46, shoulder: 15, length: 41 },
    { size: 'XL', chest: 45, waist: 41, hip: 49, shoulder: 16, length: 42 },
    { size: 'XXL', chest: 48, waist: 44, hip: 52, shoulder: 16.5, length: 42 }
  ];

  const formatVal = (val) => {
    if (unit === 'cm') {
      return Math.round(val * 2.54);
    }
    return `${val}"`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl border border-gold-300 overflow-hidden">
        {/* Header */}
        <div className="bg-ivory-100 p-4 border-b border-gold-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-maroon-800">
            <Ruler className="w-5 h-5 text-gold-600" />
            <h3 className="font-serif font-bold text-lg">Pakistani Dress Size Guide</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-ivory-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Unit Toggle & Content */}
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-charcoal-muted">
              Standard Pakistani boutique sizing. For custom tailoring, visit our Bespoke Orders page.
            </p>
            <div className="flex border border-gold-300 rounded overflow-hidden text-xs">
              <button
                onClick={() => setUnit('inches')}
                className={`px-3 py-1 font-semibold ${
                  unit === 'inches' ? 'bg-maroon-800 text-white' : 'bg-ivory-100 text-charcoal'
                }`}
              >
                Inches (")
              </button>
              <button
                onClick={() => setUnit('cm')}
                className={`px-3 py-1 font-semibold ${
                  unit === 'cm' ? 'bg-maroon-800 text-white' : 'bg-ivory-100 text-charcoal'
                }`}
              >
                Centimeters (cm)
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-maroon-800 text-ivory">
                  <th className="p-2.5 font-semibold">Size</th>
                  <th className="p-2.5 font-semibold">Chest / Bust</th>
                  <th className="p-2.5 font-semibold">Waist</th>
                  <th className="p-2.5 font-semibold">Hip</th>
                  <th className="p-2.5 font-semibold">Shoulder</th>
                  <th className="p-2.5 font-semibold">Shirt Length</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {kurtiSizes.map((row) => (
                  <tr key={row.size} className="hover:bg-ivory-100 transition-colors">
                    <td className="p-2.5 font-bold text-maroon-800">{row.size}</td>
                    <td className="p-2.5">{formatVal(row.chest)}</td>
                    <td className="p-2.5">{formatVal(row.waist)}</td>
                    <td className="p-2.5">{formatVal(row.hip)}</td>
                    <td className="p-2.5">{formatVal(row.shoulder)}</td>
                    <td className="p-2.5">{formatVal(row.length)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Measuring Tips */}
          <div className="bg-ivory-50 p-4 rounded border border-gold-200 text-xs space-y-2 text-charcoal">
            <h4 className="font-bold text-maroon-800">Measuring Tips from Our Multan Karigars:</h4>
            <ul className="list-disc list-inside space-y-1 text-charcoal-muted">
              <li><strong>Chest:</strong> Measure across the fullest part of your bust from armpit to armpit.</li>
              <li><strong>Shirt Length:</strong> Measure straight from high shoulder point down to the desired hem.</li>
              <li><strong>Unstitched Fabric:</strong> Comes with generous running fabric (approx. 2.75 to 3.25 meters) so you can get it tailored to your exact measurements.</li>
            </ul>
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-200 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-maroon-800 text-white rounded hover:bg-maroon-900"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};

export default SizeGuideModal;
