import React from 'react';

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg border border-gold-200/50 p-3 space-y-3 animate-pulse">
      <div className="aspect-[3/4] bg-ivory-200 rounded-md" />
      <div className="space-y-2">
        <div className="h-3 bg-ivory-200 rounded w-1/3" />
        <div className="h-4 bg-ivory-200 rounded w-4/5" />
        <div className="h-3 bg-ivory-200 rounded w-1/2" />
        <div className="h-5 bg-ivory-200 rounded w-1/4 pt-1" />
      </div>
    </div>
  );
};

export const TableSkeleton = ({ rows = 5, cols = 5 }) => {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 p-3 bg-ivory-100 rounded">
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className="h-4 bg-ivory-200 rounded flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
};
