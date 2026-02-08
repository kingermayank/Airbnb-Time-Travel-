import './ListingCardSkeleton.css';

export function ListingCardSkeleton() {
  return (
    <div className="listing-card-skeleton">
      <div className="skeleton-image" />
      <div className="skeleton-content">
        <div className="skeleton-line skeleton-line-1" />
        <div className="skeleton-line skeleton-line-2" />
        <div className="skeleton-line skeleton-line-3" />
      </div>
    </div>
  );
}


