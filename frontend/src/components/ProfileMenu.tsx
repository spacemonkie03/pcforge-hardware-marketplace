import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useUserStore } from '../store/useUserStore';
import { ButtonPrimary } from './ui/ButtonPrimary';
import { ButtonSecondary } from './ui/ButtonSecondary';

export const ProfileMenu = () => {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const logout = useUserStore((s) => s.logout);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    setOpen(false);
    logout();
    router.replace('/');
  };

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <ButtonSecondary href="/login" className="min-h-[40px] px-4 text-sm">Login</ButtonSecondary>
        <ButtonPrimary href="/register" className="min-h-[40px] px-4 text-sm">Sign up</ButtonPrimary>
      </div>
    );
  }

  const initial = user.name?.slice(0, 1).toUpperCase() || 'U';

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-3 rounded-full border border-[var(--pf-border)] bg-white/5 px-2 py-1.5 transition-colors hover:border-[var(--pf-border-strong)]"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--pf-border)] bg-[var(--pf-card-alt)] text-sm font-semibold text-white">
          {initial}
        </div>
        <div className="hidden text-left sm:block">
          <p className="text-xs text-white">{user.name}</p>
          <p className="text-[11px] text-gray-400">{user.role}</p>
        </div>
      </button>

      {open && (
        <div className="pf-card absolute right-0 top-14 z-50 w-64 p-3">
          <div className="border-b border-[var(--pf-border)] px-3 pb-3">
            <p className="text-sm font-semibold text-white">{user.name}</p>
            <p className="mt-1 text-xs text-[var(--pf-text-secondary)]">{user.email}</p>
          </div>
          <div className="mt-3 flex flex-col gap-1 text-sm">
            <Link href="/profile" className="rounded-lg px-3 py-2 text-gray-200 transition-colors hover:bg-white/5 hover:text-white">
              Profile
            </Link>
            <Link href="/cart" className="rounded-lg px-3 py-2 text-gray-200 transition-colors hover:bg-white/5 hover:text-white">
              Cart
            </Link>
            <Link href="/orders" className="rounded-lg px-3 py-2 text-gray-200 transition-colors hover:bg-white/5 hover:text-white">
              Orders
            </Link>
            <Link href="/wishlist" className="rounded-lg px-3 py-2 text-gray-200 transition-colors hover:bg-white/5 hover:text-white">
              Wishlist
            </Link>
            <Link href="/addresses" className="rounded-lg px-3 py-2 text-gray-200 transition-colors hover:bg-white/5 hover:text-white">
              Addresses
            </Link>
            <Link href="/payment-methods" className="rounded-lg px-3 py-2 text-gray-200 transition-colors hover:bg-white/5 hover:text-white">
              Payment Methods
            </Link>
            {(user.role === 'SELLER' || user.role === 'ADMIN') && (
              <Link href="/dashboard/seller" className="rounded-lg px-3 py-2 text-gray-200 transition-colors hover:bg-white/5 hover:text-white">
                Seller Dashboard
              </Link>
            )}
            {user.role === 'ADMIN' && (
              <Link href="/dashboard/admin" className="rounded-lg px-3 py-2 text-gray-200 transition-colors hover:bg-white/5 hover:text-white">
                Admin Panel
              </Link>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="mt-2 rounded-lg px-3 py-2 text-left text-red-300 transition-colors hover:bg-red-500/10"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
