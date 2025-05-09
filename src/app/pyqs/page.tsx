"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

// Component to display embedded PDFs from Supabase 'pyqs' bucket
export default function PyqsPage() {
  // State to hold the list of PDF public URLs
  const [pdfs, setPdfs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch PDF files from Supabase Storage on mount
  useEffect(() => {
    const fetchPdfs = async () => {
      setLoading(true);
      setError("");
      // Debug: Check if supabase client is defined
      if (!supabase) {
        console.error("Supabase client is undefined!");
        setError("Supabase client is not initialized.");
        setLoading(false);
        return;
      }
      try {
        // List all files in the 'pyqs' bucket
        const { data, error } = await supabase.storage.from("pyqs").list();
        console.log("PYQS list() error:", error); // DEBUG: log the error
        console.log("PYQS list() data:", data); // DEBUG: log the data structure
        if (error) throw error;
        if (!data || data.length === 0) {
          console.warn("No files found in pyqs bucket or data is empty.");
          setPdfs([]);
          setLoading(false);
          return;
        }
        // Log each file object
        data.forEach((file, idx) => console.log(`File #${idx}:`, file));
        // Get public URLs for each file
        const urls = data
          .filter((file) => file.name.endsWith(".pdf"))
          .map((file) => {
            const { data: urlData } = supabase.storage.from("pyqs").getPublicUrl(file.name);
            console.log(`Public URL for ${file.name}:`, urlData?.publicUrl);
            return urlData.publicUrl;
          });
        setPdfs(urls);
        // Debug: Log Supabase config
        // @ts-expect-error: Supabase client type may not expose 'url' property
        console.log("SUPABASE_URL:", supabase?.url);
        // @ts-expect-error: Supabase client type may not expose 'key' property
        console.log("SUPABASE_ANON_KEY (partial):", supabase?.key?.slice?.(0, 8));
        // Test direct public URL fetch for a known file
        const testFile = "18LEH101J Jan 2019.pdf";
        const { data: testUrlData } = supabase.storage.from("pyqs").getPublicUrl(testFile);
        console.log(`Test public URL for '${testFile}':`, testUrlData?.publicUrl);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        console.error("Error fetching PYQs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPdfs();
  }, []);

  return (
    <div className="min-h-screen bg-[#2d2d2d] flex flex-col items-center py-8 px-4">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-[#fde7c3] mb-4" style={{ fontFamily: 'Xanh Mono, monospace' }}>
        Previous Year Questions (PYQs)
      </h1>
      {/* Extra PYQs Link */}
      <div className="mb-6">
        <a
          href="https://thehelpers.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-blue-400 hover:text-blue-300 text-lg font-bold"
          style={{ fontFamily: 'Xanh Mono, monospace' }}
        >
          Find more PYQs at this website
        </a>
      </div>
      {/* Loading/Error States */}
      {loading && (
        <div className="text-[#fde7c3] text-lg" style={{ fontFamily: 'Xanh Mono, monospace' }}>Loading PYQs...</div>
      )}
      {error && (
        <div className="text-red-400 text-lg" style={{ fontFamily: 'Xanh Mono, monospace' }}>{error}</div>
      )}
      {/* PDF List */}
      <div className="w-full max-w-3xl flex flex-col gap-10">
        {pdfs.length === 0 && !loading && !error && (
          <div className="text-gray-400 text-lg" style={{ fontFamily: 'Xanh Mono, monospace' }}>No PYQs found.</div>
        )}
        {pdfs.map((url, idx) => (
          <div key={idx} className="bg-black rounded-xl border border-[#fde7c3] p-4 flex flex-col items-center shadow-lg">
            {/* PDF Filename */}
            <span className="text-[#fde7c3] text-base mb-2" style={{ fontFamily: 'Xanh Mono, monospace' }}>
              {url.split("/").pop()}
            </span>
            {/* Embedded PDF Viewer */}
            <embed
              src={url}
              type="application/pdf"
              className="w-full h-[500px] rounded-lg border border-[#fde7c3] bg-white"
            />
            {/* Download Link */}
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-blue-300 underline text-sm"
              style={{ fontFamily: 'Xanh Mono, monospace' }}
            >
              Download PDF
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
