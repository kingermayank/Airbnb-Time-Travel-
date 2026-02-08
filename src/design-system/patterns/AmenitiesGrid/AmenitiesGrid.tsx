import React from 'react';
import { Text } from '../../foundations/Text';
import { Button } from '../../foundations/Button';
import { SectionTitle } from '../../foundations/SectionTitle';

export interface AmenitiesGridItem {
  icon: React.ReactNode;
  label: string;
}

export interface AmenitiesGridProps {
  items: AmenitiesGridItem[];
  initialVisibleCount?: number;
  totalCount?: number;
  showAllLabel?: string;
  onShowAll?: () => void;
  showSectionTitle?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Grid of icon + label; optional "Show all N amenities" using Button variant="secondary".
 */
export function AmenitiesGrid({
  items,
  initialVisibleCount = 10,
  totalCount,
  showAllLabel,
  onShowAll,
  showSectionTitle = true,
  className,
  style,
}: AmenitiesGridProps) {
  const [showAll, setShowAll] = React.useState(false);
  const visibleItems = showAll ? items : items.slice(0, initialVisibleCount);
  const hasMore = !showAll && items.length > initialVisibleCount;
  const count = totalCount ?? items.length;
  const label = showAllLabel ?? `Show all ${count} amenities`;

  const handleShowAll = () => {
    setShowAll(true);
    onShowAll?.();
  };

  return (
    <div
      className={className}
      style={{
        paddingBottom: 'var(--ds-section-padding-y)',
        borderBottom: 'var(--ds-section-divider)',
        marginBottom: 'var(--ds-section-padding-y)',
        ...style,
      }}
    >
      {showSectionTitle && <SectionTitle>What this place offers</SectionTitle>}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--ds-content-gap-sm)',
          marginBottom: hasMore ? 'var(--ds-content-gap-md)' : 0,
        }}
      >
        {visibleItems.map((item, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--ds-content-gap-sm)',
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {item.icon}
            </div>
            <Text variant="body" color="primary" as="span">
              {item.label}
            </Text>
          </div>
        ))}
      </div>
      {hasMore && (
        <Button variant="secondary" size="lg" onClick={handleShowAll}>
          {label}
        </Button>
      )}
    </div>
  );
}
