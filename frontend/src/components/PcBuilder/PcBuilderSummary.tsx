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
    <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6 sticky top-6">
      <h3 className="text-lg font-semibold mb-4 text-white">Build Summary</h3>

      {picked.length > 0 ? (
        <div className="space-y-3 mb-4">
          {picked.map((p) => (
            <div key={p.id} className="flex justify-between items-center py-2 border-b border-white/5">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{p.name}</p>
                <p className="text-xs text-gray-400">{p.category}</p>
              </div>
              <p className="text-sm font-semibold text-blue-400 ml-2">
                ${Number(p.price).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-sm mb-4">No components selected yet.</p>
      )}

      <div className="border-t border-white/10 pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-bold text-white">Total</span>
          <span className="text-xl font-bold text-blue-400">${total.toFixed(2)}</span>
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
    </div>
  );
};

