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
      <h1 className="text-xl font-semibold mb-4">Smart PC Builder</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-panel p-4 space-y-3 text-xs">
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
          <div className="flex gap-3 mt-3">
            <button
              onClick={validate}
              className="px-3 py-1 rounded-full bg-neonBlue/30 border border-neonBlue text-xs"
            >
              Validate build
            </button>
            <button
              onClick={reset}
              className="px-3 py-1 rounded-full border border-white/20 text-xs"
            >
              Reset
            </button>
          </div>
        </div>
        <PcBuilderSummary
          selection={selection}
          productsById={productsById}
          issues={validation?.issues || []}
          valid={validation?.valid}
        />
      </div>
    </Layout>
  );
}

