import Link from 'next/link';
import React from 'react';
import { buildMarketplaceCategoryHref } from '../config/categories.config';
import { useUserStore } from '../store/useUserStore';

export const Footer: React.FC = () => {
  const user = useUserStore((s) => s.user);
  const isSeller = user?.role === 'SELLER' || user?.role === 'ADMIN';

  return (
    <footer className="border-t border-[var(--pf-border)] bg-[rgba(15,17,21,0.86)] backdrop-blur-xl">
      <div className="pf-main-container py-14">
        <div className={`grid grid-cols-1 gap-8 text-sm ${isSeller ? 'md:grid-cols-5' : 'md:grid-cols-4'}`}>
          <div>
            <h3 className="mb-3 text-lg font-semibold tracking-[-0.03em] text-white">
              PCForge
            </h3>
            <p className="text-sm leading-6 text-[var(--pf-text-secondary)]">
              A cleaner marketplace for research-heavy buyers who want clear specs, verified sellers, and a calmer way to plan a build.
            </p>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-white">Components</h4>
            <ul className="space-y-2 text-[var(--pf-text-secondary)]">
              <li><Link href={buildMarketplaceCategoryHref('cpu')} className="transition-colors hover:text-white">CPUs</Link></li>
              <li><Link href={buildMarketplaceCategoryHref('gpu')} className="transition-colors hover:text-white">GPUs</Link></li>
              <li><Link href={buildMarketplaceCategoryHref('motherboard')} className="transition-colors hover:text-white">Motherboards</Link></li>
              <li><Link href={buildMarketplaceCategoryHref('ram')} className="transition-colors hover:text-white">RAM</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-white">Platform</h4>
            <ul className="space-y-2 text-[var(--pf-text-secondary)]">
              <li><Link href="/pc-builder" className="transition-colors hover:text-white">PC Builder</Link></li>
              <li><Link href="/deals" className="transition-colors hover:text-white">Deals</Link></li>
              <li><Link href="/wishlist" className="transition-colors hover:text-white">Wishlist</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-white">Support</h4>
            <ul className="space-y-2 text-[var(--pf-text-secondary)]">
              <li><Link href="/help" className="transition-colors hover:text-white">Help Center</Link></li>
              <li><Link href="/contact" className="transition-colors hover:text-white">Contact Us</Link></li>
              <li><Link href="/trust-safety" className="transition-colors hover:text-white">Trust & Safety</Link></li>
            </ul>
          </div>
          {isSeller && (
            <div>
              <h4 className="mb-3 font-semibold text-white">Seller</h4>
              <ul className="space-y-2 text-[var(--pf-text-secondary)]">
                <li><Link href="/sell" className="transition-colors hover:text-white">Seller Portal</Link></li>
                <li><Link href="/dashboard/seller" className="transition-colors hover:text-white">Seller Dashboard</Link></li>
                <li><Link href="/dashboard/seller/listings" className="transition-colors hover:text-white">My Listings</Link></li>
              </ul>
            </div>
          )}
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-[var(--pf-border)] pt-6 text-center text-xs text-[var(--pf-text-secondary)] md:flex-row md:items-center md:justify-between">
          <p>&copy; 2026 PCForge. All rights reserved.</p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/privacy" className="transition-colors hover:text-white">Privacy</Link>
            <Link href="/terms" className="transition-colors hover:text-white">Terms</Link>
            <Link href="/cookies" className="transition-colors hover:text-white">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
