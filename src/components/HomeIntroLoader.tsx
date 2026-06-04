import { useEffect, useMemo, useRef, useState } from 'react';
import './HomeIntroLoader.css';

const BASE_ZOOM = -600;

export interface LoaderVisualTuning {
  motion: {
    idleSpeed: number;
    warpMaxSpeed: number;
    warpRamp: number;
    idleDamp: number;
    rotationLerp: number;
    zoomTarget: number;
    zoomLerp: number;
  };
  cards: {
    size: number;
    gap: number;
    radiusBoost: number;
    cornerRadius: number;
  };
  glass: {
    frontTint: string;
    backTint: string;
    frostOpacity: number;
    blur: number;
  };
  stroke: {
    width: number;
    frontAlpha: number;
    backAlpha: number;
    reflectionAlpha: number;
    reflectionCurveSpeed: number;
    reflectionSweep: number;
  };
}

export type IntroVariant =
  | 'scaleFadeStagger';

export interface IntroAnimationSettings {
  variant: IntroVariant;
  duration: number;
  stagger: number;
}

interface HomeIntroLoaderProps {
  images: string[];
  onComplete?: () => void;
  reducedMotion: boolean;
  loopOnly?: boolean;
  tuning: LoaderVisualTuning;
  intro: IntroAnimationSettings;
  spinStartDelayMs?: number;
  autoEndMs?: number;
  endFadeMs?: number;
}

