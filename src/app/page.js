"use client";

import dynamic from "next/dynamic";
import UIOverlay from "@/components/UIOverlay";
import LazySection from "@/components/LazySection";

// Dynamically import the 3D scene to avoid SSR issues with Three.js
const Hero3D = dynamic(() => import("@/components/Hero3D"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-[#fbfcfb] flex items-center justify-center z-0">
      <div className="w-8 h-8 rounded-full border-2 border-black/20 border-t-black animate-spin" />
    </div>
  ),
});

const CategorySection = dynamic(() => import("@/components/CategorySection"), {
  ssr: false,
});

const TestimonialsSection = dynamic(() => import("@/components/TestimonialsSection"), {
  ssr: false,
});

const FooterSection = dynamic(() => import("@/components/FooterSection"), {
  ssr: false,
});

const BookCallSection = dynamic(() => import("@/components/BookCallSection"), {
  ssr: false,
});

const CalendlyButton = dynamic(() => import("@/components/CalendlyButton"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="relative bg-[#fbfcfb]">
      <section className="relative w-full h-[100dvh] overflow-hidden">
        {/* 3D Canvas Background (Absolute behind everything) */}
        <Hero3D />

        {/* HTML Overlay (Absolute Overlay for UI elements) */}
        <UIOverlay />
      </section>

      {/* Category Section with moving fluid blob */}
      <LazySection minHeight="150vh" persist={true}>
        <CategorySection />
      </LazySection>

      {/* Spacer between Category and Testimonials */}
      <div className="w-full h-10 md:h-20 bg-transparent" />

      {/* Testimonials Section */}
      <LazySection minHeight="100vh">
        <TestimonialsSection />
      </LazySection>



      {/* Footer Section */}
      <LazySection minHeight="40vh" persist={true}>
        <FooterSection />
      </LazySection>

      {/* Floating Global Calendly Button (Always bottom-right) */}
      <CalendlyButton url="https://calendly.com/akashgupta7484/30min" />
    </main>
  );
}
