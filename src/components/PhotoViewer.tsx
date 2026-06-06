import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Share, Heart, ChevronLeft } from 'lucide-react';
import { SpotlightOverlay } from '@/components/ui/image-reveal';
import { useDeviceType } from '../hooks/use-mobile';
import './PhotoViewer.css';

type DesktopSlotKey = 'offLeft' | 'left' | 'center' | 'right' | 'offRight';
type PanelRole = 'left' | 'center' | 'right';

type MotionSlotFrame = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type DesktopFrames = Record<DesktopSlotKey, MotionSlotFrame>;

type DesktopAnimationState = {
  cycle: number;
  direction: 1 | -1;
  nextIndex: number;
};

interface PhotoViewerProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
  onShareClick?: () => void;
  layoutId?: string;
  enableSpotlight?: boolean;
}

const PANEL_EASE: [number, number, number, number] = [0.25, 1, 0.4, 1];

const PANEL_TRANSITION = {
  type: 'tween' as const,
  duration: 0.4,
  ease: PANEL_EASE,
};

const DESKTOP_PANEL_GAP = 48;
const PANEL_RADIUS = 16;
const DESKTOP_CENTER_SCALE = 0.975;

function getPanelRadius(role: PanelRole) {
  return {
    borderTopLeftRadius: role === 'left' ? 0 : PANEL_RADIUS,
    borderTopRightRadius: role === 'right' ? 0 : PANEL_RADIUS,
    borderBottomRightRadius: role === 'right' ? 0 : PANEL_RADIUS,
    borderBottomLeftRadius: role === 'left' ? 0 : PANEL_RADIUS,
  };
}

function wrapIndex(index: number, count: number) {
  return ((index % count) + count) % count;
}

function getDesktopFrames(width: number, height: number): DesktopFrames {
  const sideWidth = width * 0.08;
  const sideHeight = height * 0.68;
  const gap = DESKTOP_PANEL_GAP;
  const rawCenterWidth = width - sideWidth * 2 - gap * 2;
  const centerWidth = rawCenterWidth * DESKTOP_CENTER_SCALE;
  const centerHeight = centerWidth * (9 / 16);
  const sideTop = (height - sideHeight) / 2;
  const centerTop = (height - centerHeight) / 2;
  const offscreenGap = Math.max(40, sideWidth * 0.72);
  const centerX = sideWidth + gap + (rawCenterWidth - centerWidth) / 2;

  return {
    offLeft: {
      x: -sideWidth - offscreenGap,
      y: sideTop,
      width: sideWidth,
      height: sideHeight,
    },
    left: {
      x: 0,
      y: sideTop,
      width: sideWidth,
      height: sideHeight,
    },
    center: {
      x: centerX,
      y: centerTop,
      width: centerWidth,
      height: centerHeight,
    },
    right: {
      x: width - sideWidth,
      y: sideTop,
      width: sideWidth,
      height: sideHeight,
    },
    offRight: {
      x: width + offscreenGap,
      y: sideTop,
      width: sideWidth,
      height: sideHeight,
    },
  };
}

