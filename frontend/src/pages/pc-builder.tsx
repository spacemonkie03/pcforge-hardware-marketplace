import { Layout } from '../components/Layout';
import { useProducts } from '../hooks/useProducts';
import { PartSelector } from '../components/PcBuilder/PartSelector';
import { usePcBuilderStore } from '../store/usePcBuilderStore';
import { usePcBuilderValidation } from '../hooks/usePcBuilder';
import { PcBuilderSummary } from '../components/PcBuilder/PcBuilderSummary';

export default function PcBuilderPage() {
  const { data: products = [] } = useProducts();
  const selection = usePcBuilderStore((s) => s.selection);
  const setPart = usePcBuilderStore((s) => s.setPart);
  const reset = usePcBuilderStore((s) => s.reset);
  const { mutateAsync, data: validation } = usePcBuilderValidation();

  const productsById = Object.fromEntries(products.map((p) => [p.id, p]));
  const filter = (category: string) => products.filter((p) => p.category === category);

  const validate = async () => {
    await mutateAsync(selection);
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Smart PC Builder</h1>
        <p className="text-gray-400">
          Build your perfect PC with real-time compatibility checking and price tracking.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Parts Selection */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-white">Select Components</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <PartSelector
                label="CPU"
                options={filter('CPU')}
                value={selection.cpuId}
                onChange={(v) => setPart('cpuId', v)}
              />
              <PartSelector
                label="Motherboard"
                options={filter('MOTHERBOARD')}
                value={selection.motherboardId}
                onChange={(v) => setPart('motherboardId', v)}
              />
              <PartSelector
                label="GPU"
                options={filter('GPU')}
                value={selection.gpuId}
                onChange={(v) => setPart('gpuId', v)}
              />
              <PartSelector
                label="RAM"
                options={filter('RAM')}
                value={selection.ramId}
                onChange={(v) => setPart('ramId', v)}
              />
              <PartSelector
                label="Storage"
                options={filter('STORAGE')}
                value={selection.storageId}
                onChange={(v) => setPart('storageId', v)}
              />
              <PartSelector
                label="PSU"
                options={filter('PSU')}
                value={selection.psuId}
                onChange={(v) => setPart('psuId', v)}
              />
              <PartSelector
                label="Case"
                options={filter('CASE')}
                value={selection.caseId}
                onChange={(v) => setPart('caseId', v)}
              />
              <PartSelector
                label="CPU Cooler"
                options={filter('COOLER')}
                value={selection.coolerId}
                onChange={(v) => setPart('coolerId', v)}
              />
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={validate}
                className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
              >
                Validate Build
              </button>
              <button
                onClick={reset}
                className="px-6 py-2 rounded-lg border border-white/20 hover:border-red-400 hover:text-red-400 text-white font-medium transition-colors"
              >
                Reset Build
              </button>
            </div>
          </div>
        </div>

        {/* Build Summary */}
        <div className="lg:col-span-1">
          <PcBuilderSummary
            selection={selection}
            productsById={productsById}
            issues={validation?.issues || []}
            valid={validation?.valid}
          />
        </div>
      </div>
    </Layout>
  );
}

