// NOTE: Use 'font-xanhmono' Tailwind class for Xanh Mono font (see tailwind.config.js)
// Import necessary modules from React
import React from 'react';

// Main PBL Page Component
const PBLPage = () => {
  // Array of PDF data for easy mapping
  const pdfs = [
    {
      title: 'To Kill A Mockingbird - Harper Lee',
      file: '/pbl/To_Kill_A_MockingBird-Harper Lee.pdf',
    },
    {
      title: 'Brave New World - Aldous Huxley',
      file: '/pbl/Brave_New_World-Aldous Huxley.pdf',
    },
    {
      title: '1984 - George Orwell',
      file: '/pbl/1984-George Orwell.pdf',
    },
  ];

  return (
    // Main container with background matching pyqs page
    <main className="min-h-screen bg-[#2d2d2d] p-8 flex flex-col items-center font-xanhmono">
      {/* Page Heading */}
      <h1 className="text-3xl font-bold mb-8 text-center text-neutral-800 text-white" style={{ fontFamily: 'Xanh Mono, monospace' }}>
        Project Based Learning (PBL) Library
      </h1>
      {/* PDF Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl">
        {/* Map through each PDF and embed it */}
        {pdfs.map((pdf) => (
          // Card with white background, border, and shadow for clarity
          <section key={pdf.title} className="flex flex-col items-center bg-white border border-neutral-200 rounded-lg shadow-lg p-4">
            {/* PDF Title */}
            <h2 className="text-xl font-semibold mb-4 text-center text-neutral-700" style={{ fontFamily: 'Xanh Mono, monospace' }}>
              {pdf.title}
            </h2>
            {/* Embedded PDF - no fallback inside iframe to avoid hydration error */}
            <iframe
              src={pdf.file}
              title={pdf.title}
              className="w-full h-96 border rounded"
              style={{ minHeight: '24rem' }}
            />
            {/* Fallback download link for users who can't view the PDF */}
            <noscript>
              <a href={pdf.file} className="text-blue-600 underline mt-2">Download PDF</a>
            </noscript>
          </section>
        ))}
      </div>
    </main>
  );
};

// Export the PBLPage as default
export default PBLPage;

// Note: Ensure Xanh Mono font is loaded in your Tailwind config and global CSS for proper font rendering.
