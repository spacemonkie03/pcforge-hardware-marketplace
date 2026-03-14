import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { buildMarketplaceCategoryHref, categoryGroups } from '../../config/categories.config';
import { CategoryIcon } from './CategoryIcon';

const CLOSE_DELAY_MS = 350;

export const BrowseCategoriesMenu = () => {
  const router = useRouter();
  const [desktopOpen, setDesktopOpen] = useState(false);
  const [lockedOpen, setLockedOpen] = useState(false);
  const desktopRef = useRef<HTMLDivElement | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const featuredCategories = useMemo(
    () => categoryGroups.flatMap((group) => group.items).slice(0, 4),
    []
  );

  useEffect(() => {
    setDesktopOpen(false);
    setLockedOpen(false);
  }, [router.asPath]);

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (!desktopRef.current?.contains(event.target as Node)) {
        setDesktopOpen(false);
        setLockedOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDesktopOpen(false);
        setLockedOpen(false);
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const openMenu = () => {
    clearCloseTimer();
    setDesktopOpen(true);
  };

  const scheduleClose = () => {
    clearCloseTimer();
    if (lockedOpen) {
      return;
    }
    closeTimerRef.current = setTimeout(() => {
      setDesktopOpen(false);
    }, CLOSE_DELAY_MS);
  };

  const handleButtonClick = () => {
    clearCloseTimer();
    if (desktopOpen && lockedOpen) {
      setDesktopOpen(false);
      setLockedOpen(false);
      return;
    }

    setDesktopOpen(true);
    setLockedOpen(true);
  };

  return (
    <div
      ref={desktopRef}
      className="relative hidden lg:block"
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        aria-expanded={desktopOpen}
        aria-controls="desktop-browse-categories"
        onClick={handleButtonClick}
        className={clsx(
          'inline-flex items-center gap-3 rounded-full border px-4 py-2 text-sm font-semibold transition-all',
          desktopOpen
            ? 'border-[var(--pf-accent-primary)]/50 bg-[linear-gradient(135deg,rgba(99,102,241,0.24),rgba(34,211,238,0.18))] text-white shadow-[0_12px_30px_rgba(79,70,229,0.2)]'
            : 'border-[var(--pf-accent-primary)]/25 bg-[linear-gradient(135deg,rgba(99,102,241,0.16),rgba(34,211,238,0.08))] text-white hover:border-[var(--pf-accent-primary)]/45 hover:bg-[linear-gradient(135deg,rgba(99,102,241,0.24),rgba(34,211,238,0.14))]'
        )}
      >
        <span className="text-base leading-none text-[var(--pf-accent-primary)]" aria-hidden="true">
          ☰
        </span>
        <span>Browse Categories</span>
        <svg
          className={clsx('h-4 w-4 transition-transform', desktopOpen && 'rotate-180')}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {desktopOpen && (
        <div
          id="desktop-browse-categories"
          className="absolute left-0 top-[calc(100%+12px)] z-50 w-[min(1080px,calc(100vw-8rem))] overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,17,31,0.98),rgba(8,11,22,0.98))] shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
          onMouseEnter={openMenu}
          onMouseLeave={scheduleClose}
        >
          <div className="grid gap-0 xl:grid-cols-[minmax(0,1fr)_280px]">
            <div className="grid gap-6 p-6 xl:grid-cols-2">
              {categoryGroups.map((group) => (
                <section key={group.group} aria-label={group.group} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--pf-accent-primary)]">
                    {group.group}
                  </p>
                  <div className="mt-4 grid gap-2">
                    {group.items.map((item) => (
                      <Link
                        key={item.slug}
                        href={buildMarketplaceCategoryHref(item.slug)}
                        className="group flex items-start gap-3 rounded-2xl border border-transparent px-3 py-3 transition-all hover:border-white/10 hover:bg-white/5 focus-visible:border-[var(--pf-accent-primary)]/40 focus-visible:bg-white/5 focus-visible:outline-none"
                      >
                        <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[rgba(99,102,241,0.12)] text-[var(--pf-accent-primary)] transition-colors group-hover:bg-[rgba(99,102,241,0.2)]">
                          <CategoryIcon icon={item.icon} />
                        </span>
                        <span>
                          <span className="block text-sm font-semibold text-white">{item.name}</span>
                          <span className="mt-1 block text-xs leading-5 text-[var(--pf-text-secondary)]">
                            {item.description}
                          </span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <aside className="border-l border-white/10 bg-[rgba(255,255,255,0.03)] p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--pf-accent-primary)]">
                Quick picks
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-white">
                Start with the parts builders compare most
              </h3>
              <p className="mt-3 text-sm leading-6 text-[var(--pf-text-secondary)]">
                Jump straight into the highest-traffic categories and land on filtered marketplace
                routes instead of digging through the full catalog first.
              </p>
              <div className="mt-6 grid gap-3">
                {featuredCategories.map((item) => (
                  <Link
                    key={item.slug}
                    href={buildMarketplaceCategoryHref(item.slug)}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition-colors hover:border-[var(--pf-accent-primary)]/40 hover:bg-white/10"
                  >
                    <span className="flex items-center gap-3">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[rgba(34,211,238,0.12)] text-cyan-300">
                        <CategoryIcon icon={item.icon} className="h-4 w-4" />
                      </span>
                      {item.name}
                    </span>
                    <svg
                      className="h-4 w-4 text-gray-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                ))}
              </div>
            </aside>
          </div>
        </div>
      )}
    </div>
  );
};
