import { FormEvent, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Layout } from '../components/Layout';
import { createProduct } from '../features/products';
import { createListing } from '../features/listings';
import { GpuReference, searchGpus } from '../features/gpus';
import { useUserStore } from '../store/useUserStore';

type CategoryKey = 'CPU' | 'GPU' | 'MOTHERBOARD' | 'RAM' | 'STORAGE' | 'PSU';
type InputKind = 'text' | 'number' | 'select';
type InputScope = 'specs' | 'compatibility';

interface FieldDefinition {
  key: string;
  label: string;
  kind: InputKind;
  scope?: InputScope;
  placeholder?: string;
  min?: number;
  step?: number;
  options?: string[];
  help?: string;
}

const conditionOptions = [
  'New',
  'Like New',
  'Used - Excellent',
  'Used - Good',
  'Used - Fair',
];

const categoryOptions: { value: CategoryKey; label: string }[] = [
  { value: 'GPU', label: 'GPU' },
  { value: 'CPU', label: 'CPU' },
  { value: 'MOTHERBOARD', label: 'Motherboard' },
  { value: 'RAM', label: 'RAM' },
  { value: 'STORAGE', label: 'Storage' },
  { value: 'PSU', label: 'PSU' },
];

const categoryFieldMap: Record<CategoryKey, FieldDefinition[]> = {
  CPU: [
    { key: 'cpuSocket', label: 'Socket', kind: 'text', scope: 'compatibility', placeholder: 'AM5 / LGA1700' },
    { key: 'cores', label: 'Cores', kind: 'number', scope: 'specs', min: 1, step: 1, placeholder: '8' },
    { key: 'threads', label: 'Threads', kind: 'number', scope: 'specs', min: 1, step: 1, placeholder: '16' },
    { key: 'baseClockGHz', label: 'Base Clock (GHz)', kind: 'number', scope: 'specs', min: 0, step: 0.1, placeholder: '4.2' },
    { key: 'boostClockGHz', label: 'Boost Clock (GHz)', kind: 'number', scope: 'specs', min: 0, step: 0.1, placeholder: '5.6' },
    { key: 'tdp', label: 'TDP (W)', kind: 'number', scope: 'specs', min: 1, step: 1, placeholder: '125' },
    { key: 'cacheMb', label: 'Cache (MB)', kind: 'number', scope: 'specs', min: 1, step: 1, placeholder: '32' },
    { key: 'architecture', label: 'Architecture', kind: 'text', scope: 'specs', placeholder: 'Zen 4 / Raptor Lake' },
    { key: 'processNm', label: 'Process Node (nm)', kind: 'number', scope: 'specs', min: 1, step: 1, placeholder: '5' },
    { key: 'integratedGraphics', label: 'Integrated Graphics', kind: 'select', scope: 'specs', options: ['Yes', 'No'] },
  ],
  GPU: [
    { key: 'chipset', label: 'Chipset', kind: 'text', scope: 'specs', placeholder: 'RTX 4070 Ti Super / RX 7900 XT' },
    { key: 'vramGb', label: 'VRAM (GB)', kind: 'number', scope: 'specs', min: 1, step: 1, placeholder: '16' },
    { key: 'vramType', label: 'VRAM Type', kind: 'text', scope: 'specs', placeholder: 'GDDR6X' },
    { key: 'boostClockMHz', label: 'Boost Clock (MHz)', kind: 'number', scope: 'specs', min: 1, step: 1, placeholder: '2610' },
    { key: 'tdp', label: 'Board Power / TDP (W)', kind: 'number', scope: 'specs', min: 1, step: 1, placeholder: '285' },
    { key: 'gpuLengthMm', label: 'Card Length (mm)', kind: 'number', scope: 'compatibility', min: 1, step: 1, placeholder: '338' },
    { key: 'psuWattage', label: 'Recommended PSU Wattage', kind: 'number', scope: 'compatibility', min: 1, step: 1, placeholder: '750' },
    { key: 'powerConnectors', label: 'Power Connectors', kind: 'text', scope: 'specs', placeholder: '1x 16-pin / 2x 8-pin' },
  ],
  MOTHERBOARD: [
    { key: 'motherboardSocket', label: 'CPU Socket', kind: 'text', scope: 'compatibility', placeholder: 'AM5 / LGA1700' },
    { key: 'chipset', label: 'Chipset', kind: 'text', scope: 'specs', placeholder: 'B650 / Z790' },
    { key: 'formFactor', label: 'Form Factor', kind: 'select', scope: 'specs', options: ['E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'] },
    { key: 'ramType', label: 'RAM Type', kind: 'select', scope: 'compatibility', options: ['DDR4', 'DDR5'] },
    { key: 'memorySlots', label: 'Memory Slots', kind: 'number', scope: 'specs', min: 1, step: 1, placeholder: '4' },
    { key: 'maxMemoryGb', label: 'Max Memory (GB)', kind: 'number', scope: 'specs', min: 1, step: 1, placeholder: '192' },
    { key: 'pcieGeneration', label: 'PCIe Generation', kind: 'select', scope: 'specs', options: ['PCIe 4.0', 'PCIe 5.0'] },
    { key: 'm2Slots', label: 'M.2 Slots', kind: 'number', scope: 'specs', min: 0, step: 1, placeholder: '3' },
    { key: 'sataPorts', label: 'SATA Ports', kind: 'number', scope: 'specs', min: 0, step: 1, placeholder: '4' },
    { key: 'wifi', label: 'Built-in Wi-Fi', kind: 'select', scope: 'specs', options: ['Yes', 'No'] },
  ],
  RAM: [
    { key: 'ramType', label: 'RAM Type', kind: 'select', scope: 'compatibility', options: ['DDR4', 'DDR5'] },
    { key: 'capacityGb', label: 'Total Capacity (GB)', kind: 'number', scope: 'specs', min: 1, step: 1, placeholder: '32' },
    { key: 'sticks', label: 'Number of Sticks', kind: 'number', scope: 'specs', min: 1, step: 1, placeholder: '2' },
    { key: 'speedMtS', label: 'Speed (MT/s)', kind: 'number', scope: 'specs', min: 1, step: 1, placeholder: '6000' },
    { key: 'casLatency', label: 'CL Rating', kind: 'number', scope: 'specs', min: 1, step: 1, placeholder: '30' },
    { key: 'rank', label: 'Rank / Row', kind: 'select', scope: 'specs', options: ['Single Rank', 'Dual Rank'] },
    { key: 'voltage', label: 'Voltage', kind: 'number', scope: 'specs', min: 0, step: 0.01, placeholder: '1.35' },
    { key: 'heatspreaderHeightMm', label: 'Heatspreader Height (mm)', kind: 'number', scope: 'specs', min: 1, step: 1, placeholder: '44' },
    { key: 'rgb', label: 'RGB Lighting', kind: 'select', scope: 'specs', options: ['Yes', 'No'] },
  ],
  STORAGE: [
    { key: 'capacityGb', label: 'Capacity (GB)', kind: 'number', scope: 'specs', min: 1, step: 1, placeholder: '2000' },
    { key: 'storageType', label: 'Type', kind: 'select', scope: 'specs', options: ['NVMe SSD', 'SATA SSD', 'HDD'] },
    { key: 'formFactor', label: 'Form Factor', kind: 'select', scope: 'specs', options: ['M.2 2280', '2.5-inch', '3.5-inch', 'Add-in Card'] },
    { key: 'interface', label: 'Interface', kind: 'text', scope: 'specs', placeholder: 'PCIe 4.0 x4 / SATA III' },
    { key: 'readSpeedMbps', label: 'Read Speed (MB/s)', kind: 'number', scope: 'specs', min: 1, step: 1, placeholder: '7450' },
    { key: 'writeSpeedMbps', label: 'Write Speed (MB/s)', kind: 'number', scope: 'specs', min: 1, step: 1, placeholder: '6900' },
    { key: 'nandType', label: 'NAND Type', kind: 'text', scope: 'specs', placeholder: 'TLC / QLC' },
    { key: 'dramCache', label: 'DRAM Cache', kind: 'select', scope: 'specs', options: ['Yes', 'No'] },
    { key: 'enduranceTbw', label: 'Endurance (TBW)', kind: 'number', scope: 'specs', min: 1, step: 1, placeholder: '1200' },
  ],
  PSU: [
    { key: 'psuWattage', label: 'Wattage (W)', kind: 'number', scope: 'compatibility', min: 1, step: 1, placeholder: '850' },
    { key: 'efficiency', label: 'Efficiency Rating', kind: 'select', scope: 'specs', options: ['80+ Bronze', '80+ Gold', '80+ Platinum', '80+ Titanium'] },
    { key: 'modularity', label: 'Modularity', kind: 'select', scope: 'specs', options: ['Non-modular', 'Semi-modular', 'Fully modular'] },
    { key: 'atxVersion', label: 'ATX Standard', kind: 'text', scope: 'specs', placeholder: 'ATX 3.0 / ATX 3.1' },
    { key: 'pcieConnectors', label: 'PCIe Connectors', kind: 'text', scope: 'specs', placeholder: '3x 8-pin / 1x 12VHPWR' },
    { key: 'fanSizeMm', label: 'Fan Size (mm)', kind: 'number', scope: 'specs', min: 1, step: 1, placeholder: '135' },
    { key: 'warrantyYears', label: 'Warranty (Years)', kind: 'number', scope: 'specs', min: 0, step: 1, placeholder: '10' },
    { key: 'cybeneticsNoise', label: 'Noise Rating', kind: 'text', scope: 'specs', placeholder: 'A / Standard / Quiet' },
  ],
};

