import { useEffect, useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { LayoutGroup, motion, useReducedMotion } from 'framer-motion';

export interface CarouselSlide {
  src: string;
  alt: string;
  layoutId: string;
}

interface CarouselProps {
  slides: CarouselSlide[];
  initialIndex?: number;
  isCompact?: boolean;
  onIndexChange?: (index: number) => void;
  onCenterClick?: (index: number, layoutId: string) => void;
  onShowAllClick?: () => void;
}

const TRANSITION = {
  type: 'spring' as const,
  stiffness: 320,
  damping: 32,
  mass: 0.85,
};

export function Carousel({
  slides,
  initialIndex = 0,
  isCompact = false,
  onIndexChange,
  onCenterClick,
  onShowAllClick,
}: CarouselProps) {
  const shouldReduceMotion = useReducedMotion();
  const [current, setCurrent] = useState(initialIndex);

  useEffect(() => {
    setCurrent(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    onIndexChange?.(current);
  }, [current, onIndexChange]);

  const count = slides.length;

  const safeCurrent = useMemo(() => {
    if (count === 0) return 0;
    return ((current % count) + count) % count;
  }, [count, current]);

  const prevIndex = count > 0 ? (safeCurrent - 1 + count) % count : 0;
  const nextIndex = count > 0 ? (safeCurrent + 1) % count : 0;

  if (count === 0) return null;

  const goPrevious = () => setCurrent((value) => (value - 1 + count) % count);
  const goNext = () => setCurrent((value) => (value + 1) % count);

  const motionTransition = shouldReduceMotion ? { duration: 0 } : TRANSITION;

  const stripBasis = isCompact ? '0%' : '14%';
  const centerBasis = isCompact ? '100%' : '72%';
  const sideVisible = !isCompact && count > 1;
  const sideImageObjectScale = 1.08;

  return (
    <div className="relative overflow-hidden rounded-2xl" style={{ height: isCompact ? 300 : 420 }}>
      <LayoutGroup id="listing-hero-fluid-carousel">
        <div className="flex h-full items-center">
          <div
            className="relative h-[70%] overflow-hidden rounded-r-2xl"
            style={{ flex: `0 0 ${stripBasis}` }}
            aria-hidden
          >
            {sideVisible && (
              <motion.div
                layout
                layoutId={slides[prevIndex].layoutId}
                transition={motionTransition}
                className="absolute inset-0 overflow-hidden rounded-r-2xl"
              >
                <img
                  src={slides[prevIndex].src}
                  alt=""
                  className="h-full w-full object-cover"
                  style={{
                    objectPosition: 'right center',
                    transform: `scale(${sideImageObjectScale})`,
                    filter: 'brightness(0.86) saturate(1.05) blur(1px)',
                  }}
                />
                <div className="pointer-events-none absolute inset-0 bg-black/35" />
              </motion.div>
            )}
          </div>

          <div className="relative flex h-full items-center justify-center px-0 md:px-8" style={{ flex: `1 1 ${centerBasis}` }}>
            <button
              type="button"
              onClick={() => onCenterClick?.(safeCurrent, slides[safeCurrent].layoutId)}
              className="relative h-full w-full cursor-pointer overflow-hidden rounded-2xl border-0 bg-transparent p-0"
              aria-label="Open current photo"
            >
              <motion.div
                layout
                layoutId={slides[safeCurrent].layoutId}
                transition={motionTransition}
                className="absolute inset-0 overflow-hidden rounded-2xl"
                style={{ boxShadow: '0 22px 52px rgba(15, 23, 42, 0.3)' }}
              >
                <img
                  src={slides[safeCurrent].src}
                  alt={slides[safeCurrent].alt}
                  className="h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/24 via-transparent to-black/8" />
              </motion.div>
            </button>
          </div>

          <div
            className="relative h-[70%] overflow-hidden rounded-l-2xl"
            style={{ flex: `0 0 ${stripBasis}` }}
            aria-hidden
          >
            {sideVisible && (
              <motion.div
                layout
                layoutId={slides[nextIndex].layoutId}
                transition={motionTransition}
                className="absolute inset-0 overflow-hidden rounded-l-2xl"
              >
                <img
                  src={slides[nextIndex].src}
                  alt=""
                  className="h-full w-full object-cover"
                  style={{
                    objectPosition: 'left center',
                    transform: `scale(${sideImageObjectScale})`,
                    filter: 'brightness(0.86) saturate(1.05) blur(1px)',
                  }}
                />
                <div className="pointer-events-none absolute inset-0 bg-black/35" />
              </motion.div>
            )}
          </div>
        </div>
      </LayoutGroup>

      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={goPrevious}
            className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white/90 text-slate-900 shadow-sm transition hover:bg-white"
          >
            <ArrowRight className="h-5 w-5 rotate-180" />
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={goNext}
            className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white/90 text-slate-900 shadow-sm transition hover:bg-white"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </>
      )}

      <button
        type="button"
        onClick={onShowAllClick}
        className="absolute bottom-4 right-4 z-10 rounded-lg border border-[#DDDDDD] bg-white/95 px-3.5 py-2 text-sm font-normal text-[#222] shadow-md transition hover:bg-white"
      >
        Show all photos
      </button>
    </div>
  );
}
