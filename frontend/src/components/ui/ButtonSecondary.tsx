import Link from 'next/link';
import { ReactNode } from 'react';

interface ButtonSecondaryProps {
  children: ReactNode;
  href?: string;
  type?: 'button' | 'submit';
  onClick?: () => void | Promise<void>;
  disabled?: boolean;
  className?: string;
}

export const ButtonSecondary = ({
  children,
  href,
  type = 'button',
  onClick,
  disabled,
  className = '',
}: ButtonSecondaryProps) => {
  const classes = `pf-button-secondary ${className}`.trim();

  if (href) {
    return <Link href={href} className={classes}>{children}</Link>;
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
};
