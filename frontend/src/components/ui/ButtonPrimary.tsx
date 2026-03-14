import Link from 'next/link';
import { ReactNode } from 'react';

interface ButtonPrimaryProps {
  children: ReactNode;
  href?: string;
  type?: 'button' | 'submit';
  onClick?: () => void | Promise<void>;
  disabled?: boolean;
  className?: string;
}

export const ButtonPrimary = ({
  children,
  href,
  type = 'button',
  onClick,
  disabled,
  className = '',
}: ButtonPrimaryProps) => {
  const classes = `pf-button-primary ${className}`.trim();

  if (href) {
    return <Link href={href} className={classes}>{children}</Link>;
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
};
