const categoryCoverBySlug: Record<string, string> = {
  gpu: '/images/categories/gpu.jpg',
  cpu: '/images/categories/cpu.jpg',
  motherboard: '/images/categories/motherboard.jpg',
  ram: '/images/categories/ram.png',
  storage: '/images/categories/storage.jpg',
  'power-supply': '/images/categories/psu.jpg',
  'pc-cases': '/images/categories/case.jpg',
  'cpu-coolers': '/images/categories/cooler.jpg',
};

const categoryCoverByProductCategory: Record<string, string> = {
  GPU: '/images/categories/gpu.jpg',
  CPU: '/images/categories/cpu.jpg',
  MOTHERBOARD: '/images/categories/motherboard.jpg',
  RAM: '/images/categories/ram.png',
  STORAGE: '/images/categories/storage.jpg',
  PSU: '/images/categories/psu.jpg',
  CASE: '/images/categories/case.jpg',
  CPU_COOLER: '/images/categories/cooler.jpg',
  COOLER: '/images/categories/cooler.jpg',
};

export const sharedPlaceholderImage = '/images/placeholders/component-fallback.svg';
export const sharedCategoryPlaceholderImage = '/images/placeholders/category-fallback.svg';

export const hasDedicatedCategoryCover = (slug?: string) => Boolean(slug && categoryCoverBySlug[slug]);

export const getCategoryCoverBySlug = (slug?: string) =>
  (slug ? categoryCoverBySlug[slug] : undefined) || sharedCategoryPlaceholderImage;

export const getFallbackImageForProductCategory = (category?: string) =>
  (category ? categoryCoverByProductCategory[category] : undefined) || sharedPlaceholderImage;

export const getFallbackImageForListing = () => categoryCoverByProductCategory.GPU;
