"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook for device detection and responsive breakpoints.
 * Uses window.innerWidth to classify the device and provides
 * performance-related flags for conditional rendering.
 *
 * Breakpoints:
 *   mobile:  < 768px
 *   tablet:  768px – 1023px
 *   desktop: >= 1024px
 */
export default function useDeviceDetect() {
  const [device, setDevice] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
    dpr: typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1,
    prefersReducedMotion: false,
    isTouchDevice: false,
  });

  const update = useCallback(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const touch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

    setDevice({
      isMobile: w < 768,
      isTablet: w >= 768 && w < 1024,
      isDesktop: w >= 1024,
      width: w,
      height: h,
      dpr,
      prefersReducedMotion: mq.matches,
      isTouchDevice: touch,
    });
  }, []);

  useEffect(() => {
    // Initial measurement
    update();

    // Debounced resize handler (100ms)
    let timeout;
    const onResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(update, 100);
    };

    window.addEventListener("resize", onResize, { passive: true });

    // Listen for reduced motion preference changes
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", update);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", onResize);
      mq.removeEventListener("change", update);
    };
  }, [update]);

  return device;
}
