'use client';
import { motion } from 'framer-motion';

export default function AssignmentsPage() {
  return (
    // Animated container for the assignments page, let layout handle height and background
    <motion.div
      initial={{ opacity: 0, y: 80, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -80, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-12"
      style={{ fontFamily: 'Xanh Mono, monospace' }}
    >
      {/* Assignments Page Heading */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#f5d7b7] mb-6 text-center">
        Assignments
      </h1>
      {/* Description or content placeholder */}
      <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl text-center mb-8">
        Here you will find all your English classroom assignments, resources, and submission links. Stay tuned for  updates!
      </p>
      {/* Example assignment card (placeholder) */}
      <div className="w-full max-w-md bg-[#232323] rounded-xl shadow-lg p-6 mb-4 border border-[#fde7c3]/10">
        <h2 className="text-xl font-semibold text-[#fde7c3] mb-2">Assignment 1: Essay on Modern Literature</h2>
        <p className="text-gray-200 mb-2">Due: 15th June 2024</p>
        <button className="mt-2 px-4 py-2 bg-[#fde7c3] text-[#232323] rounded-lg font-bold transition hover:bg-[#f5d7b7]    " style={{ fontFamily: 'Xanh Mono, monospace' }}>
          View Details
        </button>
      </div>
      {/* Add more assignment cards as needed */}
    </motion.div>
  );
}
