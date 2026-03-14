import { formatINR } from '../../utils/currency';

interface PriceTagProps {
  price: number;
  className?: string;
}

export const PriceTag = ({ price, className = '' }: PriceTagProps) => {
  return <p className={`pf-price ${className}`.trim()}>{formatINR(price)}</p>;
};
