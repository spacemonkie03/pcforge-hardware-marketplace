import { ReactNode } from 'react';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { BackgroundGrid } from './BackgroundGrid';

interface SiteLayoutProps {
  children: ReactNode;
  fullWidth?: boolean;
}

export const SiteLayout = ({ children, fullWidth = false }: SiteLayoutProps) => {
  return (
    <div className="relative min-h-screen text-white">
      <BackgroundGrid />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className={fullWidth ? 'w-full' : 'pf-main-container pf-page-main'}>{children}</div>
        </main>
        <Footer />
      </div>
    </div>
  );
};
