import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, LayoutGroup, useReducedMotion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Share, Heart, ChevronLeft } from 'lucide-react';
import { SpotlightOverlay } from '@/components/ui/image-reveal';
import { useDeviceType } from '../hooks/use-mobile';
import './PhotoViewer.css';

interface PhotoViewerProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
  onShareClick?: () => void;
  layoutId?: string; // Deprecated: kept for backward compatibility, no longer used
  enableSpotlight?: boolean;
}

// Slower, gentler ease-out so motion feels fluid and not abrupt
const CAROUSEL_TRANSITION = {
  type: 'tween' as const,
  duration: 0.82,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

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
  const [navDuration, setNavDuration] = useState(CAROUSEL_TRANSITION.duration);
  const [navDirection, setNavDirection] = useState<1 | -1>(1);
  const [viewerGlare, setViewerGlare] = useState({ x: 50, y: 50, active: false });
  const shouldReduceMotion = useReducedMotion();
  const { isMobile } = useDeviceType();
  const mainImageFrameRef = useRef<HTMLDivElement>(null);
  const lastNavAtRef = useRef(0);
  const navResetTimerRef = useRef<number | null>(null);
  const touchStartXRef = useRef<number | null>(null);

  const n = images.length;
  const prevIndex = n > 1 ? (currentIndex - 1 + n) % n : 0;
  const nextIndex = n > 1 ? (currentIndex + 1) % n : 0;
  const hasMultiple = n > 1;
  const effectiveRightIndex = n === 2 ? null : nextIndex;
  const supportsHover =
    typeof window !== 'undefined' && window.matchMedia?.('(hover: hover)').matches;
  const enableViewerGlare = supportsHover && !shouldReduceMotion && !enableSpotlight;
  const slotTransition = shouldReduceMotion
    ? { duration: 0 }
    : { ...CAROUSEL_TRANSITION, duration: navDuration };
  const centerCardShadow = '0 20px 60px rgba(0, 0, 0, 0.4)';
  const centerLayoutId =
    layoutId && currentIndex === initialIndex
      ? layoutId
      : `photo-viewer-image-${currentIndex}`;

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    return () => {
      if (navResetTimerRef.current != null) {
        window.clearTimeout(navResetTimerRef.current);
      }
    };
  }, []);

  const tuneNavigationMomentum = useCallback((direction: 1 | -1) => {
    if (shouldReduceMotion) return;
    setNavDirection(direction);
    const now = Date.now();
    const rapid = now - lastNavAtRef.current < 280;
    lastNavAtRef.current = now;
    setNavDuration(rapid ? 0.38 : CAROUSEL_TRANSITION.duration);
    if (navResetTimerRef.current != null) {
      window.clearTimeout(navResetTimerRef.current);
    }
    navResetTimerRef.current = window.setTimeout(() => {
      setNavDuration(CAROUSEL_TRANSITION.duration);
    }, 280);
  }, [shouldReduceMotion]);

  // Previous = go to lower index (image 2 -> 1). Next = go to higher index (image 1 -> 2).
  const handlePrevious = useCallback(() => {
    tuneNavigationMomentum(-1);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : n - 1));
  }, [n, tuneNavigationMomentum]);

  const handleNext = useCallback(() => {
    tuneNavigationMomentum(1);
    setCurrentIndex((prev) => (prev < n - 1 ? prev + 1 : 0));
  }, [n, tuneNavigationMomentum]);

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
  }, [handlePrevious, handleNext, onClose]);

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
          if (!mainImageFrameRef.current?.contains(target)) {
            onClose();
          }
        }}
      >
        {/* Top Bar - white text and icons on dark */}
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
            {currentIndex + 1} / {images.length}
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

        {/* Carousel row: shared-layout animation so center/side images physically flow between slots */}
        <LayoutGroup id="photo-viewer-carousel">
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
            {/* Left strip */}
            {!isMobile && (
              <div
                style={{
                  flex: '0 0 8%',
                  height: '68%',
                  minHeight: 120,
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '0 16px 16px 0',
                  background: 'transparent',
                }}
              >
                {hasMultiple && (
                  <>
                    <motion.div
                      layout
                      layoutId={`photo-viewer-image-${prevIndex}`}
                      transition={slotTransition}
                      initial={shouldReduceMotion ? false : { opacity: 0.9, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '0 16px 16px 0',
                        overflow: 'hidden',
                        transformOrigin: 'center',
                        boxShadow: 'none',
                      }}
                    >
                      <img
                        src={images[prevIndex]}
                        alt=""
                        aria-hidden
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'right center',
                          filter: 'brightness(0.9) saturate(1.05) blur(1.6px)',
                          transform: 'scale(1.03)',
                        }}
                      />
                      <motion.div
                        key={`left-overlay-${prevIndex}`}
                        initial={shouldReduceMotion ? false : { opacity: navDirection === 1 ? 0.18 : 1 }}
                        transition={slotTransition}
                        animate={{ opacity: 1 }}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'rgba(0, 0, 0, 0.28)',
                          pointerEvents: 'none',
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 35%)',
                          mixBlendMode: 'screen',
                          pointerEvents: 'none',
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(90deg, rgba(0,0,0,0.34) 0%, rgba(0,0,0,0) 55%)',
                          pointerEvents: 'none',
                        }}
                      />
                    </motion.div>
                  </>
                )}
              </div>
            )}

            {/* Center slot */}
            <div
              style={{
                flex: isMobile ? '1 1 100%' : '1 1 84%',
                minWidth: 0,
                alignSelf: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: isMobile ? '0 16px' : '0 64px',
                position: 'relative',
                height: '100%',
              }}
            >
              <div
                ref={mainImageFrameRef}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onMouseMove={(e) => {
                  if (!enableViewerGlare) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const relativeX = e.clientX - rect.left;
                  const relativeY = e.clientY - rect.top;
                  const percentX = Math.max(0, Math.min(100, (relativeX / rect.width) * 100));
                  const percentY = Math.max(0, Math.min(100, (relativeY / rect.height) * 100));
                  setViewerGlare({ x: percentX, y: percentY, active: true });
                }}
                onMouseEnter={() => {
                  if (!enableViewerGlare) return;
                  setViewerGlare((prev) => ({ ...prev, active: true }));
                }}
                onMouseLeave={() => {
                  if (!enableViewerGlare) return;
                  setViewerGlare((prev) => ({ ...prev, active: false }));
                }}
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: isMobile ? 'calc(100vw - 32px)' : '100%',
                  aspectRatio: isMobile ? '4 / 5' : '16 / 9',
                  maxHeight: isMobile ? 'calc(100dvh - 190px)' : undefined,
                  overflow: 'hidden',
                  borderRadius: 16,
                  background: 'transparent',
                }}
              >
                <motion.div
                  layout
                  layoutId={centerLayoutId}
                  transition={slotTransition}
                  initial={shouldReduceMotion ? false : {
                    scale: 0.94,
                    x: navDirection === 1 ? -18 : 18,
                  }}
                  animate={{ scale: 1, x: 0 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '16px',
                    overflow: 'hidden',
                    transformOrigin: 'center',
                    boxShadow: centerCardShadow,
                    scale: 1,
                  }}
                >
                  <img
                    src={images[currentIndex]}
                    alt={`Photo ${currentIndex + 1} of ${images.length}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: isMobile ? 'contain' : 'cover',
                      objectPosition: 'center',
                    }}
                  />
                  <SpotlightOverlay enabled={enableSpotlight} />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      opacity: enableViewerGlare && viewerGlare.active ? 0.52 : 0,
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
                    transition={slotTransition}
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
            </div>

            {/* Right strip */}
            {!isMobile && (
              <div
                style={{
                  flex: '0 0 8%',
                  height: '68%',
                  minHeight: 120,
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '16px 0 0 16px',
                  background: 'transparent',
                }}
              >
                {hasMultiple && effectiveRightIndex != null && (
                  <>
                    <motion.div
                      layout
                      layoutId={`photo-viewer-image-${effectiveRightIndex}`}
                      transition={slotTransition}
                      initial={shouldReduceMotion ? false : { opacity: 0.9, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '16px 0 0 16px',
                        overflow: 'hidden',
                        transformOrigin: 'center',
                        boxShadow: 'none',
                      }}
                    >
                      <img
                        src={images[effectiveRightIndex]}
                        alt=""
                        aria-hidden
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'left center',
                          filter: 'brightness(0.9) saturate(1.05) blur(1.6px)',
                          transform: 'scale(1.03)',
                        }}
                      />
                      <motion.div
                        key={`right-overlay-${effectiveRightIndex}`}
                        initial={shouldReduceMotion ? false : { opacity: navDirection === -1 ? 0.18 : 1 }}
                        transition={slotTransition}
                        animate={{ opacity: 1 }}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'rgba(0, 0, 0, 0.28)',
                          pointerEvents: 'none',
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(225deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 35%)',
                          mixBlendMode: 'screen',
                          pointerEvents: 'none',
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(270deg, rgba(0,0,0,0.34) 0%, rgba(0,0,0,0) 55%)',
                          pointerEvents: 'none',
                        }}
                      />
                    </motion.div>
                  </>
                )}
              </div>
            )}
          </div>
        </LayoutGroup>

        {/* Navigation Arrows - black background, white icon (over side panels) */}
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
