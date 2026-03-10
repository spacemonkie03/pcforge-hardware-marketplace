import React from 'react';
import { SelectedParts } from '../../store/usePcBuilderStore';
import { Product } from '../../features/products';

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
    <div className="glass-panel p-4 mt-4 text-xs">
      <h3 className="text-sm font-semibold mb-2">Build summary</h3>
      {picked.length ? (
        <>
          <ul className="space-y-1 mb-2">
            {picked.map((p) => (
              <li key={p.id} className="flex justify-between">
                <span>{p.name}</span>
                <span>${Number(p.price).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </>
      ) : (
        <p className="text-gray-400">No parts selected yet.</p>
      )}
      {valid !== undefined && (
        <div className="mt-3">
          {valid ? (
            <p className="text-green-400">Build looks compatible.</p>
          ) : (
            <ul className="text-red-400 list-disc ml-4">
              {issues.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

