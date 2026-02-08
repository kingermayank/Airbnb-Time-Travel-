import React from 'react';
import { Text } from '../../foundations/Text';

export interface ReviewScoreCategory {
  name: string;
  score: number;
}

export interface ReviewScoreBarsProps {
  ratingCategories: ReviewScoreCategory[];
  maxScore?: number;
  className?: string;
  style?: React.CSSProperties;
}

const defaultMaxScore = 5;

/**
 * Horizontal bars for rating categories (e.g. Stability 5.0, Communication 5.0).
 */
export function ReviewScoreBars({
  ratingCategories,
  maxScore = defaultMaxScore,
  className,
  style,
}: ReviewScoreBarsProps) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--ds-content-gap-sm)',
        ...style,
      }}
    >
      {ratingCategories.map((cat) => (
        <div
          key={cat.name}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--ds-spacing-12)',
          }}
        >
          <Text variant="body" color="primary" as="span" style={{ minWidth: 100 }}>
            {cat.name}
          </Text>
          <div
            style={{
              flex: 1,
              height: 8,
              backgroundColor: 'var(--ds-border-light)',
              borderRadius: 'var(--ds-radius-full)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${(cat.score / maxScore) * 100}%`,
                height: '100%',
                backgroundColor: 'var(--ds-primary)',
                borderRadius: 'var(--ds-radius-full)',
              }}
            />
          </div>
          <Text variant="body" color="primary" as="span">
            {cat.score.toFixed(1)}
          </Text>
        </div>
      ))}
    </div>
  );
}
