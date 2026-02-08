import React from 'react';
import { Text } from '../Text';

export interface SectionTitleProps {
  children: React.ReactNode;
  as?: 'h2' | 'h3';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Section heading for listing detail sections (e.g. "Where you'll sleep", "What this place offers").
 * Uses h2 typography (22px, semibold) and consistent margin-bottom per design rules.
 */
export function SectionTitle({
  children,
  as = 'h2',
  className,
  style,
}: SectionTitleProps) {
  const combinedStyle: React.CSSProperties = {
    marginBottom: 'var(--ds-content-gap-md)',
    ...style,
  };
  return (
    <Text as={as} variant="h2" color="primary" className={className} style={combinedStyle}>
      {children}
    </Text>
  );
}
