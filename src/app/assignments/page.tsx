'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

// Define the shape of an assignment entry
interface Assignment {
  id: number;
  title: string;
  details?: string;
  files?: string[];
  deadline?: string;
  created_at?: string;
}

export default function AssignmentsPage() {
  // State to store assignments
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  // State for loading and error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch assignments from Supabase on mount
  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch all assignments, order by created_at descending
        const { data, error } = await supabase
          .from('assignments')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) {
          setError(error.message);
        } else {
          setAssignments(data || []);
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
    fetchAssignments();
  }, []);

  // Helper to format date as dd/mm/yyyy
  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  // Helper to format time as hh:mm AM/PM
  function formatTime(dateStr: string) {
    const date = new Date(dateStr);
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
    return `${hours}:${minutes} ${ampm}`;
  }
  // Helper to calculate days left
  function daysLeft(dateStr: string) {
    const now = new Date();
    const deadline = new Date(dateStr);
    // Calculate difference in ms, then in days
    const diff = deadline.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  }

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
        Here you will find all your English classroom assignments, resources, and submission links. Stay tuned for updates!
      </p>
      {/* Loading State */}
      {loading && (
        <div className="text-gray-300 mb-8" style={{ fontFamily: 'Xanh Mono, monospace' }}>Loading assignments...</div>
      )}
      {/* Error State */}
      {error && !loading && (
        <div className="text-red-400 mb-8" style={{ fontFamily: 'Xanh Mono, monospace' }}>{error}</div>
      )}
      {/* No Assignments State */}
      {!loading && !error && assignments.length === 0 && (
        <div className="text-gray-400 mb-8" style={{ fontFamily: 'Xanh Mono, monospace' }}>No assignments found.</div>
      )}
      {/* Assignments List */}
      <div className="w-full flex flex-col items-center">
        {!loading && !error && assignments.map((a) => {
          // Calculate days left if deadline exists
          const showDaysLeft = a.deadline;
          const days = showDaysLeft ? daysLeft(a.deadline) : null;
          return (
            <div
              key={a.id}
              className="w-full max-w-md bg-[#232323] rounded-xl shadow-lg p-6 mb-4 border border-[#fde7c3]/10 relative"
              style={{ fontFamily: 'Xanh Mono, monospace' }}
            >
              {/* Only show badge if days is a valid number */}
              {typeof days === 'number' && showDaysLeft && (
                <div
                  className="absolute top-3 right-4 bg-[#fde7c3] text-[#232323] px-3 py-1 rounded-full text-xs font-bold shadow"
                  style={{ fontFamily: 'Xanh Mono, monospace' }}
                  title={days > 0 ? `${days} days left` : days === 0 ? 'Due today!' : 'Past due'}
                >
                  {days > 0 ? `${days} day${days === 1 ? '' : 's'} left` : days === 0 ? 'Due today!' : 'Past due'}
                </div>
              )}
              {/* Assignment Title */}
              <h2 className="text-xl font-semibold text-[#fde7c3] mb-2">{a.title}</h2>
              {/* Assignment Deadline */}
              {a.deadline && (
                <p className="text-gray-200 mb-2">
                  Due: {formatDate(a.deadline)}, {formatTime(a.deadline)}
                </p>
              )}
              {/* Assignment Details */}
              {a.details && (
                <p className="text-gray-300 mb-2">{a.details}</p>
              )}
              {/* Assignment Files */}
              {a.files && a.files.length > 0 && (
                <div className="mt-2">
                  <span className="text-[#fde7c3] text-xs font-bold">Files:</span>
                  <ul className="list-disc list-inside">
                    {a.files.map((link: string, idx: number) => (
                      <li key={idx}>
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-300 underline"
                          style={{ fontFamily: 'Xanh Mono, monospace' }}
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* View Details Button (optional, can be expanded later) */}
              {/* <button className="mt-2 px-4 py-2 bg-[#fde7c3] text-[#232323] rounded-lg font-bold transition hover:bg-[#f5d7b7]" style={{ fontFamily: 'Xanh Mono, monospace' }}>
                View Details
              </button> */}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
