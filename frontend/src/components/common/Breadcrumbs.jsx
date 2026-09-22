import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumbs = ({ items = [] }) => {
  return (
    <nav aria-label="Breadcrumb" className="py-3 px-4 sm:px-0 text-xs text-charcoal-muted">
      <ol className="flex items-center flex-wrap gap-1.5">
        <li>
          <Link to="/" className="hover:text-maroon-800 flex items-center gap-1 transition-colors">
            <Home className="w-3.5 h-3.5 text-gold-600" />
            <span>Home</span>
          </Link>
        </li>
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-1.5">
            <ChevronRight className="w-3 h-3 text-gold-400" />
            {item.link ? (
              <Link to={item.link} className="hover:text-maroon-800 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="font-semibold text-charcoal">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
