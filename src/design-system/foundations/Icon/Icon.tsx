import React from 'react';

export type IconSize = 'sm' | 'md' | 'lg';

const sizeMap: Record<IconSize, number> = {
  sm: 16,
  md: 24,
  lg: 32,
};

export interface IconProps {
  size?: IconSize;
  color?: 'primary' | 'muted' | 'accent' | 'white';
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  'aria-hidden'?: boolean;
}

const colorMap = {
  primary: 'var(--ds-text-primary)',
  muted: 'var(--ds-text-muted)',
  accent: 'var(--ds-accent)',
  white: 'var(--ds-icon-white)',
} as const;

export function Icon({
  size = 'md',
  color = 'muted',
  className,
  style,
  children,
  'aria-hidden': ariaHidden = true,
}: IconProps) {
  const px = sizeMap[size];
  const combinedStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: px,
    height: px,
    color: colorMap[color],
    flexShrink: 0,
    ...style,
  };
  return (
    <span
      className={className}
      style={combinedStyle}
      aria-hidden={ariaHidden}
    >
      {children}
    </span>
  );
}
