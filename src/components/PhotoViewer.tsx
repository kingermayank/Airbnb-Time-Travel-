import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, LayoutGroup, useReducedMotion } from 'framer-motion';

interface PhotoViewerProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
  layoutId?: string; // Deprecated: kept for backward compatibility, no longer used
}

// Slower, gentler ease-out so motion feels fluid and not abrupt
const CAROUSEL_TRANSITION = {
  type: 'tween' as const,
  duration: 0.72,
  ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
};

export function PhotoViewer({ images, initialIndex, onClose }: PhotoViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLiked, setIsLiked] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const mainImageFrameRef = useRef<HTMLDivElement>(null);

  const n = images.length;
  const prevIndex = n > 1 ? (currentIndex - 1 + n) % n : 0;
  const nextIndex = n > 1 ? (currentIndex + 1) % n : 0;
  const hasMultiple = n > 1;
  const effectiveRightIndex = n === 2 ? null : nextIndex;
  const slotTransition = shouldReduceMotion ? { duration: 0 } : CAROUSEL_TRANSITION;
  const centerCardShadow = '0 20px 60px rgba(0, 0, 0, 0.4)';

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : n - 1));
  }, [n]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < n - 1 ? prev + 1 : 0));
  }, [n]);

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

  if (images.length === 0) return null;

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

  return (
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
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            zIndex: 10000,
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '14px',
              fontFamily: '"Figtree", sans-serif',
              fontWeight: 500,
              cursor: 'pointer',
              padding: '8px 12px',
              borderRadius: '8px',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            X Close
          </button>

          <div
            style={{
              color: 'white',
              fontSize: '14px',
              fontFamily: '"Figtree", sans-serif',
              fontWeight: 500,
            }}
          >
            {currentIndex + 1} / {images.length}
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button
              onClick={handleShare}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
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
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <path d="M12 8v8M8 12h8" />
              </svg>
            </button>

            <button
              onClick={() => setIsLiked(!isLiked)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill={isLiked ? '#FF385C' : 'none'}
                stroke={isLiked ? '#FF385C' : 'white'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
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
              padding: '80px 0 60px',
              boxSizing: 'border-box',
              zIndex: 9999,
              overflow: 'hidden',
              maxHeight: '85vh',
            }}
          >
            {/* Left strip */}
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
                        filter: 'brightness(0.92)',
                      }}
                    />
                    <motion.div
                      transition={slotTransition}
                      animate={{ opacity: 1 }}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.28)',
                        pointerEvents: 'none',
                      }}
                    />
                  </motion.div>
                </>
              )}
            </div>

            {/* Center slot */}
            <div
              style={{
                flex: '1 1 84%',
                minWidth: 0,
                alignSelf: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 64px',
                position: 'relative',
                height: '100%',
              }}
            >
              <div
                ref={mainImageFrameRef}
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '100%',
                  aspectRatio: '16 / 9',
                  overflow: 'hidden',
                  borderRadius: 16,
                  background: 'transparent',
                }}
              >
                <motion.div
                  layout
                  layoutId={`photo-viewer-image-${currentIndex}`}
                  transition={slotTransition}
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
                    objectFit: 'cover',
                    objectPosition: 'center',
                  }}
                />
                  <motion.div
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
                        filter: 'brightness(0.92)',
                      }}
                    />
                    <motion.div
                      transition={slotTransition}
                      animate={{ opacity: 1 }}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.28)',
                        pointerEvents: 'none',
                      }}
                    />
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </LayoutGroup>

        {/* Navigation Arrows - black background, white icon (over side panels) */}
        {hasMultiple && (
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
      </motion.div>
    </AnimatePresence>
  );
}
