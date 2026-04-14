"use client";

import { useEffect, useState } from "react";

export default function CalendlyButton({ 
  text = "Schedule a Call 🧑‍💻", 
  url, 
  className = "",
  inline = false
}) {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);

  useEffect(() => {
    // Ensure we are in the browser
    if (typeof window === "undefined") return;

    // Load Calendly CSS (Required for popup to render visibly)
    if (!document.querySelector('link[href="https://assets.calendly.com/assets/external/widget.css"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://assets.calendly.com/assets/external/widget.css";
      document.head.appendChild(link);
    }

    const scriptSrc = "https://assets.calendly.com/assets/external/widget.js";

    // Check if script already exists to avoid duplicate loads
    if (document.querySelector(`script[src="${scriptSrc}"]`)) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = scriptSrc;
    script.async = true;

    // Handle script load state for graceful fallback
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => setScriptError(true);

    document.head.appendChild(script);

    // No strict cleanup on unmount needed as Calendly script is global, 
    // but we remove the script element purely for DOM hygiene if unmounted early.
    return () => {
      // Optional: document.head.removeChild(script);
    };
  }, []);

  const handleClick = (e) => {
    e.preventDefault();

    // Gracefully handle case where Calendly script failed to load
    if (scriptError || !window.Calendly) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }
    
    // Trigger Calendly popup
    window.Calendly.initPopupWidget({ url });
  };

  // Base Modern Button UI
  const baseClasses = "calendly-btn-pad rounded-full bg-gradient-to-r from-[#20C997] to-[#0d9488] text-white shadow-xl transition-all duration-300 ease-in-out hover:scale-105 hover:brightness-110 text-[15px] md:text-[17px] font-bold flex items-center justify-center tracking-wide";
  
  // Fix to bottom-right unless specified as inline
  const positionClasses = inline ? "" : "fixed bottom-8 right-8 z-[9999]";

  return (
    <button
      onClick={handleClick}
      className={`${baseClasses} ${positionClasses} ${className}`}
      aria-label="Schedule a call"
    >
      {text}
    </button>
  );
}
