import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-black/60 backdrop-blur-lg mt-12">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
          <div>
            <h3 className="font-semibold text-neonBlue mb-2">PCForge</h3>
            <p className="text-gray-400 text-xs">
              Your ultimate PC hardware marketplace with intelligent PC building tools.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Products</h4>
            <ul className="space-y-1 text-gray-400">
              <li><a href="#" className="hover:text-neonBlue transition-colors">CPUs</a></li>
              <li><a href="#" className="hover:text-neonBlue transition-colors">GPUs</a></li>
              <li><a href="#" className="hover:text-neonBlue transition-colors">Motherboards</a></li>
              <li><a href="#" className="hover:text-neonBlue transition-colors">RAM</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Tools</h4>
            <ul className="space-y-1 text-gray-400">
              <li><a href="/pc-builder" className="hover:text-neonBlue transition-colors">PC Builder</a></li>
              <li><a href="#" className="hover:text-neonBlue transition-colors">Compatibility Check</a></li>
              <li><a href="#" className="hover:text-neonBlue transition-colors">Price Tracker</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Support</h4>
            <ul className="space-y-1 text-gray-400">
              <li><a href="#" className="hover:text-neonBlue transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-neonBlue transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-neonBlue transition-colors">Seller Portal</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-6 pt-4 text-center text-xs text-gray-500">
          <p>&copy; 2024 PCForge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};