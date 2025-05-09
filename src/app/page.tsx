'use client';
import Image from "next/image";
import { motion } from "framer-motion";
// Import Shadcn UI components as needed (e.g., Button, NavigationMenu)

export default function Home() {
  return (
    // Main Hero Section - Centered Explore Message, Responsive for Mobile, unified background
    <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-8 sm:py-12" style={{ background: '#2d2d2d' }}>
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
          {/* Escaped single quote to fix react/no-unescaped-entities */}
          Welcome to our English Classroom, a vibrant and engaging platform designed for college students. Here, you&apos;ll find a wealth of resources
        </p>
      </motion.div>
      {/* Illustration Below the Text - Responsive Sizing, background matches page */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="flex justify-center items-center"
      >
        {/* Note.png illustration with background matching the page */}
        <div className="relative w-[200px] h-[230px] sm:w-[250px] sm:h-[300px] md:w-[300px] md:h-[350px] lg:w-[350px] lg:h-[400px]" style={{ background: '#2d2d2d' }}>
          <Image
            src="/images/note.png"
            alt="English resources background"
            fill
            style={{ objectFit: 'contain', background: 'transparent' }}
            priority
          />
        </div>
      </motion.div>
    </div>
  );
}
