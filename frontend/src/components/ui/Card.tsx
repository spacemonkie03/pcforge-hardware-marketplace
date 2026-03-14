import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  elevated?: boolean;
}

export const Card = ({ children, className = '', elevated = false }: CardProps) => {
  return (
    <div className={`pf-card ${elevated ? 'pf-card-hover' : ''} ${className}`.trim()}>
      {children}
    </div>
  );
};
