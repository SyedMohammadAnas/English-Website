// src/app/classwork/page.tsx
// Classwork Page: Fetches and displays classwork data from Supabase, including embedded PDFs
// Uses Xanh Mono font and Tailwind CSS for styling
// Comments are added for each functionality for clarity

'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';

// Define the shape of a classwork entry
interface Classwork {
  id: number;
  title: string;
  details?: string;
  files?: string[]; // Array of PDF URLs
  created_at?: string;
}

export default function ClassworkPage() {
  // State to store classwork entries
  const [classworks, setClassworks] = useState<Classwork[]>([]);
  // State for loading and error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch classwork data from Supabase on mount
  useEffect(() => {
    const fetchClassworks = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch all classwork entries, order by created_at descending
        const { data, error } = await supabase
          .from('classwork')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) {
          setError(error.message);
        } else {
          setClassworks(data || []);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Unknown error');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchClassworks();
  }, []);

  // Helper to format date as dd/mm/yyyy
  function formatDate(dateStr?: string) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  return (
    // Animated container for the classwork page
    <motion.div
      initial={{ opacity: 0, y: 80, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -80, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-12"
      style={{ fontFamily: 'Xanh Mono, monospace' }}
    >
      {/* Classwork Page Heading */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#f5d7b7] mb-6 text-center">
        Classwork
      </h1>
      {/* Description or content placeholder */}
      <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl text-center mb-8">
        Here you will find all your English classroom classwork, resources, and PDF materials. Stay tuned for updates!
      </p>
      {/* Loading State */}
      {loading && (
        <div className="text-gray-300 mb-8">Loading classwork...</div>
      )}
      {/* Error State */}
      {error && !loading && (
        <div className="text-red-400 mb-8">{error}</div>
      )}
      {/* No Classwork State */}
      {!loading && !error && classworks.length === 0 && (
        <div className="text-gray-400 mb-8">No classwork found.</div>
      )}
      {/* Classwork List */}
      <div className="w-full flex flex-col items-center">
        {/* Map over classwork entries and display each */}
        {!loading && !error && classworks.map((cw) => (
          <div
            key={cw.id}
            className="w-full max-w-md bg-[#232323] rounded-xl shadow-lg p-6 mb-4 border border-[#fde7c3]/10 relative"
            style={{ fontFamily: 'Xanh Mono, monospace' }}
          >
            {/* Title and Date */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <span className="text-lg font-bold text-[#f5d7b7]">{cw.title}</span>
              {cw.created_at && (
                <span className="text-sm text-[#fde7c3]">{formatDate(cw.created_at)}</span>
              )}
            </div>
            {/* Details */}
            {cw.details && (
              <div className="text-gray-300 text-sm mb-2">{cw.details}</div>
            )}
            {/* Embedded PDFs */}
            {cw.files && cw.files.length > 0 && (
              <div className="flex flex-col gap-4 mt-2">
                <span className="text-[#fde7c3] text-xs font-bold">PDFs:</span>
                <ul className="list-disc list-inside">
                  {cw.files.map((link, idx) => {
                    // Extract filename from URL
                    const filename = link.split('/').pop() || link;
                    return (
                      <li key={idx} className="mb-2">
                        {/* PDF Link */}
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-300 underline"
                          title={link}
                        >
                          {filename}
                        </a>
                        {/* PDF Embed */}
                        <div className="w-full mt-2">
                          <iframe
                            src={link}
                            title={`PDF-${filename}`}
                            className="w-full h-64 rounded border border-[#fde7c3]/30 bg-white"
                            style={{ minHeight: '16rem' }}
                            allow="autoplay"
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
