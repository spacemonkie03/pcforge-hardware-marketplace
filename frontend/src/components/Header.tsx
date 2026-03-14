import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { buildMarketplaceCategoryHref, categoryGroups } from '../config/categories.config';
import { useUserStore } from '../store/useUserStore';
import { ProfileMenu } from './ProfileMenu';
import { SearchBar } from './ui/SearchBar';

const quickCategories = categoryGroups.flatMap((group) => group.items).slice(0, 6);

export const Header = () => {
  const user = useUserStore((s) => s.user);
  const isSeller = user?.role === 'SELLER' || user?.role === 'ADMIN';
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [router.asPath]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      document.body.style.overflow = '';
      return undefined;
    }

    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navItems = useMemo(
    () => [
      { href: '/marketplace', label: 'Marketplace' },
      { href: '/pc-builder', label: 'PC Builder' },
      { href: '/cart', label: 'Cart' },
      ...(isSeller ? [{ href: '/sell', label: 'Seller Access' }] : []),
    ],
    [isSeller],
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/marketplace?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--pf-border)] bg-[rgba(15,17,21,0.88)] backdrop-blur-xl">
        <div className="pf-main-container flex min-h-[72px] items-center gap-4 py-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-sidebar"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--pf-border)] bg-white/5 text-[var(--pf-text-primary)] transition-colors hover:border-[var(--pf-border-strong)] lg:hidden"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          </button>

          <Link href="/" className="flex shrink-0 items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--pf-border)] bg-[var(--pf-card-alt)] text-[var(--pf-accent-secondary)]">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
              </svg>
            </div>
            <div>
              <span className="text-[1.15rem] font-semibold tracking-[-0.03em] text-white">
                PCForge
              </span>
              <p className="hidden text-xs text-[var(--pf-text-tertiary)] sm:block">
                Calm marketplace for PC builders in India
              </p>
            </div>
          </Link>

          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSubmit={handleSearch}
            placeholder="Search GPUs, CPUs, RAM, motherboards..."
            className="hidden max-w-2xl flex-1 md:block"
          />

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  router.asPath.startsWith(item.href)
                    ? 'bg-white/6 text-white'
                    : 'text-[var(--pf-text-secondary)] hover:bg-white/5 hover:text-white',
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <ProfileMenu />
        </div>

        <div className="hidden border-t border-[var(--pf-border)] bg-[rgba(255,255,255,0.02)] lg:block">
          <div className="pf-main-container flex min-h-[52px] items-center gap-3 overflow-x-auto py-2">
            <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--pf-text-tertiary)]">
              Categories
            </span>
            {quickCategories.map((item) => (
              <Link
                key={item.slug}
                href={buildMarketplaceCategoryHref(item.slug)}
                className="shrink-0 rounded-full border border-[var(--pf-border)] bg-white/[0.03] px-3 py-1.5 text-sm text-[var(--pf-text-secondary)] transition-colors hover:border-[var(--pf-border-strong)] hover:text-white"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden" aria-modal="true" role="dialog">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          <aside
            id="mobile-navigation-sidebar"
            className="absolute left-0 top-0 flex h-full w-[min(24rem,calc(100vw-1.5rem))] flex-col overflow-y-auto border-r border-[var(--pf-border)] bg-[var(--pf-background-elevated)] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--pf-accent-secondary)]">
                  Navigation
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Browse PCForge</h2>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--pf-border)] text-[var(--pf-text-secondary)] transition-colors hover:text-white"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSubmit={handleSearch}
              placeholder="Search components"
              className="mt-5"
            />

            <nav className="mt-6 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-2xl border border-[var(--pf-border)] bg-white/5 px-4 py-3 text-sm font-medium text-white transition-colors hover:border-[var(--pf-border-strong)]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-8">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--pf-text-tertiary)]">
                Categories
              </p>
              <div className="mt-3 grid gap-2">
                {quickCategories.map((item) => (
                  <Link
                    key={item.slug}
                    href={buildMarketplaceCategoryHref(item.slug)}
                    className="rounded-2xl border border-[var(--pf-border)] bg-white/5 px-4 py-3 text-sm text-[var(--pf-text-primary)] transition-colors hover:border-[var(--pf-border-strong)]"
                  >
                    <span className="block font-medium">{item.name}</span>
                    <span className="mt-1 block text-xs text-[var(--pf-text-secondary)]">
                      {item.description}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
