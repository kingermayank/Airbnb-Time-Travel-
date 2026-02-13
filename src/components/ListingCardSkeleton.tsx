import './ListingCardSkeleton.css';

export function ListingCardSkeleton() {
  return (
    <div className="listing-card-skeleton">
      <div className="skeleton-image" />
      <div className="skeleton-content">
        <div className="skeleton-title" />
        <div className="skeleton-price-row" />
      </div>
    </div>
  );
}


