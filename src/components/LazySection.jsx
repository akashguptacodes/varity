"use client";

import { useInView } from "react-intersection-observer";

export default function LazySection({ children, minHeight = "100vh" }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: "200px 0px", // Preload a bit before it comes into view
  });

  return (
    <div ref={ref} style={{ minHeight: inView ? "auto" : minHeight }}>
      {inView ? children : null}
    </div>
  );
}
