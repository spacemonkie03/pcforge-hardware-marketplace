import Link from 'next/link';
import { useUserStore } from '../store/useUserStore';

export const Header = () => {
  const user = useUserStore((s) => s.user);
  const logout = useUserStore((s) => s.logout);

  return (
    <header className="border-b border-white/10 bg-black/60 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-neonBlue to-accentRgb shadow-glow" />
          <span className="text-lg font-semibold tracking-wide">
            PC<span className="text-neonBlue">Forge</span>
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/pc-builder" className="hover:text-neonBlue">
            PC Builder
          </Link>
          {user?.role === 'SELLER' && (
            <Link href="/dashboard/seller" className="hover:text-neonBlue">
              Seller Dashboard
            </Link>
          )}
          {user?.role === 'ADMIN' && (
            <Link href="/dashboard/admin" className="hover:text-neonBlue">
              Admin Panel
            </Link>
          )}
          {user ? (
            <>
              <span className="text-xs text-gray-400">Hi, {user.name}</span>
              <button
                onClick={logout}
                className="px-3 py-1 rounded-full border border-white/20 hover:border-neonBlue text-xs"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-neonBlue">
                Login
              </Link>
              <Link
                href="/register"
                className="px-3 py-1 rounded-full bg-neonBlue/20 border border-neonBlue text-xs hover:bg-neonBlue/30"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

