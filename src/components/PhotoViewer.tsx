import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PhotoViewerProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
  layoutId?: string; // Deprecated: kept for backward compatibility, no longer used
}

export function PhotoViewer({ images, initialIndex, onClose }: PhotoViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLiked, setIsLiked] = useState(false);
  const [direction, setDirection] = useState(0); // -1 for prev, 1 for next
  const [hasNavigated, setHasNavigated] = useState(false); // Track if user has navigated away from initial image

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setHasNavigated(false); // Reset when initialIndex changes
  }, [initialIndex]);

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
  }, [currentIndex, direction]);

  const handlePrevious = () => {
    setDirection(-1);
    setHasNavigated(true); // Mark that user has navigated
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setHasNavigated(true); // Mark that user has navigated
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this photo',
        url: images[currentIndex],
      }).catch(() => {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(images[currentIndex]);
      });
    } else {
      navigator.clipboard.writeText(images[currentIndex]);
    }
  };

  if (images.length === 0) return null;

  // Fast slide transition for image navigation
  const slideTransition = {
    type: 'tween' as const,
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
  };

  // Backdrop - very quick appearance (minimal fade)
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.15,
        ease: 'easeOut' as const,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.15,
        ease: 'easeIn' as const,
      },
    },
  };

  // Slide variants for directional image transitions
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 1,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 1,
    }),
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
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
      {/* Top Bar */}
      <div
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
        {/* Close Button */}
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

        {/* Image Counter */}
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

        {/* Right Actions */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
          }}
        >
          {/* Share Button */}
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

          {/* Like Button */}
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

      {/* Main Image */}
      <div
        style={{
          position: 'relative',
          width: '60vw',
          maxWidth: '60vw',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 4vw',
          margin: '0 auto',
          boxSizing: 'border-box',
          zIndex: 9999,
          overflow: 'hidden',
        }}
      >
        <AnimatePresence
          mode="wait"
          custom={direction}
          initial={false}
        >
          <motion.img
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial={hasNavigated ? "enter" : false}
            animate="center"
            exit="exit"
            transition={slideTransition}
            src={images[currentIndex]}
            alt={`Photo ${currentIndex + 1} of ${images.length}`}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              borderRadius: '8px',
              position: 'absolute',
            }}
          />
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          {/* Previous Button */}
          <button
            onClick={handlePrevious}
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

          {/* Next Button */}
          <button
            onClick={handleNext}
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
