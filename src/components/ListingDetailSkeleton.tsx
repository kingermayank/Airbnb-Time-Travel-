import { Header } from '../design-system';
import { HeaderRightSlotWithUserMenu } from './HeaderRightSlotWithUserMenu';
import { HeroGridSkeleton } from './HeroGridSkeleton';
import { PORTAL_ICON_URL, MINDSCAPES_ICON_URL } from '../design-system/patterns/Header/header-nav-assets';
import './ListingDetailSkeleton.css';

const FIGMA_NAV_ITEMS = [
  { label: 'Time Travel', iconUrl: PORTAL_ICON_URL },
  { label: 'Mindscapes', iconUrl: MINDSCAPES_ICON_URL, disabled: true },
];

interface ListingDetailSkeletonProps {
  hideHeader?: boolean;
  isMobile: boolean;
  isTablet: boolean;
}

function SkeletonBar({ width, height, className = '' }: { width: string; height: number; className?: string }) {
  return <div className={`lds-bar ${className}`} style={{ width, height }} />;
}

function SkeletonCircle({ size }: { size: number }) {
  return <div className="lds-circle" style={{ width: size, height: size }} />;
}

function SkeletonCard({ height }: { height: number }) {
  return <div className="lds-card" style={{ height }} />;
}

export function ListingDetailSkeleton({ hideHeader = false, isMobile, isTablet }: ListingDetailSkeletonProps) {
  return (
    <div className="listing-detail-skeleton">
      {!hideHeader && (
        <Header
          brandName="WarpBnB"
          navItems={FIGMA_NAV_ITEMS}
          activeNavLabel="Time Travel"
          onNavClick={() => {}}
          onLogoClick={() => {}}
          rightSlot={<HeaderRightSlotWithUserMenu />}
          showDivider
        />
      )}

      <div
        className="listing-detail-skeleton__shell"
        style={{
          padding: isMobile
            ? '0 16px 120px 16px'
            : isTablet
              ? '28px 20px 64px 20px'
              : '32px 24px 64px 24px',
        }}
      >
        <div className="listing-detail-skeleton__max">
          {!isMobile && (
            <div className="listing-detail-skeleton__title-row">
              <SkeletonBar width="58%" height={isTablet ? 34 : 40} />
              <div className="listing-detail-skeleton__actions">
                <SkeletonBar width="56px" height={18} />
                <SkeletonBar width="56px" height={18} />
              </div>
            </div>
          )}

          {isMobile ? (
            <div className="listing-detail-skeleton__mobile-hero">
              <SkeletonCard height={320} />
              <div className="listing-detail-skeleton__mobile-hero-overlay">
                <SkeletonCircle size={44} />
                <SkeletonCircle size={44} />
              </div>
            </div>
          ) : (
            <HeroGridSkeleton />
          )}

          <div className="listing-detail-skeleton__summary">
            <div className="listing-detail-skeleton__summary-left">
              <SkeletonBar width="24%" height={16} />
              <SkeletonBar width="42%" height={16} />
              <SkeletonBar width="30%" height={16} />
            </div>
            <div className="listing-detail-skeleton__summary-right">
              <SkeletonBar width="84px" height={18} />
              <SkeletonBar width="88px" height={18} />
              <SkeletonBar width="76px" height={18} />
            </div>
          </div>

          <div className="listing-detail-skeleton__content">
            <div className="listing-detail-skeleton__main">
              <div className="listing-detail-skeleton__section">
                <SkeletonBar width="48%" height={18} />
                <div className="listing-detail-skeleton__host-row">
                  <SkeletonCircle size={48} />
                  <div className="listing-detail-skeleton__host-copy">
                    <SkeletonBar width="52%" height={18} />
                    <SkeletonBar width="36%" height={14} />
                  </div>
                </div>
                <div className="listing-detail-skeleton__paragraphs">
                  <SkeletonBar width="100%" height={14} />
                  <SkeletonBar width="96%" height={14} />
                  <SkeletonBar width="90%" height={14} />
                  <SkeletonBar width="74%" height={14} />
                </div>
              </div>

              <div className="listing-detail-skeleton__section">
                <SkeletonBar width="34%" height={18} />
                <div className="listing-detail-skeleton__feature-list">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <div key={idx} className="listing-detail-skeleton__feature">
                      <SkeletonCircle size={28} />
                      <div className="listing-detail-skeleton__feature-copy">
                        <SkeletonBar width="64%" height={16} />
                        <SkeletonBar width="92%" height={14} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="listing-detail-skeleton__section">
                <SkeletonBar width="26%" height={18} />
                <div className="listing-detail-skeleton__paragraphs">
                  <SkeletonBar width="100%" height={14} />
                  <SkeletonBar width="96%" height={14} />
                  <SkeletonBar width="83%" height={14} />
                </div>
              </div>

              <div className="listing-detail-skeleton__section">
                <SkeletonBar width="30%" height={18} />
                <div className="listing-detail-skeleton__beds">
                  {Array.from({ length: 2 }).map((_, idx) => (
                    <SkeletonCard key={idx} height={92} />
                  ))}
                </div>
              </div>

              <div className="listing-detail-skeleton__section">
                <SkeletonBar width="18%" height={18} />
                <div className="listing-detail-skeleton__amenities">
                  {Array.from({ length: 8 }).map((_, idx) => (
                    <div key={idx} className="listing-detail-skeleton__amenity">
                      <SkeletonCircle size={20} />
                      <SkeletonBar width={idx % 3 === 0 ? '70%' : idx % 3 === 1 ? '52%' : '64%'} height={14} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="listing-detail-skeleton__section">
                <SkeletonBar width="22%" height={18} />
                <div className="listing-detail-skeleton__reviews">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <SkeletonCard key={idx} height={118} />
                  ))}
                </div>
              </div>

              <div className="listing-detail-skeleton__section">
                <SkeletonBar width="24%" height={18} />
                <div className="listing-detail-skeleton__host-card">
                  <div className="listing-detail-skeleton__host-card-top">
                    <SkeletonCircle size={72} />
                    <div className="listing-detail-skeleton__host-card-copy">
                      <SkeletonBar width="60%" height={22} />
                      <SkeletonBar width="42%" height={14} />
                      <SkeletonBar width="54%" height={14} />
                    </div>
                  </div>
                  <div className="listing-detail-skeleton__paragraphs">
                    <SkeletonBar width="100%" height={14} />
                    <SkeletonBar width="95%" height={14} />
                    <SkeletonBar width="87%" height={14} />
                  </div>
                </div>
              </div>

              <div className="listing-detail-skeleton__section">
                <SkeletonBar width="24%" height={18} />
                <div className="listing-detail-skeleton__things">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <SkeletonCard key={idx} height={84} />
                  ))}
                </div>
              </div>
            </div>

            <aside className="listing-detail-skeleton__booking">
              <div className="listing-detail-skeleton__booking-card">
                <SkeletonBar width="46%" height={28} />
                <SkeletonBar width="68%" height={14} />
                <div className="listing-detail-skeleton__booking-row">
                  <SkeletonCard height={52} />
                  <SkeletonCard height={52} />
                </div>
                <SkeletonBar width="100%" height={52} />
                <div className="listing-detail-skeleton__booking-lines">
                  <SkeletonBar width="90%" height={14} />
                  <SkeletonBar width="76%" height={14} />
                  <SkeletonBar width="64%" height={14} />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
