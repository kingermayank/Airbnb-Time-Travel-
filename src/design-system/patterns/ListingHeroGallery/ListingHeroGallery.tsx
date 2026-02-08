import React from 'react';
import { Text } from '../../foundations/Text';

export interface ListingHeroGalleryImage {
  url: string;
  alt?: string;
}

export interface ListingHeroGalleryProps {
  title: string;
  mainImageUrl: string;
  mainImageAlt?: string;
  otherImages: ListingHeroGalleryImage[];
  onImageClick?: (index: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Listing hero: page title + 5-image grid (1 large left, 4 right).
 */
export function ListingHeroGallery({
  title,
  mainImageUrl,
  mainImageAlt,
  otherImages,
  onImageClick,
  className,
  style,
}: ListingHeroGalleryProps) {
  const handleClick = (index: number) => () => onImageClick?.(index);
  return (
    <div
      className={className}
      style={{
        marginBottom: 'var(--ds-content-gap-md)',
        ...style,
      }}
    >
      <Text variant="h1" color="primary" as="h1" style={{ marginBottom: 'var(--ds-content-gap-md)' }}>
        {title}
      </Text>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: 'var(--ds-spacing-8)',
          height: 400,
          borderRadius: 'var(--ds-radius-lg)',
          overflow: 'hidden',
        }}
      >
        <div
          role={onImageClick ? 'button' : undefined}
          onClick={onImageClick ? handleClick(0) : undefined}
          style={{
            gridRow: 'span 2',
            cursor: onImageClick ? 'pointer' : undefined,
            overflow: 'hidden',
          }}
        >
          <img
            src={mainImageUrl}
            alt={mainImageAlt ?? title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        {otherImages.slice(0, 4).map((img, i) => (
          <div
            key={i}
            role={onImageClick ? 'button' : undefined}
            onClick={onImageClick ? handleClick(i + 1) : undefined}
            style={{
              cursor: onImageClick ? 'pointer' : undefined,
              overflow: 'hidden',
            }}
          >
            <img
              src={img.url}
              alt={img.alt ?? `Image ${i + 2}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
