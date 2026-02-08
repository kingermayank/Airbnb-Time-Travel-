import React from 'react';
import { SectionTitle } from '../../foundations/SectionTitle';
import { Text } from '../../foundations/Text';
import { Button } from '../../foundations/Button';
import { ReviewScoreBars } from '../ReviewScoreBars';
import { ReviewCard } from '../ReviewCard';
import type { ReviewScoreCategory } from '../ReviewScoreBars';

export interface ReviewsSectionProps {
  overallRating: number;
  totalReviews: number;
  ratingCategories: ReviewScoreCategory[];
  reviews: Array<{
    reviewerName: string;
    reviewerAvatarUrl?: string | null;
    bookingContext: string;
    snippet: string;
  }>;
  initialReviewsCount?: number;
  onShowAllReviews?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Reviews section: title (★ rating • N reviews), score bars, review cards grid, "Show all N reviews" (Button secondary).
 */
export function ReviewsSection({
  overallRating,
  totalReviews,
  ratingCategories,
  reviews,
  initialReviewsCount = 6,
  onShowAllReviews,
  className,
  style,
}: ReviewsSectionProps) {
  const [showAll, setShowAll] = React.useState(false);
  const visibleReviews = showAll ? reviews : reviews.slice(0, initialReviewsCount);
  const hasMore = !showAll && reviews.length > initialReviewsCount;

  const handleShowAll = () => {
    setShowAll(true);
    onShowAllReviews?.();
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
      <div style={{ marginBottom: 'var(--ds-content-gap-md)' }}>
        <Text variant="h2" color="primary" as="div" style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-spacing-8)' }}>
          ★ {overallRating.toFixed(1)} · {totalReviews} reviews
        </Text>
      </div>
      {ratingCategories.length > 0 && (
        <div style={{ marginBottom: 'var(--ds-content-gap-md)' }}>
          <ReviewScoreBars ratingCategories={ratingCategories} />
        </div>
      )}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--ds-spacing-40)',
          marginBottom: hasMore ? 'var(--ds-content-gap-md)' : 0,
        }}
      >
        {visibleReviews.map((review, i) => (
          <ReviewCard
            key={i}
            reviewerName={review.reviewerName}
            reviewerAvatarUrl={review.reviewerAvatarUrl}
            bookingContext={review.bookingContext}
            snippet={review.snippet}
          />
        ))}
      </div>
      {hasMore && (
        <Button variant="secondary" size="lg" onClick={handleShowAll}>
          Show all {totalReviews} reviews
        </Button>
      )}
    </div>
  );
}
