import { useMemo, useState } from 'react';
import { Layout } from '../components/Layout';
import { useProducts } from '../hooks/useProducts';
import { PartSelector } from '../components/PcBuilder/PartSelector';
import { usePcBuilderStore } from '../store/usePcBuilderStore';
import { usePcBuilderValidation } from '../hooks/usePcBuilder';
import { PcBuilderSummary } from '../components/PcBuilder/PcBuilderSummary';
import { ButtonPrimary } from '../components/ui/ButtonPrimary';
import { ButtonSecondary } from '../components/ui/ButtonSecondary';
import { Card } from '../components/ui/Card';
import { SectionContainer } from '../components/ui/SectionContainer';

const steps = [
  { key: 'cpuId', label: 'Select CPU', category: 'CPU', guidance: 'Start with the platform. CPU choice determines motherboard socket compatibility.' },
  { key: 'motherboardId', label: 'Select Motherboard', category: 'MOTHERBOARD', guidance: 'Choose the board that matches your CPU socket and memory generation.' },
  { key: 'ramId', label: 'Select RAM', category: 'RAM', guidance: 'Keep memory type aligned with the motherboard before comparing speed and capacity.' },
  { key: 'gpuId', label: 'Select GPU', category: 'GPU', guidance: 'GPU affects budget and PSU requirements the most, so validate after this step.' },
  { key: 'storageId', label: 'Select Storage', category: 'STORAGE', guidance: 'Pick the primary SSD first, then decide whether you need additional storage.' },
  { key: 'psuId', label: 'Select PSU', category: 'PSU', guidance: 'Use wattage headroom, not minimum matching, especially once GPU TDP is known.' },
  { key: 'caseId', label: 'Select Case', category: 'CASE', guidance: 'Case clearance must handle GPU length and overall airflow goals.' },
  { key: 'coolerId', label: 'Select Cooler', category: 'COOLER', guidance: 'Cooling is the final compatibility check before reviewing the build.' },
  { key: 'review', label: 'Review Build', category: null, guidance: 'Run validation, review price, and look for compatibility warnings before checkout.' },
] as const;

