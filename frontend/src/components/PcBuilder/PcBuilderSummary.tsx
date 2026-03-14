import React from 'react';
import { SelectedParts } from '../../store/usePcBuilderStore';
import { Product } from '../../features/products';
import { getFallbackImageForProductCategory } from '../../utils/imageAssets';
import { formatINR } from '../../utils/currency';
import { Card } from '../ui/Card';

interface Props {
  selection: SelectedParts;
  productsById: Record<string, Product>;
  issues: string[];
  valid?: boolean;
}

export const PcBuilderSummary: React.FC<Props> = ({
  selection,
  productsById,
  issues,
  valid
}) => {
  const picked = Object.values(selection)
    .filter(Boolean)
    .map((id) => productsById[id!])
    .filter(Boolean);

  const total = picked.reduce((sum, p) => sum + Number(p.price), 0);

  return (
    <Card className="sticky top-24 p-6">
      <p className="pf-eyebrow">Build Summary</p>
      <h3 className="mt-2 text-xl font-semibold text-white">Current selection</h3>

      {picked.length > 0 ? (
        <div className="mb-4 space-y-3">
          {picked.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-3 border-b border-[var(--pf-border)] py-3">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-[var(--pf-border)] bg-white/[0.03]">
                  <img
                    src={p.images?.[0] || getFallbackImageForProductCategory(p.category)}
                    alt={p.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{p.name}</p>
                  <p className="text-xs text-[var(--pf-text-secondary)]">{p.category}</p>
                </div>
              </div>
              <p className="ml-2 text-sm font-semibold text-[var(--pf-accent-primary)]">
                {formatINR(p.price)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mb-4 text-sm text-[var(--pf-text-secondary)]">No components selected yet.</p>
      )}

      <div className="border-t border-[var(--pf-border)] pt-4">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-lg font-bold text-white">Total</span>
          <span className="text-xl font-bold text-[var(--pf-accent-primary)]">{formatINR(total)}</span>
        </div>

        {valid !== undefined && (
          <div className="space-y-2">
            {valid ? (
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Build looks compatible
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Compatibility issues
                </div>
                <ul className="text-red-400 text-xs list-disc ml-6 space-y-1">
                  {issues.map((i, idx) => (
                    <li key={idx}>{i}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

