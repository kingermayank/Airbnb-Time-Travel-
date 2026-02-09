import './HeroGridSkeleton.css';

export function HeroGridSkeleton() {
  return (
    <div className="hero-grid-skeleton">
      {/* Main image - spans 2 rows (matches gridRow: span 2) */}
      <div className="skeleton-block skeleton-main" />
      {/* Top right */}
      <div className="skeleton-block skeleton-top-left" />
      <div className="skeleton-block skeleton-top-right" />
      {/* Bottom right */}
      <div className="skeleton-block skeleton-bottom-left" />
      <div className="skeleton-block skeleton-bottom-right" />
    </div>
  );
}

