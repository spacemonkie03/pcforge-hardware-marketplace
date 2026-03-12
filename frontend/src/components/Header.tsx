import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useUserStore } from '../store/useUserStore';

export const Header = () => {
  const user = useUserStore((s) => s.user);
  const logout = useUserStore((s) => s.logout);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="border-b border-white/10 bg-black/80 backdrop-blur-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25" />
          <span className="text-lg font-semibold tracking-wide">
            PC<span className="text-blue-400">Forge</span>
          </span>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-2 pl-10 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/25 transition-all"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </form>

        <nav className="flex items-center gap-4 text-sm">
          <Link href="/pc-builder" className="hover:text-blue-400 transition-colors">
            PC Builder
          </Link>
          {user?.role === 'SELLER' && (
            <Link href="/dashboard/seller" className="hover:text-blue-400 transition-colors">
              Seller Dashboard
            </Link>
          )}
          {user?.role === 'ADMIN' && (
            <Link href="/dashboard/admin" className="hover:text-blue-400 transition-colors">
              Admin Panel
            </Link>
          )}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">Hi, {user.name}</span>
              <button
                onClick={logout}
                className="px-3 py-1.5 rounded-lg border border-white/20 hover:border-red-400 hover:text-red-400 text-xs transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="hover:text-blue-400 transition-colors">
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors"
              >
                Sign up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

