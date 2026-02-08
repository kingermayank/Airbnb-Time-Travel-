import './HeroGridSkeleton.css';

export function HeroGridSkeleton() {
  return (
    <div className="hero-grid-skeleton">
      {/* Left large block */}
      <div className="skeleton-block skeleton-main" />
      
      {/* Right 2x2 grid */}
      <div className="skeleton-grid">
        {/* Top Row */}
        <div className="skeleton-row">
          <div className="skeleton-block skeleton-top-left" />
          <div className="skeleton-block skeleton-top-right" />
        </div>
        {/* Bottom Row */}
        <div className="skeleton-row">
          <div className="skeleton-block skeleton-bottom-left" />
          <div className="skeleton-block skeleton-bottom-right" />
        </div>
      </div>
    </div>
  );
}

