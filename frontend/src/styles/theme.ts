export const theme = {
  colors: {
    background: '#0F1115',
    backgroundElevated: '#151922',
    card: '#171A21',
    cardAlt: '#1D2330',
    accentPrimary: '#2563EB',
    accentSecondary: '#60A5FA',
    success: '#15803D',
    warning: '#B45309',
    danger: '#B91C1C',
    textPrimary: '#E7EAF0',
    textSecondary: '#A8B0BF',
    textTertiary: '#7B8496',
    border: 'rgba(231, 234, 240, 0.10)',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    base: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
    sectionSpacing: '64px',
    cardPadding: '24px',
    gridGap: '24px',
  },
  radius: {
    cardRadius: '12px',
    controlRadius: '10px',
  },
  shadows: {
    card: '0 12px 36px rgba(6, 10, 18, 0.22)',
    hover: '0 16px 42px rgba(6, 10, 18, 0.28)',
  },
  typography: {
    headingWeight: 650,
    subheadingWeight: 600,
    bodyWeight: 400,
    priceWeight: 700,
  },
  layout: {
    contentWidth: '1280px',
  },
} as const;

export type Theme = typeof theme;