const initialValues: Record<string, string | boolean> = {
  category: 'GPU',
  name: '',
  brand: '',
  condition: 'Used - Good',
  price: '',
  ageYears: '',
  description: '',
  imageUrls: '',
  inStock: true,
};

const categoryDescriptions: Record<CategoryKey, string> = {
  CPU: 'Capture core specs, socket, clocks, power draw, and platform compatibility.',
  GPU: 'Include VRAM, power needs, board dimensions, and graphics-specific details.',
  MOTHERBOARD: 'Capture chipset, socket, form factor, memory support, and expansion details.',
  RAM: 'Include CL rating, MT/s speed, rank, kit size, voltage, and memory type.',
  STORAGE: 'Include capacity, form factor, interface, NAND, DRAM cache, and throughput.',
  PSU: 'Capture wattage, efficiency, modularity, connector set, and power-supply standards.',
};

function normalizeValue(value: string | boolean) {
  if (typeof value === 'boolean') {
    return value;
  }

  if (value === '') {
    return undefined;
  }

  if (value === 'Yes') {
    return true;
  }

  if (value === 'No') {
    return false;
  }

  const numeric = Number(value);
  if (!Number.isNaN(numeric) && value.trim() !== '') {
    return numeric;
  }

  return value;
}

export default function SellPage() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const [form, setForm] = useState<Record<string, string | boolean>>(initialValues);
  const [gpuQuery, setGpuQuery] = useState('');
  const [selectedGpu, setSelectedGpu] = useState<GpuReference | null>(null);

  const category = form.category as CategoryKey;
  const categoryFields = useMemo(() => categoryFieldMap[category], [category]);

  const productMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      router.push(`/?category=${category}#marketplace`);
    },
  });

  const listingMutation = useMutation({
    mutationFn: createListing,
    onSuccess: () => {
      router.push('/dashboard/seller');
    },
  });

  const gpuSearch = useQuery({
    queryKey: ['gpu-search', gpuQuery],
    queryFn: () => searchGpus(gpuQuery),
    enabled: category === 'GPU' && gpuQuery.trim().length >= 2,
  });

  const isSeller = user?.role === 'SELLER' || user?.role === 'ADMIN';

  const setValue = (key: string, value: string | boolean) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (category === 'GPU') {
      if (!selectedGpu) {
        return;
      }

      listingMutation.mutate({
        gpuId: selectedGpu.id,
        price: Number(form.price),
        condition: String(form.condition),
        description: String(form.description || ''),
        images: String(form.imageUrls || '')
          .split('\n')
          .map((value) => value.trim())
          .filter(Boolean),
      });
      return;
    }

    const specs: Record<string, unknown> = {
      condition: normalizeValue(form.condition),
      ageYears: normalizeValue(form.ageYears),
    };

    const compatibility: Record<string, unknown> = {};

    categoryFields.forEach((field) => {
      const value = normalizeValue(form[field.key] ?? '');
      if (value === undefined) {
        return;
      }

      if (field.scope === 'compatibility') {
        compatibility[field.key] = value;
        return;
      }

      specs[field.key] = value;
    });

    productMutation.mutate({
      name: String(form.name),
      brand: String(form.brand),
      category,
      price: Number(form.price),
      inStock: Boolean(form.inStock),
      specs,
      compatibility,
    });
  };

  return (
    <Layout>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="mb-2 text-3xl font-bold">
            Create <span className="text-blue-400">Component Listing</span>
          </h1>
          <p className="max-w-2xl text-gray-400">{categoryDescriptions[category]}</p>
        </div>
        <Link
          href="/dashboard/seller"
          className="rounded-lg border border-white/20 px-4 py-2 text-sm transition-colors hover:border-blue-400 hover:text-blue-400"
        >
          Seller Dashboard
        </Link>
      </div>

      {!user && (
        <div className="glass-panel max-w-xl p-6 text-sm">
          <p className="mb-4 text-gray-300">You need to log in before creating a listing.</p>
          <Link href="/login" className="inline-flex rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
            Go to Login
          </Link>
        </div>
      )}

      {user && !isSeller && (
        <div className="glass-panel max-w-xl p-6 text-sm">
          <p className="text-red-400">
            Your account is not a seller account. The backend only allows sellers or admins to create products.
          </p>
        </div>
      )}

      {user && isSeller && (
        <form onSubmit={submit} className="glass-panel max-w-5xl space-y-8 p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Component Category</label>
              <select
                value={category}
                onChange={(e) => {
                  const nextCategory = e.target.value as CategoryKey;
                  setValue('category', nextCategory);
                  if (nextCategory !== 'GPU') {
                    setSelectedGpu(null);
                    setGpuQuery('');
                  }
                }}
                className="w-full rounded-lg border border-white/10 bg-gray-700/50 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {category !== 'GPU' && (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Brand</label>
                  <input
                    value={String(form.brand)}
                    onChange={(e) => setValue('brand', e.target.value)}
                    placeholder="Corsair, ASUS, MSI, AMD, Intel..."
                    className="w-full rounded-lg border border-white/10 bg-gray-700/50 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300">Product Name</label>
                  <input
                    value={String(form.name)}
                    onChange={(e) => setValue('name', e.target.value)}
                    placeholder="Exact model name as buyers would search for it"
                    className="w-full rounded-lg border border-white/10 bg-gray-700/50 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
                    required
                  />
                </div>
              </>
            )}

            {category === 'GPU' && (
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-300">GPU Reference</label>
                <input
                  value={gpuQuery}
                  onChange={(e) => {
                    setGpuQuery(e.target.value);
                    setSelectedGpu(null);
                  }}
                  placeholder="Search GPU reference data: 3070, rx 6800, arc a770..."
                  className="w-full rounded-lg border border-white/10 bg-gray-700/50 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
                  required
                />
                {gpuSearch.data && gpuSearch.data.length > 0 && !selectedGpu && (
                  <div className="rounded-lg border border-white/10 bg-[#11131a] p-2">
                    <div className="flex max-h-56 flex-col gap-2 overflow-auto">
                      {gpuSearch.data.map((gpu) => (
                        <button
                          key={gpu.id}
                          type="button"
                          onClick={() => {
                            setSelectedGpu(gpu);
                            setGpuQuery(gpu.name);
                          }}
                          className="rounded-lg border border-white/5 px-3 py-2 text-left transition-colors hover:border-blue-400/40 hover:bg-white/5"
                        >
                          <div className="text-sm font-medium text-white">{gpu.name}</div>
                          <div className="text-xs text-gray-400">
                            {gpu.manufacturer} • {gpu.vramGb ?? '-'} GB • PCIe {gpu.pcieVersion ?? '-'} • {gpu.tdpWatts ?? '-'}W
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {selectedGpu && (
                  <div className="rounded-lg border border-blue-400/30 bg-blue-400/10 p-3 text-sm text-blue-100">
                    <p className="font-medium">{selectedGpu.name}</p>
                    <p className="mt-1 text-xs text-blue-200/80">
                      {selectedGpu.manufacturer} • {selectedGpu.architecture || 'Architecture not listed'} • {selectedGpu.vramGb ?? '-'} GB {selectedGpu.memoryType || ''}
                    </p>
                  </div>
                )}
                {gpuQuery.trim().length >= 2 && gpuSearch.data?.length === 0 && !gpuSearch.isFetching && (
                  <p className="text-xs text-gray-500">No GPU reference matches found.</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Condition</label>
              <select
                value={String(form.condition)}
                onChange={(e) => setValue('condition', e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-gray-700/50 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
              >
                {conditionOptions.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Price</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={String(form.price)}
                onChange={(e) => setValue('price', e.target.value)}
                placeholder="499.99"
                className="w-full rounded-lg border border-white/10 bg-gray-700/50 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
                required
              />
            </div>

            {category !== 'GPU' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Age (Years)</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={String(form.ageYears)}
                  onChange={(e) => setValue('ageYears', e.target.value)}
                  placeholder="2"
                  className="w-full rounded-lg border border-white/10 bg-gray-700/50 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
                  required
                />
              </div>
            )}

            {category === 'GPU' && (
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-300">Description</label>
                <textarea
                  value={String(form.description || '')}
                  onChange={(e) => setValue('description', e.target.value)}
                  placeholder="Mention condition details, accessories, usage history, and anything buyers should know."
                  className="min-h-28 w-full rounded-lg border border-white/10 bg-gray-700/50 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
                />
              </div>
            )}

            {category === 'GPU' && (
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-300">Image URLs</label>
                <textarea
                  value={String(form.imageUrls || '')}
                  onChange={(e) => setValue('imageUrls', e.target.value)}
                  placeholder="One image URL per line"
                  className="min-h-24 w-full rounded-lg border border-white/10 bg-gray-700/50 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
                />
              </div>
            )}
          </div>

          {category !== 'GPU' && (
            <>
              <div>
                <h2 className="mb-4 text-lg font-semibold text-white">Technical Specifications</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {categoryFields.map((field) => (
                    <div
                      key={field.key}
                      className={field.key === 'psuWattage' ? 'space-y-2 md:col-span-2' : 'space-y-2'}
                    >
                      <label className="block text-sm font-medium text-gray-300">{field.label}</label>
                      {field.kind === 'select' ? (
                        <select
                          value={String(form[field.key] ?? '')}
                          onChange={(e) => setValue(field.key, e.target.value)}
                          className="w-full rounded-lg border border-white/10 bg-gray-700/50 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
                        >
                          <option value="">Select an option</option>
                          {field.options?.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.kind}
                          min={field.min}
                          step={field.step}
                          value={String(form[field.key] ?? '')}
                          onChange={(e) => setValue(field.key, e.target.value)}
                          placeholder={field.placeholder}
                          className="w-full rounded-lg border border-white/10 bg-gray-700/50 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
                          required
                        />
                      )}
                      {field.help && <p className="text-xs text-gray-500">{field.help}</p>}
                    </div>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-3 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={Boolean(form.inStock)}
                  onChange={(e) => setValue('inStock', e.target.checked)}
                />
                Mark as in stock
              </label>
            </>
          )}

          {(productMutation.isError || listingMutation.isError) && (
            <p className="text-sm text-red-400">
              Failed to create listing. Make sure you are logged in as a seller and the backend is running.
            </p>
          )}

          <div className="flex flex-wrap gap-4">
            <button
              type="submit"
              disabled={productMutation.isPending || listingMutation.isPending || (category === 'GPU' && !selectedGpu)}
              className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {productMutation.isPending || listingMutation.isPending ? 'Creating...' : `Post ${category} Listing`}
            </button>
            <Link
              href={`/?category=${category}#marketplace`}
              className="rounded-lg border border-white/20 px-6 py-2 font-medium text-white transition-colors hover:border-blue-400 hover:text-blue-400"
            >
              Cancel
            </Link>
          </div>
        </form>
      )}
    </Layout>
  );
}
