"use client";

import { motion } from "framer-motion";

export default function Footer() {
  const links = {
    Product: ["Features", "Pricing", "Templates", "Integrations"],
    Resources: ["Documentation", "Tutorials", "Blog", "Changelog"],
    Company: ["About", "Careers", "Press", "Contact"],
    Legal: ["Privacy", "Terms", "Security"],
  };

  return (
    <footer className="relative z-20 bg-[#f8faf9] border-t border-[#0d7c66]/8 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0d7c66] to-[#10b981] flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M4 3L12 8L4 13V3Z" fill="white"/>
                </svg>
              </div>
              <span className="text-lg font-bold text-[#1a1a2e]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Varity
              </span>
            </div>
            <p className="text-sm text-[#1a1a2e]/35 leading-relaxed">
              AI-powered video editing for the modern creator.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-[#1a1a2e]/70 mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-[#1a1a2e]/35 hover:text-[#0d7c66] transition-colors duration-300"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#0d7c66]/8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#1a1a2e]/25">
            © 2026 Varity. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {["Twitter", "GitHub", "Discord", "YouTube"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-xs text-[#1a1a2e]/25 hover:text-[#0d7c66] transition-colors duration-300"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
