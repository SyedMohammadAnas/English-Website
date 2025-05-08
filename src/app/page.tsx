'use client';
import Image from "next/image";
import { motion } from "framer-motion";
// Import Shadcn UI components as needed (e.g., Button, NavigationMenu)

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#2d2d2d]">
      {/* Header Section */}
      <header className="w-full flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 py-4 bg-black gap-4 sm:gap-0">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          {/* Placeholder for logo icon */}
          <span className="text-2xl sm:text-3xl">🌀</span>
          <span className="text-2xl sm:text-3xl font-bold text-white" style={{ fontFamily: 'Xanh Mono, monospace' }}>Classmate</span>
        </div>
        {/* Navigation Links with Responsive Spacing */}
        <nav className="flex gap-6 sm:gap-14">
          <a className="text-white text-base sm:text-lg hover:underline" style={{ fontFamily: 'Xanh Mono, monospace' }} href="#">Home</a>
          <a className="text-white text-base sm:text-lg hover:underline" style={{ fontFamily: 'Xanh Mono, monospace' }} href="#">About</a>
          <a className="text-white text-base sm:text-lg hover:underline" style={{ fontFamily: 'Xanh Mono, monospace' }} href="#">Contact</a>
        </nav>
      </header>

      {/* Main Hero Section - Centered Explore Message, Responsive for Mobile */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-8 sm:py-12">
        {/* Centered Text Content */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center text-center mb-8 sm:mb-12"
        >
          {/* Main Heading - Responsive Text Size */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 text-[#f5d7b7]" style={{ fontFamily: 'Xanh Mono, monospace' }}>
            Explore Our<br />English Classroom
          </h1>
          {/* Subheading Paragraph - Responsive Max Width */}
          <p className="text-base sm:text-lg md:text-2xl text-gray-300 max-w-xs sm:max-w-lg md:max-w-2xl" style={{ fontFamily: 'Xanh Mono, monospace' }}>
            Welcome to our English Classroom, a vibrant and engaging platform designed for college students. Here, you'll find a wealth of resources
          </p>
        </motion.div>
        {/* Illustration Below the Text - Responsive Sizing */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex justify-center items-center"
        >
          {/* Note.png illustration with no border/shadow/canvas */}
          <div className="relative w-[200px] h-[230px] sm:w-[250px] sm:h-[300px] md:w-[300px] md:h-[350px] lg:w-[350px] lg:h-[400px]">
            <Image
              src="/images/note.png"
              alt="English resources background"
              fill
              style={{ objectFit: 'contain', background: 'transparent' }}
              priority
            />
          </div>
        </motion.div>
      </main>

      {/* Bottom Navigation Bar - Responsive Spacing and Font Size */}
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="w-full bg-black flex flex-wrap justify-center items-center gap-6 sm:gap-12 md:gap-20 py-4 sm:py-6"
      >
        {/* Navigation Items with Pill Hover Effect */}
        {['Assignments', 'Classwork', 'PYQs', 'Sessions', 'PBL'].map((item) => (
          <span
            key={item}
            className="text-white text-base sm:text-xl md:text-2xl cursor-pointer transition-colors duration-200 px-6 py-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fde7c3] hover:bg-[#fde7c3] hover:text-[#7a6a58] focus-visible:bg-[#fde7c3] focus-visible:text-[#7a6a58]"
            style={{ fontFamily: 'Xanh Mono, monospace' }}
            tabIndex={0} // Make span focusable for accessibility
          >
            {item}
          </span>
        ))}
      </motion.nav>
    </div>
  );
}
