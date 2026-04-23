export const generateSpherePositions = (count) => {
  const particlesCount = count || 15000; // Default 15k desktop, configurable for mobile
  const positions = new Float32Array(particlesCount * 3);
  const radius = 2.3;

  for (let i = 0; i < particlesCount; i++) {
    // Using spherical coordinates for more uniform distribution
    const phi = Math.acos(-1 + (2 * i) / particlesCount);
    const theta = Math.sqrt(particlesCount * Math.PI) * phi;

    positions[i * 3] = radius * Math.cos(theta) * Math.sin(phi);
    positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
    positions[i * 3 + 2] = radius * Math.cos(phi);
  }

  return { positions, particlesCount };
};