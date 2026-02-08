import React from 'react';

export type TextVariant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'body'
  | 'bodySmall'
  | 'caption'
  | 'label';

export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';

const variantStyles: Record<
  TextVariant,
  { fontSize: string; lineHeight: string; fontWeight: string }
> = {
  display: {
    fontSize: 'var(--ds-text-32)',
    lineHeight: 'var(--ds-leading-32)',
    fontWeight: 'var(--ds-font-bold)',
  },
  h1: {
    fontSize: 'var(--ds-text-26)',
    lineHeight: 'var(--ds-leading-28)',
    fontWeight: 'var(--ds-font-bold)',
  },
  h2: {
    fontSize: 'var(--ds-text-22)',
    lineHeight: 'var(--ds-leading-24)',
    fontWeight: 'var(--ds-font-semibold)',
  },
  h3: {
    fontSize: 'var(--ds-text-18)',
    lineHeight: 'var(--ds-leading-20)',
    fontWeight: 'var(--ds-font-semibold)',
  },
  h4: {
    fontSize: 'var(--ds-text-16)',
    lineHeight: 'var(--ds-leading-18)',
    fontWeight: 'var(--ds-font-medium)',
  },
  body: {
    fontSize: 'var(--ds-text-14)',
    lineHeight: 'var(--ds-leading-18)',
    fontWeight: 'var(--ds-font-regular)',
  },
  bodySmall: {
    fontSize: 'var(--ds-text-12)',
    lineHeight: 'var(--ds-leading-16)',
    fontWeight: 'var(--ds-font-regular)',
  },
  caption: {
    fontSize: 'var(--ds-text-11)',
    lineHeight: 'var(--ds-leading-10)',
    fontWeight: 'var(--ds-font-medium)',
  },
  label: {
    fontSize: 'var(--ds-text-12)',
    lineHeight: 'var(--ds-leading-14)',
    fontWeight: 'var(--ds-font-medium)',
  },
};

export interface TextProps {
  variant?: TextVariant;
  weight?: TextWeight;
  color?: 'primary' | 'secondary' | 'muted';
  as?: 'span' | 'div' | 'p' | 'h1' | 'h2' | 'h3';
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const colorMap = {
  primary: 'var(--ds-text-primary)',
  secondary: 'var(--ds-text-secondary)',
  muted: 'var(--ds-text-muted)',
} as const;

const weightMap = {
  regular: 'var(--ds-font-regular)',
  medium: 'var(--ds-font-medium)',
  semibold: 'var(--ds-font-semibold)',
  bold: 'var(--ds-font-bold)',
} as const;

export function Text({
  variant = 'body',
  weight,
  color = 'primary',
  as: Component = 'span',
  className,
  style,
  children,
}: TextProps) {
  const variantStyle = variantStyles[variant];
  const resolvedWeight = weight != null ? weightMap[weight] : variantStyle.fontWeight;
  const combinedStyle: React.CSSProperties = {
    fontFamily: 'var(--ds-font-family)',
    letterSpacing: 'var(--ds-letter-spacing)',
    color: colorMap[color],
    ...variantStyle,
    fontWeight: resolvedWeight,
    ...style,
  };
  return (
    <Component className={className} style={combinedStyle}>
      {children}
    </Component>
  );
}
