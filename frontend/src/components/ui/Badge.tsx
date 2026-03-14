import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'accent' | 'neutral' | 'success';
  className?: string;
}

export const Badge = ({ children, variant = 'neutral', className = '' }: BadgeProps) => {
  const variantClass =
    variant === 'accent'
      ? 'pf-badge pf-badge-accent'
      : variant === 'success'
        ? 'pf-badge pf-badge-success'
        : 'pf-badge';

  return <span className={`${variantClass} ${className}`.trim()}>{children}</span>;
};