export default function PcBuilderPage() {
  const { data: products = [] } = useProducts();
  const selection = usePcBuilderStore((s) => s.selection);
  const setPart = usePcBuilderStore((s) => s.setPart);
  const reset = usePcBuilderStore((s) => s.reset);
  const { mutateAsync, data: validation, isPending } = usePcBuilderValidation();
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const productsById = Object.fromEntries(products.map((p) => [p.id, p]));
  const step = steps[activeStepIndex];
  const completedSteps = steps.filter((item) => item.key !== 'review' && selection[item.key as keyof typeof selection]).length;
  const progress = Math.round((completedSteps / (steps.length - 1)) * 100);

  const options = useMemo(() => {
    if (!step.category) {
      return [];
    }
    return products.filter((p) => p.category === step.category);
  }, [products, step.category]);

  const selectedForStep =
    step.key === 'review' ? undefined : selection[step.key as keyof typeof selection];

  const validate = async () => {
    await mutateAsync(selection);
  };

  const nextStep = async () => {
    if (step.key === 'review') {
      await validate();
      return;
    }

    if (activeStepIndex === steps.length - 2) {
      setActiveStepIndex(steps.length - 1);
      await validate();
      return;
    }

    setActiveStepIndex((current) => Math.min(current + 1, steps.length - 1));
  };

  const previousStep = () => {
    setActiveStepIndex((current) => Math.max(current - 1, 0));
  };

  return (
    <Layout>
      <SectionContainer
        title="PC Builder"
        description="A guided, step-based flow that keeps compatibility, budget, and the next decision visible without overwhelming the screen."
      >
        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)_360px]">
          <Card className="p-5">
            <p className="pf-eyebrow">Build Progress</p>
            <div className="mt-4 rounded-xl border border-[var(--pf-border)] bg-white/[0.03] p-4">
              <p className="text-sm text-[var(--pf-text-secondary)]">Completion</p>
              <p className="mt-2 text-3xl font-semibold text-white">{progress}%</p>
              <div className="mt-4 h-2 rounded-full bg-white/5">
                <div
                  className="h-2 rounded-full bg-[var(--pf-accent-primary)] transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="mt-5 space-y-2">
              {steps.map((item, index) => {
                const complete = item.key !== 'review' && Boolean(selection[item.key as keyof typeof selection]);
                const active = index === activeStepIndex;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setActiveStepIndex(index)}
                    className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                      active
                        ? 'border-[rgba(96,165,250,0.4)] bg-[rgba(37,99,235,0.12)]'
                        : 'border-[var(--pf-border)] bg-white/[0.03] hover:border-[var(--pf-border-strong)]'
                    }`}
                  >
                    <span className={`mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                      complete ? 'bg-emerald-500/20 text-emerald-300' : active ? 'bg-[rgba(37,99,235,0.18)] text-[var(--pf-accent-secondary)]' : 'bg-white/5 text-[var(--pf-text-secondary)]'
                    }`}>
                      {index + 1}
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-white">{item.label}</span>
                      <span className="mt-1 block text-xs text-[var(--pf-text-secondary)]">
                        {complete ? 'Selected' : item.key === 'review' ? 'Validate and review' : 'Pending'}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="p-6 md:p-8">
            <p className="pf-eyebrow">Step {activeStepIndex + 1}</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">{step.label}</h2>
            <p className="mt-4 max-w-[60ch] text-sm leading-7 text-[var(--pf-text-secondary)]">
              {step.guidance}
            </p>

            {step.key !== 'review' ? (
              <div className="mt-8 space-y-5">
                <PartSelector
                  label={step.label.replace('Select ', '')}
                  options={options}
                  value={selectedForStep}
                  onChange={(value) => setPart(step.key as keyof typeof selection, value)}
                />
                <div className="rounded-xl border border-[var(--pf-border)] bg-white/[0.03] p-4">
                  <p className="text-sm font-medium text-white">
                    {selectedForStep ? 'Current selection' : 'No selection yet'}
                  </p>
                  <p className="mt-2 text-sm text-[var(--pf-text-secondary)]">
                    {selectedForStep
                      ? `${productsById[selectedForStep]?.name} is currently attached to this step.`
                      : 'Select a component to continue. You can still move between steps and revise the build at any time.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-[var(--pf-border)] bg-white/[0.03] p-5">
                  <p className="text-sm font-medium text-white">Compatibility status</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--pf-text-secondary)]">
                    {validation
                      ? validation.valid
                        ? 'Current build passes the validation checks supported by the backend.'
                        : 'Validation found compatibility issues that should be resolved before checkout.'
                      : 'Run validation to check socket, RAM, GPU clearance, and PSU requirements.'}
                  </p>
                </div>
                <div className="rounded-xl border border-[var(--pf-border)] bg-white/[0.03] p-5">
                  <p className="text-sm font-medium text-white">Coverage note</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--pf-text-secondary)]">
                    The current API validates core compatibility only. It does not yet expose recommendation feeds, saved builds, or alternative part suggestions.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonSecondary onClick={previousStep} disabled={activeStepIndex === 0}>
                Back
              </ButtonSecondary>
              <ButtonPrimary onClick={nextStep} disabled={isPending}>
                {step.key === 'review'
                  ? isPending
                    ? 'Validating...'
                    : 'Validate Build'
                  : activeStepIndex === steps.length - 2
                    ? 'Review Build'
                    : 'Continue'}
              </ButtonPrimary>
              <ButtonSecondary onClick={reset}>Reset Build</ButtonSecondary>
            </div>
          </Card>

          <div className="lg:col-span-1">
            <PcBuilderSummary
              selection={selection}
              productsById={productsById}
              issues={validation?.issues || []}
              valid={validation?.valid}
            />
          </div>
        </div>
      </SectionContainer>
    </Layout>
  );
}
