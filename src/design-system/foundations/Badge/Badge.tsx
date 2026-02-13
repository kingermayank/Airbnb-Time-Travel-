import React from 'react';
import { Text } from '../Text';

export interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Badge({ children, className, style }: BadgeProps) {
  const combinedStyle: React.CSSProperties = {
    display: 'inline-flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 'var(--ds-badge-padding-top) var(--ds-spacing-12) var(--ds-badge-padding-bottom) var(--ds-spacing-12)',
    gap: 'var(--ds-spacing-10)',
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // 95% opacity white background
    boxShadow: 'var(--ds-shadow-badge)',
    borderRadius: 'var(--ds-radius-full)',
    ...style,
  };
  return (
    <span className={className} style={combinedStyle}>
      <Text variant="caption" color="primary">
        {children}
      </Text>
    </span>
  );
}
