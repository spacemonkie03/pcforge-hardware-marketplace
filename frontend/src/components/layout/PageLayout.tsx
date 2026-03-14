import { ReactNode } from 'react';
import { SiteLayout } from './SiteLayout';

interface PageLayoutProps {
  children: ReactNode;
  fullWidth?: boolean;
}

export const PageLayout = ({ children, fullWidth = false }: PageLayoutProps) => {
  return <SiteLayout fullWidth={fullWidth}>{children}</SiteLayout>;
};
