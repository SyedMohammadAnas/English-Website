"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
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
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

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

  // Open modal with current image
  const openModal = useCallback((idx: number) => {
    setModalIndex(idx);
    setModalOpen(true);
  }, []);

  // Close modal
  const closeModal = useCallback(() => setModalOpen(false), []);

  // Keyboard navigation for modal
  useEffect(() => {
    if (!modalOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") setModalIndex((i) => (i + 1) % sessionImages.length);
      if (e.key === "ArrowLeft") setModalIndex((i) => (i - 1 + sessionImages.length) % sessionImages.length);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [modalOpen, closeModal]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center relative overflow-hidden" style={{ fontFamily: 'Xanh Mono, monospace' }}>
      {/* Full-Screen Panorama Background with Overlay */}
      <div className="fixed inset-0 w-full h-full -z-10">
        <Image
          src={`/images/sessions/${panoramaImage}`}
          alt="Panorama Session Background"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        {/* Dark overlay for contrast */}
        <div className="absolute inset-0 bg-black/70" />
      </div>
      {/* Spacer for header */}
      <div className="h-[8vh] w-full" />
      {/* Carousel Card Floating Above Background */}
      <div className="w-full flex justify-center z-30 relative mt-8">
        <div
          className="w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border-4 border-[#fde7c3] p-6 flex flex-col items-center"
          style={{ boxShadow: '0 8px 32px 0 rgba(34, 34, 34, 0.25)' }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Animated Carousel */}
          <div className="relative w-full h-72 flex items-center justify-center mb-4 bg-black/30 rounded-xl cursor-zoom-in" onClick={() => openModal(index)}>
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
                  className="rounded-xl border-2 border-[#fde7c3] shadow-lg object-contain w-full h-64 bg-black"
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
      {/* Fullscreen Modal Viewer */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={closeModal}
            aria-modal="true"
            tabIndex={-1}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative max-w-[96vw] max-h-[92vh] flex flex-col items-center"
              onClick={e => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-[#fde7c3] text-3xl font-bold bg-black/60 rounded-full px-3 py-1 hover:bg-[#fde7c3] hover:text-black transition"
                aria-label="Close"
                style={{ fontFamily: 'Xanh Mono, monospace' }}
              >
                ×
              </button>
              {/* Prev Button */}
              <button
                onClick={() => setModalIndex((i) => (i - 1 + sessionImages.length) % sessionImages.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-[#fde7c3] text-4xl font-bold bg-black/60 rounded-full px-3 py-1 hover:bg-[#fde7c3] hover:text-black transition"
                aria-label="Previous"
                style={{ fontFamily: 'Xanh Mono, monospace' }}
              >
                ‹
              </button>
              {/* Next Button */}
              <button
                onClick={() => setModalIndex((i) => (i + 1) % sessionImages.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#fde7c3] text-4xl font-bold bg-black/60 rounded-full px-3 py-1 hover:bg-[#fde7c3] hover:text-black transition"
                aria-label="Next"
                style={{ fontFamily: 'Xanh Mono, monospace' }}
              >
                ›
              </button>
              {/* Fullscreen Image */}
              <Image
                src={`/images/sessions/${sessionImages[modalIndex]}`}
                alt={`Session Full ${modalIndex + 1}`}
                width={1200}
                height={800}
                className="object-contain rounded-2xl border-4 border-[#fde7c3] bg-black max-w-[90vw] max-h-[80vh] shadow-2xl"
                style={{ fontFamily: 'Xanh Mono, monospace' }}
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
