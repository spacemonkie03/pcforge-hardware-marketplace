import React from 'react';
import { formatINR } from '../utils/currency';
import { Card } from './ui/Card';

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
    <Card className="mt-4 p-4">
      <h4 className="mb-2 text-xs uppercase tracking-[0.14em] text-[var(--pf-text-secondary)]">Price history</h4>
      <svg viewBox="0 0 100 100" className="w-full h-32">
        <defs>
          <linearGradient id="line" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#8B5CF6" />
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
      <p className="mt-1 text-xs text-[var(--pf-text-secondary)]">
        Lowest: <span className="font-semibold text-[var(--pf-accent-primary)]">{formatINR(min)}</span>
      </p>
    </Card>
  );
};

