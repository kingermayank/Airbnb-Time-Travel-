import React from 'react';
import { Text } from '../../foundations/Text';

export interface ListingMetaProps {
  propertyType: string;
  guestCapacity: number;
  bedrooms: number;
  beds: number;
  baths: number;
  overallRating?: number;
  totalReviews?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Property type line + guests/bedrooms/beds/baths + optional star rating and reviews count.
 */
export function ListingMeta({
  propertyType,
  guestCapacity,
  bedrooms,
  beds,
  baths,
  overallRating,
  totalReviews,
  className,
  style,
}: ListingMetaProps) {
  const statsLine = [
    `${guestCapacity} guest${guestCapacity !== 1 ? 's' : ''}`,
    `${bedrooms} bedroom${bedrooms !== 1 ? 's' : ''}`,
    `${beds} bed${beds !== 1 ? 's' : ''}`,
    `${baths} bath${baths !== 1 ? 's' : ''}`,
  ].join(' · ');
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--ds-spacing-8)',
        ...style,
      }}
    >
      <Text variant="h2" color="primary" as="div">
        {propertyType}
      </Text>
      <Text variant="body" color="primary" as="div">
        {statsLine}
      </Text>
      {(overallRating != null || (totalReviews != null && totalReviews > 0)) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-spacing-8)' }}>
          {overallRating != null && (
            <Text variant="body" weight="semibold" color="primary" as="span">
              ★ {overallRating.toFixed(1)}
            </Text>
          )}
          {totalReviews != null && totalReviews > 0 && (
            <Text variant="body" color="primary" as="span" style={{ textDecoration: 'underline' }}>
              {totalReviews} reviews
            </Text>
          )}
        </div>
      )}
    </div>
  );
}
