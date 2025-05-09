"use client";
import { useEffect, useState } from "react";

// BackToTopButton: Floating button to scroll to top smoothly
export default function BackToTopButton() {
  // State to show/hide the button
  const [showTop, setShowTop] = useState(false);

  // Listen for scroll to toggle button
  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handler for smooth scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Only render if showTop is true
  if (!showTop) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-32 right-6 z-[60] bg-[#fde7c3] text-[#232323] px-4 py-2 rounded-full shadow-lg font-bold transition hover:bg-[#f5d7b7] border border-[#fde7c3] focus:outline-none focus:ring-2 focus:ring-[#fde7c3]"
      style={{ fontFamily: 'Xanh Mono, monospace', letterSpacing: '0.05em' }}
      aria-label="Back to top"
    >
      ↑ Top
    </button>
  );
}
