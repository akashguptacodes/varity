"use client";

import React from "react";
import {
  FrndLogo,
  PocketFMLogo,
  KillitOnlineLogo,
  KnowledgeCityLogo,
  UpGradLogo,
  SyncAILogo,
  MagneticAILogo,
  AdvancedAgentLogo,
  StudioVerseLogo,
} from "./BrandLogos";

const brands = [
  { name: "FRND", Component: FrndLogo },
  { name: "Pocket FM", Component: PocketFMLogo },
  { name: "KillitOnline", Component: KillitOnlineLogo },
  { name: "Knowledge City", Component: KnowledgeCityLogo },
  { name: "upGrad", Component: UpGradLogo },
  { name: "Sync.ai", Component: SyncAILogo },
  { name: "Magnetic.ai", Component: MagneticAILogo },
  { name: "Advanced Agent Marketing", Component: AdvancedAgentLogo },
  { name: "Studio Verse", Component: StudioVerseLogo },
];

export default function BrandsMarquee() {
  return (
    <section className="relative w-full py-16 sm:py-20 overflow-hidden bg-[#fbfcfb]">
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0d7c66]/[0.02] to-transparent pointer-events-none" />

      <div className="relative z-10 w-full flex flex-col items-center justify-center mb-12 px-4 text-center mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight text-center">
          Trusted By <span className="text-gradient">Leading Brands</span>
        </h2>
        <p className="mt-4 text-gray-500 text-sm sm:text-base max-w-2xl text-center font-medium mx-auto">
          Collaborating with visionary companies to deliver high-impact digital experiences.
        </p>
      </div>

      <div className="relative flex overflow-hidden w-full group">
        {/* Left Fade */}
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-[#fbfcfb] to-transparent z-10 pointer-events-none" />

        {/* Marquee Track */}
        <div className="flex w-max animate-marquee">
          {/* Double the array for seamless infinite scroll */}
          <div className="flex w-max items-center justify-around gap-12 sm:gap-16 lg:gap-24 pr-12 sm:pr-16 lg:pr-24 group-hover:[animation-play-state:paused]">
            {brands.map((brand, idx) => {
              const BrandComponent = brand.Component;
              return (
                <div
                  key={`${brand.name}-1-${idx}`}
                  className="flex items-center justify-center shrink-0"
                >
                  <div className="relative h-12 sm:h-14 lg:h-16 flex items-center text-gray-800 transition-all duration-500 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:scale-110 cursor-pointer">
                    <BrandComponent className="h-full w-auto max-w-[250px] object-contain" />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex w-max items-center justify-around gap-12 sm:gap-16 lg:gap-24 pr-12 sm:pr-16 lg:pr-24 group-hover:[animation-play-state:paused]" aria-hidden="true">
            {brands.map((brand, idx) => {
              const BrandComponent = brand.Component;
              return (
                <div
                  key={`${brand.name}-2-${idx}`}
                  className="flex items-center justify-center shrink-0"
                >
                  <div className="relative h-12 sm:h-14 lg:h-16 flex items-center text-gray-800 transition-all duration-500 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:scale-110 cursor-pointer">
                    <BrandComponent className="h-full w-auto max-w-[250px] object-contain" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>


        {/* Right Fade */}
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-[#fbfcfb] to-transparent z-10 pointer-events-none" />
      </div>
    </section>
  );
}
