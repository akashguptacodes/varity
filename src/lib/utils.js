// Base textures to cycle through
const baseTextures = [
  "/timeline.png",
  "/color-grading.png",
  "/subtitles.png",
  "/transitions.png",
  "/ai-tools.png",
  "/social-export.png",
];

// Generate exactly 40 cards arranged vividly in clear circular paths
export const CARD_DATA = Array.from({ length: 44 }).map((_, i) => {
  let radius, scale, angleOffset, speed, zOffset;

  // Group into 4 strictly defined circular rings
  if (i < 8) {
    // Ring 1 (Inner)
    radius = 5.5 + Math.random() * 0.5;
    scale = 0.9 + Math.random() * 0.2;
    angleOffset = (i / 8) * Math.PI * 2;
    speed = 0.25; // significantly faster
  } else if (i < 20) {
    // Ring 2
    radius = 9.5 + Math.random() * 0.5;
    scale = 1.2 + Math.random() * 0.3;
    angleOffset = ((i - 8) / 12) * Math.PI * 2;
    speed = 0.18;
  } else if (i < 32) {
    // Ring 3
    radius = 14.0 + Math.random() * 0.5;
    scale = 1.5 + Math.random() * 0.4;
    angleOffset = ((i - 20) / 12) * Math.PI * 2;
    speed = 0.12;
  } else {
    // Ring 4 (Outer)
    radius = 19.0 + Math.random() * 1.0;
    scale = 1.8 + Math.random() * 0.5;
    angleOffset = ((i - 32) / 12) * Math.PI * 2;
    speed = 0.08;
  }

  // Keep Z offset very tight so they don't look scattered in 3D space
  zOffset = (Math.random() - 0.5) * 1.5; 
  
  // Pure Z tilt for 2D sticker look
  const tilt = (Math.random() - 0.5) * 0.8; 
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
