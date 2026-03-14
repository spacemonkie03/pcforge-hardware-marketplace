import { theme } from '../../styles/theme';

export const BackgroundGrid = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden"
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: theme.colors.background,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          opacity: 0.35,
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.08),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(37,99,235,0.08),_transparent_28%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,17,21,0.2),rgba(15,17,21,0.84))]" />
    </div>
  );
};
