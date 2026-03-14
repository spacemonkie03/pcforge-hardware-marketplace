export const formatINR = (value: number | string) => {
  const amount = typeof value === 'string' ? Number(value) : value;

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
};
