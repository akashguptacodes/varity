"use client";

const FooterSection = () => {
  const currentYear = new Date().getFullYear();

  const columns = [
    {
      title: "Platform",
      links: [
        { label: "Extended Warranty" },
        { label: "Registration" },
        { label: "Resolution" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", external: true },
        { label: "Blog" },
        { label: "Partnerships" },
        { label: "Referral Program", external: true },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About" },
        { label: "Careers" },
        { label: "Support", external: true },
        { label: "Book a Demo" },
      ],
    },
    {
      title: "Product",
      links: [
        { label: "Merchant Login", external: true },
        { label: "Customer Login", external: true },
        { label: "System Status", external: true },
      ],
    },
    {
      title: "Social",
      links: [
        { label: "LinkedIn", external: true },
        { label: "Facebook", external: true },
        { label: "Twitter", external: true },
        { label: "Instagram", external: true },
      ],
    },
  ];

  const ArrowIcon = () => (
    <svg className="w-3.5 h-3.5 ml-1.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="7" y1="17" x2="17" y2="7"></line>
      <polyline points="7 7 17 7 17 17"></polyline>
    </svg>
  );

  return (
    <div className="w-full bg-[#fbfcfb] -mt-1 pt-1">
      <footer className="relative w-full bg-[#fbfcfb] rounded-t-[48px] overflow-hidden shadow-[0_-10px_40px_rgba(16,185,129,0.1)] border-t border-[#34d399]/30">
      
      {/* 
        Raw CSS Keyframes:
        Robust sweeping animations for distinct fog balls so the movement is undeniable 
        without Framer Motion hydration constraints.
      */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fog-drift-1 {
          0% { transform: translate(0vw, 0px) scale(1); }
          50% { transform: translate(45vw, 100px) scale(1.4); }
          100% { transform: translate(0vw, 0px) scale(1); }
        }
        @keyframes fog-drift-2 {
          0% { transform: translate(0vw, 0px) scale(1.2); }
          50% { transform: translate(-45vw, -100px) scale(0.8); }
          100% { transform: translate(0vw, 0px) scale(1.2); }
        }
        @keyframes fog-drift-3 {
          0% { transform: translate(0vw, 0px) scale(0.9); }
          50% { transform: translate(25vw, -80px) scale(1.5); }
          100% { transform: translate(0vw, 0px) scale(0.9); }
        }
      `}} />

      {/* Fog Background Container */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        
        {/* Beautiful Dynamic Fog Ball 1 - Deep Emerald */}
        <div 
          className="absolute rounded-full mix-blend-normal pointer-events-none"
          style={{
            backgroundColor: "#059669", /* Deeper, punchier green */
            width: "450px",
            height: "450px",
            left: "-5%",
            top: "5%",
            filter: "blur(70px)",       /* Tighter blur for more density/highlight */
            WebkitFilter: "blur(70px)",
            opacity: 0.95,              /* High opacity */
            animation: "fog-drift-1 12s infinite ease-in-out"
          }}
        />
        
        {/* Beautiful Dynamic Fog Ball 2 - Fluent Mint/Teal */}
        <div 
          className="absolute rounded-full mix-blend-normal pointer-events-none"
          style={{
            backgroundColor: "#10b981", /* More vivid emerald */
            width: "400px",
            height: "400px",
            right: "-5%",
            bottom: "0%",
            filter: "blur(70px)",
            WebkitFilter: "blur(70px)",
            opacity: 0.85,
            animation: "fog-drift-2 15s infinite ease-in-out"
          }}
        />
        
        {/* Subtle Highlight Fog Ball - Very Light Lime/Green */}
        <div 
          className="absolute rounded-full mix-blend-normal pointer-events-none"
          style={{
            backgroundColor: "#a3e635", /* Vibrant lime highlight */
            width: "300px",
            height: "300px",
            left: "35%",
            top: "20%",
            filter: "blur(60px)",
            WebkitFilter: "blur(60px)",
            opacity: 0.95,
            animation: "fog-drift-3 10s infinite ease-in-out"
          }}
        />
      </div>

      {/* Main Content Overlay: Guaranteed strict padding using viewport units (vw) to prevent any edge clipping */}
      <div 
        className="relative z-10 w-full flex flex-col justify-between min-h-[450px]"
        style={{ 
          paddingTop: '120px', 
          paddingBottom: '60px',
          paddingLeft: '7vw',
          paddingRight: '7vw',
        }}
      >
        
        {/* Top Section: Link Columns and Logo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 w-full">
          
          {/* Columns Container: Perfectly distributed internally */}
          <div className="lg:col-span-11 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-8 gap-y-12 w-full cursor-default">
            {columns.map((col, idx) => (
              <div key={idx} className="flex flex-col gap-6">
                <h4 className="text-[10.5px] font-bold text-[#042f22]/50 tracking-[0.15em] uppercase">
                  {col.title}
                </h4>
                <ul className="flex flex-col gap-4">
                  {col.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <a 
                        href="#" 
                        className="group flex items-center text-[14px] font-bold text-[#042f22] hover:text-[#0d7c66] transition-colors duration-300 w-fit"
                      >
                        <span className="relative pb-0.5">
                          {link.label}
                          <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#0d7c66] transition-all duration-300 group-hover:w-full"></span>
                        </span>
                        {link.external && <ArrowIcon />}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Large Corner Logo Badge */}
          <div className="lg:col-span-1 hidden lg:flex justify-end pt-1">
            <div className="w-[56px] h-[56px] bg-[#000000] rounded-full flex items-center justify-center text-white text-[28px] shadow-[0_10px_40px_rgba(4,47,34,0.15)] hover:scale-105 transition-all cursor-pointer">
              <span style={{ fontFamily: "'Playfair Display', serif" }} className="italic font-bold pr-1">V</span>
            </div>
          </div>
        </div>

        {/* Natural Spacer for elegant layout */}
        <div className="mt-16 lg:mt-20" />

        {/* Bottom Bar: Logos and Legal */}
        <div className="flex flex-col md:flex-row items-center justify-between text-[13.5px] font-bold text-[#000000] border-t border-[#042f22]/10 pt-6">
          
          {/* Left Brand Area */}
          <div className="flex items-center gap-3 w-full md:w-[30%]">
             <div className="font-serif italic font-extrabold text-[20px] tracking-tight">Varity</div>
             <div className="text-[9px] uppercase font-bold tracking-[0.2em] text-[#042f22]/50 mt-1.5 ml-1">By Studio Alpha</div>
          </div>

          {/* Center Links */}
          <div className="w-full md:w-[40%] flex justify-center mt-6 md:mt-0">
             <a href="#" className="hover:text-[#0d7c66] transition-colors relative group text-[#042f22]/80">
                Data & Privacy
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#0d7c66] transition-all duration-300 group-hover:w-full"></span>
             </a>
          </div>

          {/* Right Copyright */}
          <div className="w-full md:w-[30%] flex justify-end items-center mt-6 md:mt-0 text-[10px] uppercase tracking-[0.08em] text-[#042f22]/50 font-semibold cursor-default">
             {currentYear} VARITY TECHNOLOGIES, INC
             {/* Small colorful pill */}
             <div className="w-[5px] h-[20px] rounded-full bg-gradient-to-b from-[#20C997] to-[#042f22] ml-4 hidden md:block opacity-80 hover:opacity-100 hover:scale-y-125 transition-all cursor-pointer"></div>
          </div>

        </div>
      </div>
    </footer>
    </div>
  );
};

export default FooterSection;
