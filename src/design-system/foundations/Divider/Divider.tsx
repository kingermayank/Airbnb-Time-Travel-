import React from 'react';

export type DividerOrientation = 'vertical' | 'horizontal';

export interface DividerProps {
  orientation?: DividerOrientation;
  className?: string;
  style?: React.CSSProperties;
}

const baseStyle: React.CSSProperties = {
  backgroundColor: 'var(--ds-divider)',
  flexShrink: 0,
};

export function Divider({
  orientation = 'vertical',
  className,
  style,
}: DividerProps) {
  const combinedStyle: React.CSSProperties =
    orientation === 'vertical'
      ? {
          ...baseStyle,
          width: '1px',
          height: 'var(--ds-spacing-32)',
          alignSelf: 'center',
        }
      : {
          ...baseStyle,
          height: '1px',
          width: '100%',
        };
  return <div role="separator" className={className} style={{ ...combinedStyle, ...style }} />;
}
