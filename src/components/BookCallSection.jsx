"use client";

import React from "react";
import CalendlyButton from "./CalendlyButton";

export default function BookCallSection() {
  return (
    <section className="py-20 flex flex-col items-center justify-center text-center px-6 relative z-10 bg-white">
      <h2 className="text-3xl md:text-5xl font-bold text-[#042f22] mb-4 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
        Let’s Work Together 🎥
      </h2>
      
      <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto mb-10" style={{ fontFamily: "var(--font-arimo), 'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
        Book a free consultation call to discuss your video project
      </p>
      
      {/* 
        We pass inline={true} so this button respects standard flow layout 
        rather than fixing itself to the bottom left screen corner.
      */}
      <CalendlyButton 
        url="https://calendly.com/akashgupta7484/30min" 
        inline={true} 
      />
    </section>
  );
}
