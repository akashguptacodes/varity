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
      <section className="relative w-full h-[100dvh] overflow-hidden shadow-[0_20px_60px_rgba(13,124,102,0.08)] rounded-b-[40px] sm:rounded-b-[60px] z-10">
        {/* 3D Canvas Background (Absolute behind everything) */}
        <Hero3D />

        {/* HTML Overlay (Absolute Overlay for UI elements) */}
        <UIOverlay />
      </section>

      {/* Minimal transition spacer - merged sections */}
      <div className="w-full h-2 md:h-3 bg-[#fbfcfb]" />

      {/* Category Section with moving fluid blob */}
      <LazySection minHeight="300vh" persist={true}>
        <CategorySection />
      </LazySection>

      {/* Spacer between Category and Testimonials */}
      <div className="w-full h-16 sm:h-20 md:h-24 lg:h-32 bg-[#fbfcfb]" />

      {/* Testimonials Section */}
      <LazySection minHeight="100vh">
        <TestimonialsSection />
      </LazySection>



      {/* Footer Section */}
      <LazySection minHeight="40vh" persist={true}>
        <FooterSection />
      </LazySection>

      {/* Floating Global Calendly Button (Always bottom-right) */}
      <CalendlyButton
        url="https://calendly.com/akashgupta7484/30min"
        text={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        }
        className="!w-[60px] !h-[60px] !p-0 flex items-center justify-center !rounded-full !shadow-[0_8px_30px_rgba(32,201,151,0.4)] hover:!scale-110 transition-transform duration-300 z-[9999]"
      />
    </main>
  );
}
