"use client";

import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative w-full bg-[#fbfcfb] overflow-hidden mt-16 sm:mt-24 md:mt-32 shadow-[0_-20px_60px_rgba(13,124,102,0.08)] rounded-t-[40px] sm:rounded-t-[60px] z-30">
      <div className="relative z-20 w-full bg-[#fbfcfb]">
        {/* Footer links bar — merged seamlessly, no border separator */}
        <div
          className="w-full flex flex-col md:flex-row items-center justify-between py-8 pt-16 sm:pt-20 md:pt-24"
          style={{ paddingLeft: 'clamp(16px, 7vw, 7vw)', paddingRight: 'clamp(16px, 7vw, 7vw)' }}
        >
          {/* Left: Social links */}
          <div className="flex items-center gap-7 md:gap-10">
            {["Instagram", "YouTube", "X", "LinkedIn"].map((name) => (
              <a
                key={name}
                href="#"
                className="text-[13px] md:text-[14px] text-[#042f22]/70 font-medium hover:text-[#042f22] transition-colors duration-300"
              >
                {name}
              </a>
            ))}
          </div>

          {/* Center: Logo */}
          <div className="my-5 md:my-0">
            <div className="w-[48px] h-[48px] rounded-full overflow-hidden cursor-pointer hover:scale-110 transition-transform shadow-md relative border border-white/60">
              <Image
                src="/images/logo.jpeg"
                alt="Verity Logo"
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
          </div>

          {/* Right: Legal links */}
          <div className="flex items-center gap-7 md:gap-10">
            {["Careers", "Terms", "Privacy"].map((name) => (
              <a
                key={name}
                href="#"
                className="text-[13px] md:text-[14px] text-[#042f22]/70 font-medium hover:text-[#042f22] transition-colors duration-300"
              >
                {name}
              </a>
            ))}
          </div>
        </div>

        {/* Brand text spanning full width — like Cosmos */}
        <div className="w-full overflow-hidden pb-6 sm:pb-10 md:pb-14" style={{ paddingLeft: '4vw', paddingRight: '4vw' }}>
          <h1
            className="text-[#042f22] text-[16vw] md:text-[14vw] font-black leading-[0.85] tracking-tighter text-center select-none uppercase"
            style={{ fontFamily: 'var(--font-logo)' }}
          >
            VERITY
          </h1>
        </div>
      </div>
    </footer>
  );
}
