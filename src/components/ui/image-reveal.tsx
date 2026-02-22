'use client';

import React, { useEffect, useRef, useState } from 'react';

type ResponsiveValues = {
  MAX_RADIUS: number;
  MIN_RADIUS: number;
  SOFT_EDGE: number;
  LERP_SPEED: number;
  RADIUS_LERP_SPEED: number;
};

type SpotlightOverlayProps = {
  enabled?: boolean;
  className?: string;
};

// Responsive values based on viewport size
const getResponsiveValues = (): ResponsiveValues => {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1024;

  let baseRadius: number;

  if (width < 768) {
    baseRadius = 70 + (width / 768) * 30;
  } else if (width < 1440) {
    baseRadius = 80 + ((width - 768) / (1440 - 768)) * 20;
  } else {
    baseRadius = 110 + ((Math.min(width, 2560) - 1440) / (2560 - 1440)) * 30;
  }

  const multiplier = baseRadius / 100;

  return {
    MAX_RADIUS: Math.round(baseRadius),
    MIN_RADIUS: 0,
    SOFT_EDGE: Math.round(60 * multiplier),
    LERP_SPEED: 0.18,
    RADIUS_LERP_SPEED: 0.13,
  };
};

export const SpotlightOverlay = ({ enabled = true, className }: SpotlightOverlayProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [lerpedPos, setLerpedPos] = useState<{ x: number; y: number } | null>(null);
  const [hovered, setHovered] = useState(false);
  const [radius, setRadius] = useState(0);
  const [targetRadius, setTargetRadius] = useState(0);
  const [values, setValues] = useState(getResponsiveValues());
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setHovered(false);
      setMousePos(null);
      setLerpedPos(null);
      setRadius(0);
      setTargetRadius(0);
    }
  }, [enabled]);

  // Detect touch devices and update responsive values on resize
  useEffect(() => {
    const handleResize = () => {
      setValues(getResponsiveValues());
    };

    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lerp the displayed position for smooth movement
  useEffect(() => {
    if (!enabled || !hovered || !mousePos || isTouchDevice) {
      setLerpedPos(null);
      return;
    }

    let frame = 0;
    const animate = () => {
      setLerpedPos((prev) => {
        if (!prev) return mousePos;
        const dx = mousePos.x - prev.x;
        const dy = mousePos.y - prev.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 0.5) return mousePos;
        return {
          x: prev.x + dx * values.LERP_SPEED,
          y: prev.y + dy * values.LERP_SPEED,
        };
      });
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [enabled, hovered, isTouchDevice, mousePos, values.LERP_SPEED]);

  // Animate the radius for enter/exit
  useEffect(() => {
    setTargetRadius(enabled && hovered ? values.MAX_RADIUS : values.MIN_RADIUS);
  }, [enabled, hovered, values.MAX_RADIUS, values.MIN_RADIUS]);

  useEffect(() => {
    let frame = 0;
    const animateRadius = () => {
      setRadius((prev) => {
        if (Math.abs(prev - targetRadius) < 1) return targetRadius;
        return prev + (targetRadius - prev) * values.RADIUS_LERP_SPEED;
      });
      frame = requestAnimationFrame(animateRadius);
    };

    frame = requestAnimationFrame(animateRadius);
    return () => cancelAnimationFrame(frame);
  }, [targetRadius, values.RADIUS_LERP_SPEED]);

  const updatePosition = (clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    setMousePos({ x, y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!enabled || isTouchDevice) return;
    updatePosition(e.clientX, e.clientY);
  };

  // For touch devices, handle touch move
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!enabled || !e.touches[0]) return;
    updatePosition(e.touches[0].clientX, e.touches[0].clientY);
    const touch = e.touches[0];
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setLerpedPos({ x: touch.clientX - rect.left, y: touch.clientY - rect.top });
    setHovered(true);
  };

  const handleMouseEnter = () => {
    if (!enabled || isTouchDevice) return;
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setMousePos(null);
    setLerpedPos(null);
  };

  const handleTouchStart = handleTouchMove;
  const handleTouchEnd = handleMouseLeave;

  const maskStyle =
    lerpedPos && radius > 0
      ? {
          WebkitMaskImage: `radial-gradient(circle ${radius}px at ${lerpedPos.x}px ${lerpedPos.y}px,
                                transparent 0 ${(radius - values.SOFT_EDGE - 20)}px,
                                rgba(0,0,0,0.10) ${(radius - values.SOFT_EDGE)}px,
                                rgba(0,0,0,0.25) ${(radius - values.SOFT_EDGE / 1.5)}px,
                                rgba(0,0,0,0.45) ${(radius - values.SOFT_EDGE / 2)}px,
                                rgba(0,0,0,0.75) ${radius}px,
                                black 100%)`,
          maskImage: `radial-gradient(circle ${radius}px at ${lerpedPos.x}px ${lerpedPos.y}px,
                                transparent 0 ${(radius - values.SOFT_EDGE - 20)}px,
                                rgba(0,0,0,0.10) ${(radius - values.SOFT_EDGE)}px,
                                rgba(0,0,0,0.25) ${(radius - values.SOFT_EDGE / 1.5)}px,
                                rgba(0,0,0,0.45) ${(radius - values.SOFT_EDGE / 2)}px,
                                rgba(0,0,0,0.75) ${radius}px,
                                black 100%)`,
          transition: 'WebkitMaskImage 0.3s, maskImage 0.3s, opacity 0.3s',
          opacity: 1,
        }
      : {
          WebkitMaskImage: 'none',
          maskImage: 'none',
          opacity: 1,
          transition: 'WebkitMaskImage 0.3s, maskImage 0.3s, opacity 0.3s',
        };

  const overlayOpacity = hovered && lerpedPos && radius > 0 ? 'opacity-90' : 'opacity-100';

  if (!enabled) return null;

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 ${className ?? ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={`absolute top-0 left-0 h-full w-full rounded-xl bg-black/40 backdrop-blur-[6px] transition-all duration-300 ${overlayOpacity}`}
        style={maskStyle}
      />
      {lerpedPos && radius > 0 && (
        <div
          className="pointer-events-none absolute top-0 left-0 h-full w-full"
          style={{
            background: `radial-gradient(circle ${radius + 30}px at ${lerpedPos.x}px ${lerpedPos.y}px, rgba(255,255,255,0.13) 0, rgba(255,255,255,0.07) 60%, transparent 100%)`,
            mixBlendMode: 'screen',
            transition: 'background 0.3s',
          }}
        />
      )}
    </div>
  );
};

export const ImageHover = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-black">
      <div className="container relative aspect-video w-[90%] max-w-4xl overflow-hidden rounded-xl border-[0.5px] border-neutral-700 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] md:w-2/3 lg:w-2/3">
        <img
          src="https://images.unsplash.com/photo-1638551145269-f7925c37e672?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Beach Marine"
          className="absolute h-full w-full rounded-xl object-cover"
        />
        <SpotlightOverlay />
      </div>
    </div>
  );
};
