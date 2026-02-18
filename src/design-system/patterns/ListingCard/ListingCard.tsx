import React, { useState, useCallback, useRef, useEffect } from 'react';
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

const HOVER_LIFT_PX = 4;
const HOVER_SCALE = 1.01;
const TILT_MAX_DEG = 2.6;
const SPECULAR_OPACITY = 0.5;
const CURSOR_LERP = 0.12;
const SPECULAR_DRIFT_POINTS = 5;
const SPECULAR_DRIFT_CYCLE_MS = 1800;
const SPECULAR_DRIFT_PERCENT = 0.5;
const SPECULAR_RIPPLE_AMOUNT = 0.4;
const SPECULAR_RIPPLE_SPEED_MS = 2500;
const HOVER_DURATION_MS = 220;

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

const EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)';
const SPECULAR_WAYPOINTS = [
  { x: -0.85, y: 0.7 },
  { x: 0.9, y: -0.75 },
  { x: 0.35, y: 0.95 },
  { x: -1.0, y: -0.25 },
  { x: 0.72, y: 0.2 },
] as const;

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
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const targetRef = useRef({ x: 0, y: 0, px: 50, py: 50, hover: 0 });
  const currentRef = useRef({ x: 0, y: 0, px: 50, py: 50, hover: 0 });

  const supportsHover =
    typeof window !== 'undefined' && window.matchMedia?.('(hover: hover)').matches;
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const enableCursorEffects = supportsHover && !prefersReducedMotion;

  const applyPointerStyles = useCallback(() => {
    const el = imageContainerRef.current;
    if (!el) return;
    const current = currentRef.current;
    const hoverProgress = current.hover;
    const translateY = -HOVER_LIFT_PX * hoverProgress;
    const scale = 1 + (HOVER_SCALE - 1) * hoverProgress;
    const rotateX = -current.y * TILT_MAX_DEG * hoverProgress;
    const rotateY = current.x * TILT_MAX_DEG * hoverProgress;
    const now = performance.now();
    const driftProgress = (now % SPECULAR_DRIFT_CYCLE_MS) / SPECULAR_DRIFT_CYCLE_MS;
    const segmentLength = 1 / SPECULAR_DRIFT_POINTS;
    const segment = Math.min(SPECULAR_DRIFT_POINTS - 1, Math.floor(driftProgress / segmentLength));
    const segmentT = (driftProgress - segment * segmentLength) / segmentLength;
    const from = SPECULAR_WAYPOINTS[segment];
    const to = SPECULAR_WAYPOINTS[(segment + 1) % SPECULAR_DRIFT_POINTS];
    const driftX = (from.x + (to.x - from.x) * segmentT) * SPECULAR_DRIFT_PERCENT * hoverProgress;
    const driftY = (from.y + (to.y - from.y) * segmentT) * SPECULAR_DRIFT_PERCENT * hoverProgress;
    const rippleProgress = (now % SPECULAR_RIPPLE_SPEED_MS) / SPECULAR_RIPPLE_SPEED_MS;
    const rippleWave = Math.sin(rippleProgress * Math.PI * 2) * SPECULAR_RIPPLE_AMOUNT * hoverProgress;
    const highlightX = Math.max(0, Math.min(100, current.px + driftX));
    const highlightY = Math.max(0, Math.min(100, current.py + driftY + rippleWave));
    const highlightSize = 40 + SPECULAR_RIPPLE_AMOUNT * 6 * (0.5 + 0.5 * Math.sin(rippleProgress * Math.PI * 2));

    el.style.transform =
      `perspective(920px) translateY(${translateY.toFixed(3)}px) scale(${scale.toFixed(4)}) rotateX(${rotateX.toFixed(3)}deg) rotateY(${rotateY.toFixed(3)}deg)`;
    el.style.setProperty('--ds-listing-highlight-x', `${highlightX.toFixed(2)}%`);
    el.style.setProperty('--ds-listing-highlight-y', `${highlightY.toFixed(2)}%`);
    el.style.setProperty('--ds-listing-highlight-opacity', `${(SPECULAR_OPACITY * hoverProgress).toFixed(3)}`);
    el.style.setProperty('--ds-listing-highlight-size', `${highlightSize.toFixed(2)}px`);
  }, []);

  const animatePointer = useCallback(() => {
    const target = targetRef.current;
    const current = currentRef.current;
    current.x += (target.x - current.x) * CURSOR_LERP;
    current.y += (target.y - current.y) * CURSOR_LERP;
    current.px += (target.px - current.px) * CURSOR_LERP;
    current.py += (target.py - current.py) * CURSOR_LERP;
    current.hover += (target.hover - current.hover) * CURSOR_LERP;
    applyPointerStyles();

    const isSettled =
      Math.abs(target.x - current.x) < 0.001 &&
      Math.abs(target.y - current.y) < 0.001 &&
      Math.abs(target.px - current.px) < 0.01 &&
      Math.abs(target.py - current.py) < 0.01 &&
      Math.abs(target.hover - current.hover) < 0.001;
    if (!isSettled || target.hover > 0.001) {
      rafRef.current = window.requestAnimationFrame(animatePointer);
      return;
    }
    rafRef.current = null;
  }, [applyPointerStyles]);

  const queuePointerAnimation = useCallback(() => {
    if (rafRef.current == null) {
      rafRef.current = window.requestAnimationFrame(animatePointer);
    }
  }, [animatePointer]);

  const syncPointerTarget = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const relativeX = e.clientX - rect.left;
    const relativeY = e.clientY - rect.top;
    const normX = Math.max(-1, Math.min(1, (relativeX - cx) / cx));
    const normY = Math.max(-1, Math.min(1, (relativeY - cy) / cy));
    const percentX = Math.max(0, Math.min(100, (relativeX / rect.width) * 100));
    const percentY = Math.max(0, Math.min(100, (relativeY / rect.height) * 100));
    targetRef.current.x = normX;
    targetRef.current.y = normY;
    targetRef.current.px = percentX;
    targetRef.current.py = percentY;
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current != null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
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
    transform:
      !enableCursorEffects && isHoveringImage
        ? `translateY(-${HOVER_LIFT_PX}px) scale(${HOVER_SCALE})`
        : 'translateY(0) scale(1)',
    transition: enableCursorEffects
      ? undefined
      : `transform ${HOVER_DURATION_MS}ms ${EASE_OUT}, box-shadow ${HOVER_DURATION_MS}ms ease`,
    boxShadow: isHoveringImage
      ? '0 12px 28px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.06)'
      : '0 4px 12px rgba(0,0,0,0.04)',
    willChange: 'transform, opacity',
    ['--ds-listing-highlight-x' as string]: '50%',
    ['--ds-listing-highlight-y' as string]: '50%',
    ['--ds-listing-highlight-opacity' as string]: '0',
    ['--ds-listing-highlight-size' as string]: '40px',
  };

  return (
    <div
      className={[
        'ds-listing-card',
        isHoveringImage ? 'ds-listing-card--hovering' : '',
        className ?? '',
      ].filter(Boolean).join(' ')}
      style={{ ...cardWrapperStyle, ...style }}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      role="button"
      tabIndex={0}
    >
      <div
        ref={imageContainerRef}
        className="ds-listing-card-image-shell"
        style={imageContainerDynamicStyle}
        onMouseEnter={(e) => {
          setIsHoveringImage(true);
          if (!enableCursorEffects) return;
          targetRef.current.hover = 1;
          syncPointerTarget(e);
          queuePointerAnimation();
        }}
        onMouseMove={(e) => {
          if (!enableCursorEffects) return;
          syncPointerTarget(e);
          queuePointerAnimation();
        }}
        onMouseLeave={() => {
          setIsHoveringImage(false);
          if (!enableCursorEffects) return;
          targetRef.current.x = 0;
          targetRef.current.y = 0;
          targetRef.current.px = 50;
          targetRef.current.py = 50;
          targetRef.current.hover = 0;
          queuePointerAnimation();
        }}
      >
        <img
          src={image}
          alt={title}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'scale(1)',
            transition: `transform ${HOVER_DURATION_MS}ms ${EASE_OUT}`,
          }}
        />
        <div
          className="ds-listing-card-specular-highlight"
          aria-hidden
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
          transform: isHoveringImage ? 'translateY(-2px)' : 'translateY(0)',
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
