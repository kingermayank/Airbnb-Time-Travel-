import React from 'react';

export type AvatarSize = 'sm' | 'md' | 'lg';

const sizeMap: Record<AvatarSize, number> = {
  sm: 24,
  md: 40,
  lg: 56,
};

export interface AvatarProps {
  src: string | null;
  alt: string;
  size?: AvatarSize;
  className?: string;
  style?: React.CSSProperties;
}

export function Avatar({
  src,
  alt,
  size = 'md',
  className,
  style,
}: AvatarProps) {
  const px = sizeMap[size];
  const combinedStyle: React.CSSProperties = {
    width: px,
    height: px,
    borderRadius: 'var(--ds-radius-full)',
    objectFit: 'cover',
    backgroundColor: 'var(--ds-border-light)',
    ...style,
  };
  if (!src) {
    return (
      <div
        className={className}
        style={{
          ...combinedStyle,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: `calc(${px}px * 0.4)`,
          color: 'var(--ds-text-muted)',
          fontWeight: 'var(--ds-font-medium)',
        }}
        aria-label={alt}
      >
        {alt.charAt(0).toUpperCase()}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={combinedStyle}
    />
  );
}
