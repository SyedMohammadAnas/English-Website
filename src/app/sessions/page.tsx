"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// List of session images (hardcoded since public folder is static)
const sessionImages = [
  "01.jpeg",
  "02.jpeg",
  "03.jpeg",
  "04.jpeg",
  "05.jpeg",
  "06.jpeg",
  "07.jpeg",
];

const panoramaImage = "Panorama.jpeg";

// Main Sessions Gallery Page
export default function SessionsGallery() {
  // State for carousel index
  const [index, setIndex] = useState(0);
  // Ref for auto sliding interval
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  // State to pause on hover
  const [isPaused, setIsPaused] = useState(false);

  // Start auto sliding
  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setIndex((prev) => (prev + 1) % sessionImages.length);
      }, 3000); // Slide every 3s
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused]);

  // Handler for manual navigation
  const goTo = (idx: number) => setIndex(idx);

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-[#232323] relative" style={{ fontFamily: 'Xanh Mono, monospace' }}>
      {/* Panorama Full-Width Background with Overlay */}
      <div className="relative w-full h-[38vh] min-h-[220px] max-h-[340px] flex items-center justify-center overflow-hidden">
        {/* Panorama Image as background */}
        <Image
          src={`/images/sessions/${panoramaImage}`}
          alt="Panorama Session Background"
          fill
          style={{ objectFit: "cover", zIndex: 1 }}
          priority
        />
        {/* Dark overlay for contrast */}
        <div className="absolute inset-0 bg-black/60 z-10" />
        {/* Title over background */}
        <h1 className="absolute z-20 text-4xl md:text-5xl font-bold text-[#fde7c3] drop-shadow-lg text-center w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ fontFamily: 'Xanh Mono, monospace' }}>
          Sessions Gallery
        </h1>
      </div>
      {/* Carousel Card Floating Below Background */}
      <div className="w-full flex justify-center -mt-20 md:-mt-28 z-30 relative">
        <div
          className="w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border-4 border-[#fde7c3] p-6 flex flex-col items-center"
          style={{ boxShadow: '0 8px 32px 0 rgba(34, 34, 34, 0.25)' }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Animated Carousel */}
          <div className="relative w-full h-72 flex items-center justify-center mb-4">
            <AnimatePresence initial={false}>
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.92, x: 100 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.92, x: -100 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 120, damping: 18 }}
                className="absolute w-full h-full flex items-center justify-center"
              >
                <Image
                  src={`/images/sessions/${sessionImages[index]}`}
                  alt={`Session ${index + 1}`}
                  width={600}
                  height={288}
                  className="rounded-xl border-2 border-[#fde7c3] shadow-lg object-cover w-full h-64 transition-transform duration-500 hover:scale-105 hover:shadow-2xl"
                  style={{ fontFamily: 'Xanh Mono, monospace' }}
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>
          {/* Thumbnails for manual navigation */}
          <div className="flex gap-3 justify-center mt-2">
            {sessionImages.map((img, idx) => (
              <button
                key={img}
                onClick={() => goTo(idx)}
                className={`rounded-lg border-2 ${index === idx ? 'border-[#fde7c3] bg-white/20' : 'border-transparent'} focus:outline-none transition-all duration-300 backdrop-blur-sm`}
                style={{ boxShadow: index === idx ? '0 0 0 2px #fde7c3' : undefined }}
                aria-label={`Go to session ${idx + 1}`}
              >
                <Image
                  src={`/images/sessions/${img}`}
                  alt={`Session thumb ${idx + 1}`}
                  width={60}
                  height={40}
                  className={`rounded-md object-cover ${index === idx ? 'scale-110' : 'opacity-70'} transition-all duration-300`}
                  style={{ fontFamily: 'Xanh Mono, monospace' }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Description or Call to Action */}
      <div className="mt-16 text-[#fde7c3] text-lg text-center max-w-2xl z-40" style={{ fontFamily: 'Xanh Mono, monospace' }}>
        Relive the best moments from our sessions! Hover over images for a closer look.
      </div>
    </div>
  );
}
