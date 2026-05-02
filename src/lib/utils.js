// Base textures to cycle through
const baseTextures = [
  "/images/orbit-12.jpg",
  "/images/orbit-14.jpg",
  "/images/orbit-10.jpg",
  "/images/orbit-11.jpg",
  "/images/orbit-13.jpg",
  "/images/orbit-2.jpg",
  "/images/orbit-gd-1.jpg",
  "/images/orbit-gd-2.jpg",
  "/images/orbit-gd-4.jpg",
  "/images/orbit-gd-5.jpg",
  "/images/orbit-gd-6.jpg",
  "/images/orbit-gd-7.jpg",
  "/images/orbit-gd-8.jpg",
  "/images/orbit-gd-9.jpg",
  "/images/orbit-gd-10.jpg",
  "/images/orbit-gd-11.jpg",
  "/images/orbit-gd-12.jpg",
  "/images/orbit-gd-13.jpg",
  "/images/orbit-gd-14.jpg",
  "/images/orbit-gd-15.jpg",
  "/images/orbit-gd-16.jpg",
  "/images/orbit-gd-17.jpg",
  "/images/orbit-gd-18.jpg",
  "/images/orbit-gd-19.jpg",
  "/images/orbit-gd-20.jpg",
  "/images/orbit-gd-21.jpg",
  "/images/orbit-gd-22.jpg",
  "/images/orbit-gd-23.jpg",
  "/images/orbit-gd-24.jpg",
  "/images/orbit-gd-25.jpg",
  "/images/orbit-gd-26.jpg",
  "/images/orbit-gd-27.jpg",
  "/images/orbit-gd-28.jpg",
  "/images/orbit-gd-29.jpg",
  "/images/orbit-gd-30.jpg",
  "/images/orbit-gd-31.jpg",
  "/images/orbit-gd-32.jpg",
  "/images/orbit-gd-33.jpg",
  "/images/orbit-gd-34.jpg"
];

// Generate cards arranged on clean circular rings like Cosmos
// Cards orbit in a flat plane, upright, with no self-rotation.
export const CARD_DATA = Array.from({ length: 44 }).map((_, i) => {
  let radius, scale, angleOffset, speed, zOffset, tilt;

  // Group into 4 strictly defined circular rings with NO random jitter in radius
  if (i < 8) {
    // Ring 1 (Inner) — closest to centre text
    radius = 5.5;
    scale = 1.05;
    angleOffset = (i / 8) * Math.PI * 2;
    speed = 0.22;
    zOffset = 0;
  } else if (i < 20) {
    // Ring 2
    radius = 9.5;
    scale = 1.35;
    angleOffset = ((i - 8) / 12) * Math.PI * 2;
    speed = 0.15;
    zOffset = -0.5;
  } else if (i < 32) {
    // Ring 3
    radius = 14.0;
    scale = 1.75;
    angleOffset = ((i - 20) / 12) * Math.PI * 2;
    speed = 0.10;
    zOffset = -1.0;
  } else {
    // Ring 4 (Outer)
    radius = 19.0;
    scale = 2.15;
    angleOffset = ((i - 32) / 12) * Math.PI * 2;
    speed = 0.06;
    zOffset = -1.5;
  }

  // Cosmos-style tilt: slight static lean based on angular position
  // Cards tilt gently away from centre — like stickers pinned to a board
  tilt = Math.sin(angleOffset) * 0.15;

  const texture = baseTextures[i % baseTextures.length];

  return {
    id: i + 1,
    texture,
    radius,
    angleOffset,
    speed,
    scale,
    tilt,
    zOffset,
  };
});

// Lerp function for smooth interpolation
export function lerp(start, end, t) {
  return start + (end - start) * t;
}

// Clamp value between min and max
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// Map a value from one range to another
export function mapRange(value, inMin, inMax, outMin, outMax) {
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}

// Ease in-out cubic
export function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Throttle function to limit execution frequency
export function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}