export function PhotoViewer({
  images,
  initialIndex,
  onClose,
  onShareClick,
  layoutId,
  enableSpotlight = false,
}: PhotoViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLiked, setIsLiked] = useState(false);
  const [isShareHovered, setIsShareHovered] = useState(false);
  const [isSaveHovered, setIsSaveHovered] = useState(false);
  const [desktopAnimation, setDesktopAnimation] = useState<DesktopAnimationState | null>(null);
  const [desktopSceneSize, setDesktopSceneSize] = useState({ width: 0, height: 0 });
  const [viewerGlare, setViewerGlare] = useState({ x: 50, y: 50, active: false });
  const shouldReduceMotion = useReducedMotion();
  const { isMobile } = useDeviceType();
  const mainImageFrameRef = useRef<HTMLDivElement>(null);
  const desktopSceneRef = useRef<HTMLDivElement>(null);
  const queuedDesktopDirectionRef = useRef<1 | -1 | null>(null);
  const animationCycleRef = useRef(0);
  const touchStartXRef = useRef<number | null>(null);

  const n = images.length;
  const prevIndex = n > 1 ? wrapIndex(currentIndex - 1, n) : 0;
  const nextIndex = n > 1 ? wrapIndex(currentIndex + 1, n) : 0;
  const prev2Index = n > 2 ? wrapIndex(currentIndex - 2, n) : 0;
  const next2Index = n > 2 ? wrapIndex(currentIndex + 2, n) : 0;
  const hasMultiple = n > 1;
  const hasDualPreview = n > 2;
  const supportsHover =
    typeof window !== 'undefined' && window.matchMedia?.('(hover: hover)').matches;
  const canUseGlare = supportsHover && !shouldReduceMotion && !enableSpotlight;
  const isDesktopAnimating = !isMobile && desktopAnimation !== null;
  const desktopFrames =
    !isMobile && desktopSceneSize.width > 0 && desktopSceneSize.height > 0
      ? getDesktopFrames(desktopSceneSize.width, desktopSceneSize.height)
      : null;
  const canAnimateDesktop = !isMobile && !shouldReduceMotion && n > 2 && desktopFrames !== null;
  const transition = shouldReduceMotion ? { duration: 0 } : PANEL_TRANSITION;
  const centerCardShadow = '0 20px 60px rgba(0, 0, 0, 0.4)';
  const displayIndex = desktopAnimation?.nextIndex ?? currentIndex;
  const centerLayoutId =
    layoutId && currentIndex === initialIndex
      ? layoutId
      : `photo-viewer-image-${currentIndex}`;

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setDesktopAnimation(null);
    queuedDesktopDirectionRef.current = null;
  }, [initialIndex]);

  useEffect(() => {
    if (isMobile) return;
    const element = desktopSceneRef.current;
    if (!element) return;

    const updateSceneSize = () => {
      const rect = element.getBoundingClientRect();
      setDesktopSceneSize({
        width: rect.width,
        height: rect.height,
      });
    };

    updateSceneSize();
    const observer = new ResizeObserver(updateSceneSize);
    observer.observe(element);

    return () => observer.disconnect();
  }, [isMobile]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  });

  const commitDesktopAnimation = useCallback((cycle: number) => {
    setDesktopAnimation((active) => {
      if (!active || active.cycle !== cycle) return active;
      const committedIndex = active.nextIndex;
      const queuedDirection = queuedDesktopDirectionRef.current;
      queuedDesktopDirectionRef.current = null;
      setCurrentIndex(committedIndex);
      if (queuedDirection && n > 2) {
        window.requestAnimationFrame(() => {
          animationCycleRef.current += 1;
          setDesktopAnimation({
            cycle: animationCycleRef.current,
            direction: queuedDirection,
            nextIndex: wrapIndex(committedIndex + queuedDirection, n),
          });
        });
      }
      return null;
    });
  }, [n]);

  const startDesktopStep = useCallback((direction: 1 | -1) => {
    if (!hasMultiple) return;

    if (desktopAnimation) {
      queuedDesktopDirectionRef.current = direction;
      return;
    }

    if (!canAnimateDesktop) {
      setCurrentIndex((prev) => wrapIndex(prev + direction, n));
      return;
    }

    animationCycleRef.current += 1;
    setViewerGlare((prev) => ({ ...prev, active: false }));
    setDesktopAnimation({
      cycle: animationCycleRef.current,
      direction,
      nextIndex: wrapIndex(currentIndex + direction, n),
    });
  }, [canAnimateDesktop, currentIndex, desktopAnimation, hasMultiple, n]);

  const handlePrevious = useCallback(() => {
    if (!hasMultiple) return;
    if (isMobile || shouldReduceMotion) {
      setCurrentIndex((prev) => wrapIndex(prev - 1, n));
      return;
    }
    startDesktopStep(-1);
  }, [hasMultiple, isMobile, n, shouldReduceMotion, startDesktopStep]);

  const handleNext = useCallback(() => {
    if (!hasMultiple) return;
    if (isMobile || shouldReduceMotion) {
      setCurrentIndex((prev) => wrapIndex(prev + 1, n));
      return;
    }
    startDesktopStep(1);
  }, [hasMultiple, isMobile, n, shouldReduceMotion, startDesktopStep]);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = e.touches[0]?.clientX ?? null;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!hasMultiple || touchStartXRef.current == null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartXRef.current;
    const deltaX = endX - touchStartXRef.current;
    touchStartXRef.current = null;
    if (Math.abs(deltaX) < 44) return;
    if (deltaX > 0) {
      handlePrevious();
    } else {
      handleNext();
    }
  }, [handleNext, handlePrevious, hasMultiple]);

  const handleShare = () => {
    if (onShareClick) {
      onShareClick();
      return;
    }
    if (navigator.share) {
      navigator.share({
        title: 'Check out this photo',
        url: images[currentIndex],
      }).catch(() => {
        navigator.clipboard.writeText(images[currentIndex]);
      });
    } else {
      navigator.clipboard.writeText(images[currentIndex]);
    }
  };

  if (images.length === 0 || typeof document === 'undefined') return null;

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.15, ease: 'easeOut' as const },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.15, ease: 'easeIn' as const },
    },
  };

  const renderStaticPanel = (
    frame: MotionSlotFrame,
    options: {
      key: string;
      imageIndex: number;
      role: PanelRole;
      panelRef?: React.RefObject<HTMLDivElement | null>;
      interactive?: boolean;
      layoutIdValue?: string;
    },
  ) => {
    const isCenter = options.role === 'center';
    const panelRadius = getPanelRadius(options.role);

    return (
      <motion.div
        key={options.key}
        layout={isCenter}
        layoutId={options.layoutIdValue}
        transition={transition}
        initial={false}
        animate={{
          left: frame.x,
          top: frame.y,
          width: frame.width,
          height: frame.height,
          opacity: 1,
        }}
        style={{
          position: 'absolute',
          overflow: 'hidden',
          ...panelRadius,
          boxShadow: isCenter ? centerCardShadow : 'none',
        }}
      >
        <div
          ref={options.panelRef}
          onTouchStart={isCenter ? handleTouchStart : undefined}
          onTouchEnd={isCenter ? handleTouchEnd : undefined}
          onMouseMove={isCenter && options.interactive ? ((e) => {
            if (!canUseGlare) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const relativeX = e.clientX - rect.left;
            const relativeY = e.clientY - rect.top;
            const percentX = Math.max(0, Math.min(100, (relativeX / rect.width) * 100));
            const percentY = Math.max(0, Math.min(100, (relativeY / rect.height) * 100));
            setViewerGlare({ x: percentX, y: percentY, active: true });
          }) : undefined}
          onMouseEnter={isCenter && options.interactive ? (() => {
            if (!canUseGlare) return;
            setViewerGlare((prev) => ({ ...prev, active: true }));
          }) : undefined}
          onMouseLeave={isCenter && options.interactive ? (() => {
            if (!canUseGlare) return;
            setViewerGlare((prev) => ({ ...prev, active: false }));
          }) : undefined}
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            borderRadius: 'inherit',
          }}
        >
          <img
            src={images[options.imageIndex]}
            alt={isCenter ? `Photo ${options.imageIndex + 1} of ${images.length}` : ''}
            aria-hidden={!isCenter}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition:
                options.role === 'left'
                  ? 'right center'
                  : options.role === 'right'
                    ? 'left center'
                    : 'center',
              filter: isCenter ? 'none' : 'brightness(0.9) saturate(1.05) blur(1.6px)',
              transform: isCenter ? 'scale(1)' : 'scale(1.03)',
            }}
          />
          {isCenter && options.interactive && <SpotlightOverlay enabled={enableSpotlight} />}
          {isCenter && options.interactive && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                opacity: canUseGlare && viewerGlare.active ? 0.52 : 0,
                transition: 'opacity 0.2s ease',
                pointerEvents: 'none',
                mixBlendMode: 'screen',
                filter: 'blur(4px) saturate(1.05)',
                background:
                  `radial-gradient(circle 44px at ${viewerGlare.x}% ${viewerGlare.y}%, ` +
                  'hsla(2, 88%, 62%, 0.38) 0%, ' +
                  'hsla(44, 95%, 62%, 0.34) 28%, ' +
                  'hsla(190, 92%, 64%, 0.30) 56%, ' +
                  'hsla(318, 92%, 66%, 0.32) 78%, ' +
                  'hsla(318, 92%, 66%, 0) 100%)',
              }}
            />
          )}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.28)',
              opacity: isCenter ? 0 : 1,
              pointerEvents: 'none',
            }}
          />
          {!isCenter && (
            <>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: options.role === 'left'
                    ? 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 35%)'
                    : 'linear-gradient(225deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 35%)',
                  mixBlendMode: 'screen',
                  pointerEvents: 'none',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: options.role === 'left'
                    ? 'linear-gradient(90deg, rgba(0,0,0,0.34) 0%, rgba(0,0,0,0) 55%)'
                    : 'linear-gradient(270deg, rgba(0,0,0,0.34) 0%, rgba(0,0,0,0) 55%)',
                  pointerEvents: 'none',
                }}
              />
            </>
          )}
        </div>
      </motion.div>
    );
  };

  const renderAnimatedPanel = (
    key: string,
    imageIndex: number,
    from: MotionSlotFrame,
    to: MotionSlotFrame,
    fromRole: PanelRole,
    toRole: PanelRole,
    onComplete?: () => void,
  ) => {
    const isCenter = toRole === 'center';
    const fromRadius = getPanelRadius(fromRole);
    const toRadius = getPanelRadius(toRole);
    return (
      <motion.div
        key={key}
        initial={{
          left: from.x,
          top: from.y,
          width: from.width,
          height: from.height,
          opacity: 1,
          ...fromRadius,
        }}
        animate={{
          left: to.x,
          top: to.y,
          width: to.width,
          height: to.height,
          opacity: 1,
          ...toRadius,
        }}
        transition={transition}
        onAnimationComplete={onComplete}
        style={{
          position: 'absolute',
          overflow: 'hidden',
          boxShadow: isCenter ? centerCardShadow : 'none',
          willChange:
            'left, top, width, height, border-radius',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            borderRadius: 'inherit',
          }}
        >
          <img
            src={images[imageIndex]}
            alt={isCenter ? `Photo ${imageIndex + 1} of ${images.length}` : ''}
            aria-hidden={!isCenter}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition:
                toRole === 'left'
                  ? 'right center'
                  : toRole === 'right'
                    ? 'left center'
                    : 'center',
              filter: isCenter ? 'none' : 'brightness(0.9) saturate(1.05) blur(1.6px)',
              transform: isCenter ? 'scale(1)' : 'scale(1.03)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.28)',
              opacity: isCenter ? 0 : 1,
              pointerEvents: 'none',
            }}
          />
          {!isCenter && (
            <>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: toRole === 'left'
                    ? 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 35%)'
                    : 'linear-gradient(225deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 35%)',
                  mixBlendMode: 'screen',
                  pointerEvents: 'none',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: toRole === 'left'
                    ? 'linear-gradient(90deg, rgba(0,0,0,0.34) 0%, rgba(0,0,0,0) 55%)'
                    : 'linear-gradient(270deg, rgba(0,0,0,0.34) 0%, rgba(0,0,0,0) 55%)',
                  pointerEvents: 'none',
                }}
              />
            </>
          )}
        </div>
      </motion.div>
    );
  };

  const renderDesktopScene = () => {
    if (!desktopFrames) return null;

    const leadCycle = desktopAnimation?.cycle;
    const leadComplete = leadCycle != null ? () => commitDesktopAnimation(leadCycle) : undefined;

    if (!desktopAnimation) {
      return (
        <>
          {renderStaticPanel(desktopFrames.left, {
            key: `idle-left-${prevIndex}`,
            imageIndex: prevIndex,
            role: 'left',
          })}
          {renderStaticPanel(desktopFrames.center, {
            key: `idle-center-${currentIndex}`,
            imageIndex: currentIndex,
            role: 'center',
            panelRef: mainImageFrameRef,
            interactive: true,
            layoutIdValue: centerLayoutId,
          })}
          {hasDualPreview && renderStaticPanel(desktopFrames.right, {
            key: `idle-right-${nextIndex}`,
            imageIndex: nextIndex,
            role: 'right',
          })}
        </>
      );
    }

    if (desktopAnimation.direction === 1) {
      return (
        <>
          {renderAnimatedPanel(
            `anim-left-out-${prevIndex}-${desktopAnimation.cycle}`,
            prevIndex,
            desktopFrames.left,
            desktopFrames.offLeft,
            'left',
            'left',
          )}
          {renderAnimatedPanel(
            `anim-center-to-left-${currentIndex}-${desktopAnimation.cycle}`,
            currentIndex,
            desktopFrames.center,
            desktopFrames.left,
            'center',
            'left',
          )}
          {renderAnimatedPanel(
            `anim-right-to-center-${nextIndex}-${desktopAnimation.cycle}`,
            nextIndex,
            desktopFrames.right,
            desktopFrames.center,
            'right',
            'center',
            leadComplete,
          )}
          {renderAnimatedPanel(
            `anim-incoming-right-${next2Index}-${desktopAnimation.cycle}`,
            next2Index,
            desktopFrames.offRight,
            desktopFrames.right,
            'right',
            'right',
          )}
        </>
      );
    }

    return (
      <>
        {renderAnimatedPanel(
          `anim-right-out-${nextIndex}-${desktopAnimation.cycle}`,
          nextIndex,
          desktopFrames.right,
          desktopFrames.offRight,
          'right',
          'right',
        )}
        {renderAnimatedPanel(
          `anim-center-to-right-${currentIndex}-${desktopAnimation.cycle}`,
          currentIndex,
          desktopFrames.center,
          desktopFrames.right,
          'center',
          'right',
        )}
        {renderAnimatedPanel(
          `anim-left-to-center-${prevIndex}-${desktopAnimation.cycle}`,
          prevIndex,
          desktopFrames.left,
          desktopFrames.center,
          'left',
          'center',
          leadComplete,
        )}
        {renderAnimatedPanel(
          `anim-incoming-left-${prev2Index}-${desktopAnimation.cycle}`,
          prev2Index,
          desktopFrames.offLeft,
          desktopFrames.left,
          'left',
          'left',
        )}
      </>
    );
  };

  const viewer = (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={backdropVariants}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          zIndex: 9998,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest('[data-photo-viewer-control="true"]')) return;
          const activeFrame = isMobile ? mainImageFrameRef.current : desktopSceneRef.current;
          if (!activeFrame?.contains(target)) {
            onClose();
          }
        }}
      >
        <div
          data-photo-viewer-control="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: isMobile ? '64px' : '80px',
            padding: isMobile ? '0 16px' : '0 24px',
            zIndex: 10000,
            pointerEvents: 'none',
          }}
        >
          <button
            onClick={onClose}
            aria-label="Back"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              width: '24px',
              height: '24px',
              borderRadius: 0,
              transition: 'background-color 0.2s, transform 0.1s',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              left: isMobile ? 16 : 24,
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'auto',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(-50%) scale(0.96)'; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; }}
          >
            <ChevronLeft size={20} strokeWidth={2.2} />
          </button>

          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'white',
              fontSize: isMobile ? '13px' : '14px',
              fontFamily: '"Figtree", sans-serif',
              fontWeight: 400,
              pointerEvents: 'none',
            }}
          >
            {displayIndex + 1} / {images.length}
          </div>

          <div
            style={{
              display: 'flex',
              gap: isMobile ? '10px' : '24px',
              alignItems: 'center',
              position: 'absolute',
              right: isMobile ? 16 : 24,
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'auto',
            }}
          >
            <button
              onClick={handleShare}
              className="pv-action-btn"
              onMouseEnter={() => setIsShareHovered(true)}
              onMouseLeave={() => setIsShareHovered(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: isShareHovered ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                color: 'white',
                textDecoration: 'underline',
              }}
            >
              <Share size={18} strokeWidth={1.5} />
              {!isMobile && <span>Share</span>}
            </button>

            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`pv-action-btn pv-save-btn${isLiked ? ' is-liked' : ''}`}
              onMouseEnter={() => setIsSaveHovered(true)}
              onMouseLeave={() => setIsSaveHovered(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: isSaveHovered ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                color: 'white',
                textDecoration: 'underline',
              }}
            >
              <span className="pv-save-ripple" aria-hidden />
              <Heart
                size={18}
                strokeWidth={1.5}
                fill={isLiked ? '#FF0257' : 'transparent'}
                stroke={isLiked ? '#FF0257' : 'white'}
                style={{ transition: 'fill 0.28s ease, stroke 0.28s ease' }}
              />
              {!isMobile && <span>{isLiked ? 'Saved' : 'Save'}</span>}
            </button>
          </div>
        </div>

        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            padding: isMobile ? '64px 0 86px' : '80px 0 60px',
            boxSizing: 'border-box',
            zIndex: 9999,
            overflow: 'hidden',
            maxHeight: isMobile ? '100dvh' : '85vh',
          }}
        >
          {isMobile ? (
            <div
              ref={mainImageFrameRef}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onMouseMove={(e) => {
                if (!canUseGlare) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const relativeX = e.clientX - rect.left;
                const relativeY = e.clientY - rect.top;
                const percentX = Math.max(0, Math.min(100, (relativeX / rect.width) * 100));
                const percentY = Math.max(0, Math.min(100, (relativeY / rect.height) * 100));
                setViewerGlare({ x: percentX, y: percentY, active: true });
              }}
              onMouseEnter={() => {
                if (!canUseGlare) return;
                setViewerGlare((prev) => ({ ...prev, active: true }));
              }}
              onMouseLeave={() => {
                if (!canUseGlare) return;
                setViewerGlare((prev) => ({ ...prev, active: false }));
              }}
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: 'calc(100vw - 32px)',
                aspectRatio: '4 / 5',
                maxHeight: 'calc(100dvh - 190px)',
                overflow: 'hidden',
                borderRadius: PANEL_RADIUS,
                background: 'transparent',
                margin: '0 auto',
              }}
            >
              <motion.div
                layout
                layoutId={centerLayoutId}
                transition={transition}
                initial={false}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: `${PANEL_RADIUS}px`,
                  overflow: 'hidden',
                  transformOrigin: 'center',
                  boxShadow: centerCardShadow,
                }}
              >
                <img
                  src={images[currentIndex]}
                  alt={`Photo ${currentIndex + 1} of ${images.length}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    objectPosition: 'center',
                  }}
                />
                <SpotlightOverlay enabled={enableSpotlight} />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: canUseGlare && viewerGlare.active ? 0.52 : 0,
                    transition: 'opacity 0.2s ease',
                    pointerEvents: 'none',
                    mixBlendMode: 'screen',
                    filter: 'blur(4px) saturate(1.05)',
                    background:
                      `radial-gradient(circle 44px at ${viewerGlare.x}% ${viewerGlare.y}%, ` +
                      'hsla(2, 88%, 62%, 0.38) 0%, ' +
                      'hsla(44, 95%, 62%, 0.34) 28%, ' +
                      'hsla(190, 92%, 64%, 0.30) 56%, ' +
                      'hsla(318, 92%, 66%, 0.32) 78%, ' +
                      'hsla(318, 92%, 66%, 0) 100%)',
                  }}
                />
                <motion.div
                  key={`center-overlay-${currentIndex}`}
                  initial={shouldReduceMotion ? false : { opacity: 0.38 }}
                  transition={transition}
                  animate={{ opacity: 0 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.28)',
                    pointerEvents: 'none',
                  }}
                />
              </motion.div>
            </div>
          ) : (
            <div
              ref={desktopSceneRef}
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
              }}
            >
              {renderDesktopScene()}
            </div>
          )}
        </div>

        {hasMultiple && !isMobile && (
          <>
            <button
              onClick={handlePrevious}
              data-photo-viewer-control="true"
              style={{
                position: 'absolute',
                left: '24px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(34, 34, 34, 0.6)',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s',
                zIndex: 10000,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(34, 34, 34, 0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(34, 34, 34, 0.6)';
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <button
              onClick={handleNext}
              data-photo-viewer-control="true"
              style={{
                position: 'absolute',
                right: '24px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(34, 34, 34, 0.6)',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s',
                zIndex: 10000,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(34, 34, 34, 0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(34, 34, 34, 0.6)';
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </>
        )}
        {hasMultiple && isMobile && (
          <div
            data-photo-viewer-control="true"
            style={{
              position: 'absolute',
              left: '50%',
              bottom: 20,
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              zIndex: 10000,
            }}
          >
            <button
              onClick={handlePrevious}
              aria-label="Previous photo"
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                backgroundColor: 'rgba(34, 34, 34, 0.72)',
                border: 'none',
                color: 'white',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              aria-label="Next photo"
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                backgroundColor: 'rgba(34, 34, 34, 0.72)',
                border: 'none',
                color: 'white',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(viewer, document.body);
}
