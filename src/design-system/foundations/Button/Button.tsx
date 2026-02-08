import React from 'react';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: React.ReactNode;
  className?: string;
}

const variantStyles: Record<
  ButtonVariant,
  { background: string; color: string; border: string }
> = {
  primary: {
    background: 'var(--ds-primary)',
    color: 'var(--ds-primary-foreground)',
    border: 'none',
  },
  secondary: {
    background: 'var(--ds-secondary)',
    color: 'var(--ds-text-primary)',
    border: '1px solid var(--ds-border-light)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--ds-text-primary)',
    border: 'none',
  },
};

const sizeStyles: Record<
  ButtonSize,
  { padding: string; fontSize: string; minHeight: string }
> = {
  sm: {
    padding: 'var(--ds-spacing-6) var(--ds-spacing-12)',
    fontSize: 'var(--ds-text-12)',
    minHeight: '32px',
  },
  md: {
    padding: 'var(--ds-spacing-10) var(--ds-spacing-20)',
    fontSize: 'var(--ds-text-14)',
    minHeight: '40px',
  },
  lg: {
    padding: 'var(--ds-spacing-12) var(--ds-spacing-24)',
    fontSize: 'var(--ds-text-16)',
    minHeight: '48px',
  },
};

export function Button({
  variant = 'primary',
  size = 'md',
  disabled,
  className,
  style,
  children,
  ...rest
}: ButtonProps) {
  const v = variantStyles[variant];
  const s = sizeStyles[size];
  const baseRadius = variant === 'ghost' ? '20px' : 'var(--ds-radius-md)';
  const combinedStyle: React.CSSProperties = {
    fontFamily: 'var(--ds-font-family)',
    fontWeight: 'var(--ds-font-medium)',
    letterSpacing: 'var(--ds-letter-spacing)',
    borderRadius: baseRadius,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: 'background-color 0.2s ease, transform 0.1s ease',
    ...v,
    ...s,
    ...style,
  };
  const buttonClassName = [
    'ds-button',
    `ds-button--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={buttonClassName}
      style={combinedStyle}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
