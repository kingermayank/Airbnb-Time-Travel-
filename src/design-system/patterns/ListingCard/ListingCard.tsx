import React, { useState, useCallback } from 'react';
import { Text } from '../../foundations/Text';
import { Badge } from '../../foundations/Badge';
import { Icon } from '../../foundations/Icon';
import { Heart } from 'lucide-react';
import './ListingCard.css';

export interface ListingCardProps {
  id: string;
  image: string;
  title: string;
  /** Optional year or era (e.g. "30 BC", "2187") shown with title. */
  year?: string;
  /** Optional; when omitted, price row is hidden (e.g. on homepage). */
  price?: string;
  rating?: string;
  date?: string;
  isGuestFavorite?: boolean;
  /** Initial liked state for the heart (e.g. for Storybook). */
  defaultLiked?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const MAX_TILT_DEG = 4;

const cardWrapperStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--ds-spacing-12)',
  cursor: 'pointer',
  transition: 'transform 0.2s ease',
  width: '100%',
};

/* Min 44px tap target for touch/a11y. Pushed tight into top-right corner to mirror badge placement. */
const heartButtonStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  right: 0,
  minWidth: 44,
  minHeight: 44,
  padding: 10,
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  zIndex: 2,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const badgeWrapperStyle: React.CSSProperties = {
  position: 'absolute',
  top: 'var(--ds-listing-card-badge-inset-top)',
  left: 'var(--ds-listing-card-badge-inset-left)',
  zIndex: 2,
};

const infoStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--ds-spacing-4)',
  paddingLeft: 'var(--ds-spacing-4)',
};

const priceRowStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 'var(--ds-spacing-4)',
};

// Only enable tilt on devices that support hover (i.e. not touch)
const supportsHover =
  typeof window !== 'undefined' && window.matchMedia?.('(hover: hover)').matches;

export function ListingCard({
  id,
  image,
  title,
  year,
  price,
  rating,
  date,
  isGuestFavorite,
  defaultLiked = false,
  onClick,
  className,
  style,
}: ListingCardProps) {
  const [isLiked, setIsLiked] = useState(defaultLiked);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  const [highlight, setHighlight] = useState({ x: 50, y: 50, visible: false });
  const isActive = tilt.x !== 0 || tilt.y !== 0;
  const isVisualHover = supportsHover && (isHoveringImage || isActive);

  const updatePointerEffects = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!supportsHover) return;
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const relativeX = e.clientX - rect.left;
      const relativeY = e.clientY - rect.top;
      const normX = (relativeX - cx) / cx;
      const normY = (relativeY - cy) / cy;
      const xPercent = Math.max(0, Math.min(100, (relativeX / rect.width) * 100));
      const yPercent = Math.max(0, Math.min(100, (relativeY / rect.height) * 100));
      setTilt({ x: -normY * MAX_TILT_DEG, y: normX * MAX_TILT_DEG });
      setHighlight({ x: xPercent, y: yPercent, visible: true });
    },
    [],
  );

  const handleImageMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      updatePointerEffects(e);
    },
    [updatePointerEffects],
  );

  const handleImageMouseLeave = useCallback(() => {
    setIsHoveringImage(false);
    setTilt({ x: 0, y: 0 });
    setHighlight((prev) => ({ ...prev, visible: false }));
  }, []);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked((prev) => !prev);
  };

  const imageContainerDynamicStyle: React.CSSProperties = {
    height: 248,
    borderRadius: 'var(--ds-radius-lg)',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#f3f3f3',
    transform: supportsHover
      ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(${isActive ? 8 : 0}px)`
      : undefined,
    transition: 'transform 0.18s ease-out, box-shadow 0.22s ease',
    boxShadow: isActive
      ? '0 12px 28px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.06)'
      : 'none',
    willChange: supportsHover ? 'transform' : undefined,
  };

  return (
    <div
      className={[
        'ds-listing-card',
        isVisualHover ? 'ds-listing-card--hovering' : '',
        className ?? '',
      ].filter(Boolean).join(' ')}
      style={{ ...cardWrapperStyle, ...style }}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      role="button"
      tabIndex={0}
    >
      <div
        style={imageContainerDynamicStyle}
        onMouseEnter={(e) => {
          if (!supportsHover) return;
          setIsHoveringImage(true);
          updatePointerEffects(e);
        }}
        onMouseMove={handleImageMouseMove}
        onMouseLeave={handleImageMouseLeave}
      >
        <img
          src={image}
          alt={title}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: isVisualHover ? 'scale(1.04)' : 'scale(1)',
            transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />
        <div
          className="ds-listing-card-specular-highlight"
          aria-hidden
          style={{
            opacity: isVisualHover && highlight.visible ? 0.8 : 0,
            background: `radial-gradient(circle 40px at ${highlight.x}% ${highlight.y}%, hsla(2, 88%, 62%, 0.38) 0%, hsla(44, 95%, 62%, 0.34) 28%, hsla(190, 92%, 64%, 0.3) 56%, hsla(318, 92%, 66%, 0.32) 78%, hsla(318, 92%, 66%, 0) 100%)`,
          }}
        />
        {isGuestFavorite && (
          <div style={badgeWrapperStyle}>
            <Badge>Frequently revisited</Badge>
          </div>
        )}
        <button
          type="button"
          className={`ds-listing-card-heart-btn${isLiked ? ' is-liked' : ''}`}
          style={heartButtonStyle}
          onClick={handleHeartClick}
          aria-label={isLiked ? 'Remove from favorites' : 'Add to favorites'}
        >
          <span className="ds-listing-card-heart-ripple" aria-hidden />
          <Icon size="md" color="white" className="ds-listing-card-heart-icon">
            <Heart
              size={24}
              fill={isLiked ? 'var(--ds-accent)' : 'var(--ds-heart-interior-unfilled)'}
              stroke={isLiked ? 'var(--ds-accent)' : 'currentColor'}
              strokeWidth={2}
            />
          </Icon>
        </button>
      </div>
      <div
        style={{
          ...infoStyle,
          transform: isVisualHover ? 'translateY(-2px)' : 'translateY(0)',
          transition: 'transform 0.22s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <Text
          variant="body"
          weight="medium"
          color="primary"
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {title}
        </Text>
        <div style={priceRowStyle}>
          {[price, year != null && year !== '' ? year : null, rating != null ? `★ ${rating}` : null]
            .filter(Boolean)
            .map((segment, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <Text variant="bodySmall" color="secondary" style={{ fontWeight: 800 }}>
                    ·
                  </Text>
                )}
                <Text
                  variant="bodySmall"
                  color={index === 0 && price != null ? 'primary' : 'secondary'}
                  weight={index === 0 ? 'medium' : undefined}
                >
                  {segment}
                </Text>
              </React.Fragment>
            ))}
        </div>
      </div>
    </div>
  );
}
