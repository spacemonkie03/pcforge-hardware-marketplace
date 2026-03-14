import { ReactNode } from 'react';

interface SectionContainerProps {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export const SectionContainer = ({
  title,
  description,
  actions,
  children,
  className = '',
}: SectionContainerProps) => {
  return (
    <section className={`pf-section ${className}`.trim()}>
      {(title || description || actions) && (
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            {title && <h1 className="pf-page-title">{title}</h1>}
            {description && <p className="pf-page-subtitle">{description}</p>}
          </div>
          {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
};
