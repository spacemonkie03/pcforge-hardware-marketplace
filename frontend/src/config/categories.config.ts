export type CategoryIcon =
  | 'gpu'
  | 'cpu'
  | 'motherboard'
  | 'ram'
  | 'storage'
  | 'power'
  | 'cooler'
  | 'fan'
  | 'liquid'
  | 'case'
  | 'monitor'
  | 'keyboard'
  | 'mouse'
  | 'headset'
  | 'microphone';

export interface CategoryItemConfig {
  name: string;
  slug: string;
  icon: CategoryIcon;
  filterValue: string;
  description: string;
}

export interface CategoryGroupConfig {
  group: string;
  items: CategoryItemConfig[];
}

export const categoryGroups: CategoryGroupConfig[] = [
  {
    group: 'Core Components',
    items: [
      { name: 'GPU', slug: 'gpu', icon: 'gpu', filterValue: 'GPU', description: 'Graphics cards and marketplace GPU listings.' },
      { name: 'CPU', slug: 'cpu', icon: 'cpu', filterValue: 'CPU', description: 'Processors for gaming, workstations, and everyday builds.' },
      { name: 'Motherboard', slug: 'motherboard', icon: 'motherboard', filterValue: 'MOTHERBOARD', description: 'Boards for Intel and AMD platforms.' },
      { name: 'RAM', slug: 'ram', icon: 'ram', filterValue: 'RAM', description: 'Memory kits for performance and capacity upgrades.' },
      { name: 'Storage', slug: 'storage', icon: 'storage', filterValue: 'STORAGE', description: 'SSDs, HDDs, and fast boot-drive upgrades.' },
      { name: 'Power Supply', slug: 'power-supply', icon: 'power', filterValue: 'PSU', description: 'Reliable PSUs for stable power delivery.' },
    ],
  },
  {
    group: 'Cooling & Thermals',
    items: [
      { name: 'CPU Coolers', slug: 'cpu-coolers', icon: 'cooler', filterValue: 'CPU_COOLER', description: 'Air towers and compact cooling upgrades.' },
      { name: 'Case Fans', slug: 'case-fans', icon: 'fan', filterValue: 'CASE_FAN', description: 'Airflow-focused fans for quieter thermals.' },
      { name: 'Liquid Cooling', slug: 'liquid-cooling', icon: 'liquid', filterValue: 'LIQUID_COOLING', description: 'AIO and custom-loop ready cooling options.' },
    ],
  },
  {
    group: 'Cases & Displays',
    items: [
      { name: 'PC Cases', slug: 'pc-cases', icon: 'case', filterValue: 'CASE', description: 'Compact, airflow, and showcase chassis options.' },
      { name: 'Monitors', slug: 'monitors', icon: 'monitor', filterValue: 'MONITOR', description: 'Gaming and creator displays.' },
    ],
  },
  {
    group: 'Peripherals',
    items: [
      { name: 'Keyboard', slug: 'keyboard', icon: 'keyboard', filterValue: 'KEYBOARD', description: 'Mechanical and wireless keyboard setups.' },
      { name: 'Mouse', slug: 'mouse', icon: 'mouse', filterValue: 'MOUSE', description: 'Precision mice for competitive and daily use.' },
      { name: 'Headset', slug: 'headset', icon: 'headset', filterValue: 'HEADSET', description: 'Headsets for voice chat and immersive audio.' },
      { name: 'Microphone', slug: 'microphone', icon: 'microphone', filterValue: 'MICROPHONE', description: 'Streaming and call-ready microphone gear.' },
    ],
  },
];

export const categoryItems = categoryGroups.flatMap((group) => group.items);

export const marketplaceCategoryOptions = categoryItems.map((item) => ({
  value: item.filterValue,
  label: item.name,
}));

export const findCategoryBySlug = (slug?: string) =>
  categoryItems.find((item) => item.slug === slug);

export const buildMarketplaceCategoryHref = (slug: string) =>
  `/marketplace/${encodeURIComponent(slug)}`;

export const buildCategoryAssetCandidates = (slug: string) =>
  ['webp', 'png', 'jpg', 'jpeg'].map((extension) => `/categories/${slug}.${extension}`);
