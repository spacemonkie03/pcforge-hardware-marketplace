import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        graphite: '#121212',
        neonBlue: '#32e5ff',
        accentRgb: '#ff00ff'
      },
      boxShadow: {
        glow: '0 0 20px rgba(50, 229, 255, 0.7)'
      }
    }
  },
  plugins: []
};

export default config;