export function HomeIntroLoader({
  images,
  onComplete,
  reducedMotion,
  loopOnly = false,
  tuning,
  intro,
  spinStartDelayMs = 120,
  autoEndMs = 2400,
  endFadeMs = 420,
}: HomeIntroLoaderProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const whiteOutRef = useRef<HTMLDivElement | null>(null);
  const requestRef = useRef<number | null>(null);
  const completeRef = useRef(false);
  const mountTimeRef = useRef<number | null>(null);
  const [isEnding, setIsEnding] = useState(false);

  const targetRot = useRef(0);
  const currentRot = useRef(0);
  const warpVelocity = useRef(tuning.motion.idleSpeed);
  const zoomZ = useRef(BASE_ZOOM);

  const [radius, setRadius] = useState(550);
  const [itemSize, setItemSize] = useState({ width: 264, height: 264 });

  const safeImages = useMemo(() => {
    if (images.length > 0) return images;
    return ['/images/og-preview.png'];
  }, [images]);

  const effectiveRadius = useMemo(() => {
    const requiredRadius = ((itemSize.width + tuning.cards.gap) * safeImages.length) / (2 * Math.PI);
    return Math.max(radius, requiredRadius) + tuning.cards.radiusBoost;
  }, [itemSize.width, radius, safeImages.length, tuning.cards.gap, tuning.cards.radiusBoost]);
  const introSpec = useMemo(
    () => ({
      duration: Math.max(0.2, intro.duration),
      stagger: Math.max(0, intro.stagger),
    }),
    [intro.duration, intro.stagger]
  );

  useEffect(() => {
    if (reducedMotion) {
      const timer = window.setTimeout(() => onComplete?.(), 650);
      return () => window.clearTimeout(timer);
    }
  }, [loopOnly, onComplete, reducedMotion]);

  useEffect(() => {
    if (loopOnly || !onComplete) return;
    const endTimer = window.setTimeout(() => {
      setIsEnding(true);
      window.setTimeout(onComplete, endFadeMs);
    }, autoEndMs);
    return () => window.clearTimeout(endTimer);
  }, [autoEndMs, endFadeMs, loopOnly, onComplete]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setRadius(340);
        const size = Math.round(tuning.cards.size * 0.62);
        setItemSize({ width: size, height: size });
      } else if (window.innerWidth < 1024) {
        setRadius(440);
        const size = Math.round(tuning.cards.size * 0.79);
        setItemSize({ width: size, height: size });
      } else {
        setRadius(550);
        setItemSize({ width: tuning.cards.size, height: tuning.cards.size });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [tuning.cards.size]);

  useEffect(() => {
    if (reducedMotion) return;
    mountTimeRef.current = performance.now();

    const animate = () => {
      const elapsedMs = mountTimeRef.current ? performance.now() - mountTimeRef.current : 0;
      const rotationLockMs =
        introSpec.duration * 1000 + introSpec.stagger * (safeImages.length - 1) * 1000 + spinStartDelayMs;
      const canRotate = elapsedMs >= rotationLockMs;

      // Base-only mode:
      // Keep the carousel in its normal, controllable state (no warp acceleration, no zoom slam).
      warpVelocity.current += (tuning.motion.idleSpeed - warpVelocity.current) * tuning.motion.idleDamp;
      zoomZ.current += (BASE_ZOOM - zoomZ.current) * 0.03;

      // Warp phase intentionally disabled for now while we tune the base motion.
      // if (isWarping.current) {
      //   warpVelocity.current += (tuning.motion.warpMaxSpeed - warpVelocity.current) * tuning.motion.warpRamp;
      //   zoomZ.current += (tuning.motion.zoomTarget - zoomZ.current) * tuning.motion.zoomLerp;
      // }

      if (canRotate) {
        targetRot.current -= warpVelocity.current;
      }
      currentRot.current += (targetRot.current - currentRot.current) * tuning.motion.rotationLerp;

      if (carouselRef.current) {
        carouselRef.current.style.transform = `translateZ(${zoomZ.current}px) rotateX(-5deg) rotateY(${currentRot.current}deg)`;
      }

      if (containerRef.current) {
        const blurAmount = Math.max(0, (warpVelocity.current - tuning.motion.idleSpeed) * tuning.glass.blur);
        containerRef.current.style.setProperty('--warp-blur', `${blurAmount}px`);
      }

      if (whiteOutRef.current) {
        const opacity = Math.max(0, Math.min(1, (zoomZ.current - 350) / 300));
        whiteOutRef.current.style.opacity = loopOnly ? '0' : String(opacity);

        if (!loopOnly && !completeRef.current && opacity >= 0.99) {
          completeRef.current = true;
          window.setTimeout(() => onComplete?.(), 180);
        }
      }

      requestRef.current = window.requestAnimationFrame(animate);
    };

    requestRef.current = window.requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) window.cancelAnimationFrame(requestRef.current);
    };
  }, [intro.variant, introSpec.duration, introSpec.stagger, loopOnly, onComplete, reducedMotion, safeImages.length, spinStartDelayMs, tuning]);

  return (
    <div
      ref={containerRef}
      className="home-intro-loader"
      style={{
        perspective: '1200px',
        opacity: isEnding ? 0 : 1,
        transition: `opacity ${endFadeMs}ms cubic-bezier(0.22, 1, 0.36, 1)`,
      }}
      aria-label="Loading home listings"
      role="status"
    >
      <div ref={whiteOutRef} className="home-intro-loader__whiteout" style={{ opacity: 0 }} />
      <div className="home-intro-loader__vignette" />

      <div
        ref={carouselRef}
        className="home-intro-loader__carousel"
        style={{
          width: itemSize.width,
          height: itemSize.height,
        }}
      >
        {safeImages.map((src, i) => {
          const angle = i * (360 / safeImages.length);
          const introDelay = i * introSpec.stagger;
          return (
            <div
              key={`${src}-${i}`}
              className="home-intro-loader__card-slot"
              style={{
                transform: `rotateY(${angle}deg) translateZ(${effectiveRadius}px)`,
              }}
            >
              <div
                className="home-intro-loader__card-anim"
                style={{
                  animationName: 'loaderIntroScaleFadeStagger',
                  animationDuration: `${introSpec.duration}s`,
                  animationDelay: `${introDelay}s`,
                  animationTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                  animationFillMode: 'both',
                }}
              >
                <div
                  className="home-intro-loader__card-front"
                  style={{
                    borderWidth: tuning.stroke.width,
                    borderColor: `rgba(0, 0, 0, ${tuning.stroke.frontAlpha})`,
                    borderRadius: tuning.cards.cornerRadius,
                    background: tuning.glass.frontTint,
                  }}
                >
                  <img src={src} alt={`Listing ${i + 1}`} className="home-intro-loader__image" draggable={false} />
                  <div className="home-intro-loader__gloss" />
                </div>

                <div
                  className="home-intro-loader__card-back"
                  style={{
                    borderWidth: tuning.stroke.width,
                    borderColor: `rgba(255, 255, 255, ${tuning.stroke.backAlpha})`,
                    borderRadius: tuning.cards.cornerRadius,
                    background: tuning.glass.backTint,
                  }}
                >
                  <img
                    src={src}
                    alt=""
                    className="home-intro-loader__image home-intro-loader__image--back"
                    draggable={false}
                  />
                  <div className="home-intro-loader__frost" style={{ opacity: tuning.glass.frostOpacity }} />
                  <div
                    className="home-intro-loader__reflection"
                    style={{
                      opacity: tuning.stroke.reflectionAlpha,
                      animationDuration: `${tuning.stroke.reflectionCurveSpeed}s`,
                      backgroundSize: `${tuning.stroke.reflectionSweep}% 100%`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
