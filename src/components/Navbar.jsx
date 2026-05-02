"use client";

import Link from "next/link";
import Image from "next/image";
import CalendlyButton from "./CalendlyButton";
import { usePathname } from "next/navigation";

const CATEGORIES = {
  1: 'AI Videos',
  2: 'Explainer',
  3: 'Posters',
  4: 'Talking Head'
};

export default function Navbar() {
  const pathname = usePathname();
  const isCategory = pathname?.startsWith("/categories/");
  const categoryId = isCategory ? parseInt(pathname.split("/").pop(), 10) : null;
  const categoryName = categoryId ? CATEGORIES[categoryId] : null;

  return (
    <nav className="fixed top-6 sm:top-8 left-0 right-0 z-[100] flex justify-center w-full pointer-events-none px-6 md:px-10">
      <div className="w-full max-w-[1400px] flex items-center relative">
        
        {/* LEFT SECTION - Logo & Links */}
        <div className="flex items-center gap-5 sm:gap-6">
          
          {/* Logo Circle */}
          <Link 
            href="/" 
            className="pointer-events-auto w-[52px] h-[52px] sm:w-[58px] sm:h-[58px] bg-[#fbfcfb] rounded-full flex items-center justify-center shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:scale-105 transition-transform duration-300 shrink-0 border border-white/60 overflow-hidden relative group"
            aria-label="Home"
          >
            <Image 
              src="/images/logo.jpeg" 
              alt="Varity Logo" 
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="58px"
              priority
            />
          </Link>

          {/* Nav Links Pill - Rock Solid Layout */}
          <div className="pointer-events-auto h-[50px] sm:h-[56px] bg-white rounded-full flex items-center shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
            <Link 
              href="/about" 
              className="flex items-center justify-center text-[15px] sm:text-[16px] font-medium text-[#4b5563] hover:text-[#042f22] hover:bg-gray-50/50 transition-all font-sans tracking-wide leading-none h-full w-[90px] sm:w-[110px]"
            >
              About us
            </Link>

            <div className="w-[1.5px] h-[22px] bg-gray-400 shrink-0" />
            
            <CalendlyButton 
              text="Schedule" 
              url="https://calendly.com/akashgupta7484/30min"
              inline={true}
              className="!flex !items-center !justify-center !bg-transparent !bg-none !h-full !w-[90px] sm:!w-[110px] !shadow-none !text-[15px] sm:!text-[16px] !font-medium !text-[#4b5563] hover:!text-[#042f22] hover:!bg-gray-50/50 hover:!scale-100 hover:!brightness-100 !font-sans !tracking-wide transition-all !leading-none !px-0 !m-0 !border-none !rounded-none"
            />
          </div>
          
        </div>

        {/* CENTER SECTION - Category Tag */}
        {categoryName && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto hidden sm:flex">
            <div
              className="flex items-center gap-3 rounded-full border border-[#20C997]/25 transition-all duration-300"
              style={{
                background: "linear-gradient(90deg, rgba(32,201,151,0.12) 0%, rgba(32,201,151,0.02) 100%)",
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                paddingTop: "10px",
                paddingBottom: "10px",
                paddingLeft: "20px",
                paddingRight: "20px"
              }}
            >
              <div className="w-2 h-2 rounded-full bg-[#20C997]" style={{ boxShadow: "0 0 8px rgba(32,201,151,0.6)" }} />
              <span
                className="text-[#0d9488] text-[10px] md:text-[11px] uppercase tracking-[0.25em] font-black"
                style={{ fontFamily: "var(--font-arimo), 'Helvetica Neue', Helvetica, Arial, sans-serif" }}
              >
                {categoryName}
              </span>
            </div>
          </div>
        )}

      </div>
    </nav>
  );
}
