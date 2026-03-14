import { CategoryIcon as CategoryIconName } from '../../config/categories.config';

interface CategoryIconProps {
  icon: CategoryIconName;
  className?: string;
}

export const CategoryIcon = ({ icon, className = 'h-5 w-5' }: CategoryIconProps) => {
  const common = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (icon) {
    case 'gpu':
      return (
        <svg {...common}>
          <rect x="3" y="7" width="18" height="10" rx="2" />
          <path d="M7 17v2M11 17v2M15 17v2M8 12h3M16 10v4" />
          <circle cx="16" cy="12" r="2.5" />
        </svg>
      );
    case 'cpu':
      return (
        <svg {...common}>
          <rect x="7" y="7" width="10" height="10" rx="2" />
          <path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" />
          <rect x="10" y="10" width="4" height="4" rx="1" />
        </svg>
      );
    case 'motherboard':
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M8 8h5v5H8zM15 8h1M15 12h1M8 15h8M8 18h4" />
        </svg>
      );
    case 'ram':
      return (
        <svg {...common}>
          <path d="M4 9h16v6H4z" />
          <path d="M7 9V7M10 9V7M13 9V7M16 9V7M7 15v2M10 15v2M13 15v2M16 15v2" />
        </svg>
      );
    case 'storage':
      return (
        <svg {...common}>
          <rect x="4" y="7" width="16" height="10" rx="2" />
          <path d="M8 12h8M8 15h3" />
        </svg>
      );
    case 'power':
      return (
        <svg {...common}>
          <rect x="4" y="6" width="16" height="12" rx="2" />
          <path d="M8 10h3v4H8zM15 10l-2 2 2 2" />
        </svg>
      );
    case 'cooler':
      return (
        <svg {...common}>
          <rect x="5" y="5" width="14" height="14" rx="2" />
          <circle cx="12" cy="12" r="3" />
          <path d="M12 5c1 2 1 4 0 6M19 12c-2 1-4 1-6 0M12 19c-1-2-1-4 0-6M5 12c2-1 4-1 6 0" />
        </svg>
      );
    case 'fan':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="2.5" />
          <path d="M12 4c2.5 0 4.5 2 4.5 4.5-2 0-4-1.2-4.5-3.2M20 12c0 2.5-2 4.5-4.5 4.5 0-2 1.2-4 3.2-4.5M12 20c-2.5 0-4.5-2-4.5-4.5 2 0 4 1.2 4.5 3.2M4 12c0-2.5 2-4.5 4.5-4.5 0 2-1.2 4-3.2 4.5" />
        </svg>
      );
    case 'liquid':
      return (
        <svg {...common}>
          <circle cx="8" cy="10" r="3" />
          <path d="M11 10h5a3 3 0 013 3v3M8 14v6M5 20h6" />
        </svg>
      );
    case 'case':
      return (
        <svg {...common}>
          <rect x="7" y="3" width="10" height="18" rx="2" />
          <path d="M9 7h6M9 11h6M10 16h.01" />
        </svg>
      );
    case 'monitor':
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="12" rx="2" />
          <path d="M12 17v3M8 20h8" />
        </svg>
      );
    case 'keyboard':
      return (
        <svg {...common}>
          <rect x="3" y="7" width="18" height="10" rx="2" />
          <path d="M6 10h1M9 10h1M12 10h1M15 10h1M18 10h1M6 13h8M16 13h3" />
        </svg>
      );
    case 'mouse':
      return (
        <svg {...common}>
          <rect x="8" y="3" width="8" height="18" rx="4" />
          <path d="M12 7V3" />
        </svg>
      );
    case 'headset':
      return (
        <svg {...common}>
          <path d="M6 12a6 6 0 1112 0v4" />
          <rect x="4" y="12" width="3" height="6" rx="1.5" />
          <rect x="17" y="12" width="3" height="6" rx="1.5" />
        </svg>
      );
    case 'microphone':
      return (
        <svg {...common}>
          <rect x="9" y="3" width="6" height="11" rx="3" />
          <path d="M6 10a6 6 0 0012 0M12 16v5M9 21h6" />
        </svg>
      );
    default:
      return null;
  }
};
