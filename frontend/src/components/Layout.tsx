import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-gray-100 flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full">{children}</main>
      <Footer />
    </div>
  );
};

