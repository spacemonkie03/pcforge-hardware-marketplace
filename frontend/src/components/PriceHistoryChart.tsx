import React from 'react';

interface PricePoint {
  recordedAt: string;
  price: number;
}

interface Props {
  history: PricePoint[];
}

export const PriceHistoryChart: React.FC<Props> = ({ history }) => {
  if (!history?.length) return null;
  const sorted = [...history].sort(
    (a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime()
  );

  const max = Math.max(...sorted.map((p) => p.price));
  const min = Math.min(...sorted.map((p) => p.price));

  const normalize = (price: number) =>
    ((price - min) / (max - min || 1)) * 80 + 10;

  return (
    <div className="glass-panel p-4 mt-4">
      <h4 className="text-xs text-gray-300 mb-2">Price history</h4>
      <svg viewBox="0 0 100 100" className="w-full h-32">
        <defs>
          <linearGradient id="line" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#32e5ff" />
            <stop offset="100%" stopColor="#ff00ff" />
          </linearGradient>
        </defs>
        {sorted.map((p, i) => {
          if (i === 0) return null;
          const prev = sorted[i - 1];
          const x1 = ((i - 1) / (sorted.length - 1 || 1)) * 100;
          const x2 = (i / (sorted.length - 1 || 1)) * 100;
          const y1 = 100 - normalize(prev.price);
          const y2 = 100 - normalize(p.price);
          return (
            <line
              key={p.recordedAt}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="url(#line)"
              strokeWidth="1.5"
            />
          );
        })}
      </svg>
      <p className="text-xs text-gray-400 mt-1">
        Lowest: <span className="text-neonBlue">${min.toFixed(2)}</span>
      </p>
    </div>
  );
};

