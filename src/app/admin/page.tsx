"use client";
import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { supabase } from "@/lib/supabaseClient";

// Admin password (for demo purposes, in production use env vars and server-side auth)
const ADMIN_PASSWORD = "admin123";

// Define the shape of an assignment entry
interface Assignment {
  id: number;
  title: string;
  details?: string;
  files?: string[];
  deadline?: string;
  created_at?: string;
}
// Define the shape of a classwork entry
interface Classwork {
  id: number;
  title: string;
  details?: string;
  files?: string[];
  created_at?: string;
}

export default function AdminPage() {
  // State to track password input and access
  const [input, setInput] = useState("");
  const [access, setAccess] = useState(false);
  const [error, setError] = useState("");
  // State to manage Add Assignment modal visibility
  const [open, setOpen] = useState(false);
  // State for assignment form fields
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [deadline, setDeadline] = useState("");
  const [files, setFiles] = useState<string[]>([""]);
  // State for loading and error feedback
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  // State for assignments list, loading, and error
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState("");
  // State for tab selection (Assignments or Classwork)
  const [activeTab, setActiveTab] = useState<'assignments' | 'classwork'>('assignments');
  // State for Add Classwork modal visibility
  const [classworkOpen, setClassworkOpen] = useState(false);
  // State for classwork form fields
  const [cwTitle, setCwTitle] = useState("");
  const [cwDetails, setCwDetails] = useState("");
  const [cwFiles, setCwFiles] = useState<File[]>([]);
  // State for classwork loading, error, and success feedback
  const [cwLoading, setCwLoading] = useState(false);
  const [cwError, setCwError] = useState("");
  const [cwSuccess, setCwSuccess] = useState("");
  // --- CLASSWORK FETCH STATE ---
  // State for classwork list, loading, and error
  const [classworks, setClassworks] = useState<Classwork[]>([]);
  const [classworkLoading, setClassworkLoading] = useState(false);
  const [classworkError, setClassworkError] = useState("");

  // On mount, check localStorage for admin access
  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("admin_access") === "true") {
      setAccess(true);
    }
  }, []);

  // Handle password form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === ADMIN_PASSWORD) {
      setAccess(true);
      setError("");
      // Persist access in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("admin_access", "true");
      }
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  // Handle sign out
  const handleSignOut = () => {
    setAccess(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_access");
    }
  };

  // Handler to add a new file link input
  const handleAddFile = () => setFiles([...files, ""]);
  // Handler to update a file link
  const handleFileChange = (idx: number, value: string) => {
    const updated = [...files];
    updated[idx] = value;
    setFiles(updated);
  };
  // Handler to remove a file link input
  const handleRemoveFile = (idx: number) => {
    if (files.length === 1) return; // Always keep at least one input
    setFiles(files.filter((_, i) => i !== idx));
  };

  // Function to fetch assignments from Supabase
  const fetchAssignments = async () => {
    setFetching(true);
    setFetchError("");
    try {
      const { data, error } = await supabase.from("assignments").select("*").order("created_at", { ascending: false });
      if (error) {
        setFetchError(error.message);
      } else {
        setAssignments(data || []);
      }
    } catch (err) {
      // Type guard for error
      if (err instanceof Error) {
        setFetchError(err.message);
      } else {
        setFetchError("Unknown error");
      }
    } finally {
      setFetching(false);
    }
  };

  // Fetch assignments on mount and after modal closes (successful add)
  useEffect(() => {
    fetchAssignments();
  }, []);
  useEffect(() => {
    if (!open) {
      fetchAssignments();
    }
  }, [open]);

  // Helper to upload a single file to Supabase Storage and return its public URL
  const uploadPdf = async (file: File) => {
    // Use a unique filename: timestamp + original name
    const filePath = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('classwork-pdfs').upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });
    if (error) throw error;
    // Get public URL
    const { data: publicUrlData } = supabase.storage.from('classwork-pdfs').getPublicUrl(filePath);
    return publicUrlData.publicUrl;
  };

  // Function to fetch classwork from Supabase
  const fetchClassworks = async () => {
    setClassworkLoading(true);
    setClassworkError("");
    try {
      const { data, error } = await supabase.from("classwork").select("*").order("created_at", { ascending: false });
      if (error) {
        setClassworkError(error.message);
      } else {
        setClassworks(data || []);
      }
    } catch (err) {
      // Type guard for error
      if (err instanceof Error) {
        setClassworkError(err.message);
      } else {
        setClassworkError("Unknown error");
      }
    } finally {
      setClassworkLoading(false);
    }
  };

  // Fetch classwork on mount and after modal closes (successful add)
  useEffect(() => {
    fetchClassworks();
  }, []);
  useEffect(() => {
    if (!classworkOpen) {
      fetchClassworks();
    }
  }, [classworkOpen]);

  // Render password prompt if not authenticated
  if (!access) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#2d2d2d] px-4">
        {/* Password Prompt Card */}
        <div className="bg-black rounded-xl shadow-lg p-8 w-full max-w-sm flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4 text-[#f5d7b7]" style={{ fontFamily: 'Xanh Mono, monospace' }}>
            Admin Login
          </h2>
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <input
              type="password"
              placeholder="Enter admin password"
              value={input}
              onChange={e => setInput(e.target.value)}
              className="px-4 py-2 rounded bg-[#2d2d2d] border border-[#fde7c3] text-white focus:outline-none focus:ring-2 focus:ring-[#fde7c3]"
              style={{ fontFamily: 'Xanh Mono, monospace' }}
              required
            />
            <button
              type="submit"
              className="bg-[#fde7c3] text-[#7a6a58] font-bold py-2 rounded-full transition-colors hover:bg-[#f5d7b7]"
              style={{ fontFamily: 'Xanh Mono, monospace' }}
            >
              Login
            </button>
            {error && <span className="text-red-400 text-sm" style={{ fontFamily: 'Xanh Mono, monospace' }}>{error}</span>}
          </form>
        </div>
      </div>
    );
  }

  // Render admin dashboard content if authenticated
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#2d2d2d] px-4 relative">
      {/* Sign Out button in top-right corner */}
      <button
        onClick={handleSignOut}
        className="absolute top-6 right-6 bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2 rounded-full transition-colors shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300 z-50"
        style={{ fontFamily: 'Xanh Mono, monospace' }}
      >
        Sign Out
      </button>
      {/* Admin Dashboard Navbar */}
      <nav className="w-full max-w-lg flex items-center justify-between bg-black rounded-t-xl px-6 py-4 mb-0 border-b border-[#fde7c3]">
        <div className="flex gap-8">
          {/* Assignments Tab */}
          <button
            className={`px-6 py-2 rounded-full font-bold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fde7c3] text-lg
              ${activeTab === 'assignments'
                ? 'bg-[#fde7c3] text-[#7a6a58]'
                : 'border border-[#fde7c3] text-[#fde7c3] bg-transparent hover:bg-[#fde7c3] hover:text-[#7a6a58]'}
            `}
            style={{ fontFamily: 'Xanh Mono, monospace' }}
            onClick={() => setActiveTab('assignments')}
          >
            Assignments
          </button>
          {/* Classwork Tab */}
          <button
            className={`px-6 py-2 rounded-full font-bold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fde7c3] text-lg
              ${activeTab === 'classwork'
                ? 'bg-[#fde7c3] text-[#7a6a58]'
                : 'border border-[#fde7c3] text-[#fde7c3] bg-transparent hover:bg-[#fde7c3] hover:text-[#7a6a58]'}
            `}
            style={{ fontFamily: 'Xanh Mono, monospace' }}
            onClick={() => setActiveTab('classwork')}
          >
            Classwork
          </button>
        </div>
      </nav>
      {/* Admin Dashboard Content */}
      <div className="bg-black rounded-b-xl shadow-lg p-8 w-full max-w-lg flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-6 text-[#f5d7b7]" style={{ fontFamily: 'Xanh Mono, monospace' }}>
          Admin Dashboard
        </h2>
        {/* Tab Content: Assignments */}
        {activeTab === 'assignments' && (
          <>
            {/* Add Assignment Button */}
            <button
              className="bg-[#fde7c3] text-[#7a6a58] font-bold px-6 py-2 rounded-full mb-6 hover:bg-[#f5d7b7]"
              style={{ fontFamily: 'Xanh Mono, monospace' }}
              onClick={() => setOpen(true)}
            >
              + Add Assignment
            </button>
            {/* Assignments List */}
            <div className="w-full mb-6">
              <h3 className="text-xl font-bold text-[#fde7c3] mb-2" style={{ fontFamily: 'Xanh Mono, monospace' }}>
                Assignments
              </h3>
              {fetching ? (
                <div className="text-gray-300" style={{ fontFamily: 'Xanh Mono, monospace' }}>Loading assignments...</div>
              ) : fetchError ? (
                <div className="text-red-400" style={{ fontFamily: 'Xanh Mono, monospace' }}>{fetchError}</div>
              ) : assignments.length === 0 ? (
                <div className="text-gray-400" style={{ fontFamily: 'Xanh Mono, monospace' }}>No assignments found.</div>
              ) : (
                <ul className="flex flex-col gap-4">
                  {assignments.map((a) => (
                    <li key={a.id} className="bg-[#232323] rounded-lg p-4 border border-[#fde7c3] flex flex-col gap-2">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <span className="text-lg font-bold text-[#f5d7b7]" style={{ fontFamily: 'Xanh Mono, monospace' }}>{a.title}</span>
                        {a.deadline && (
                          <span className="text-sm text-[#fde7c3]" style={{ fontFamily: 'Xanh Mono, monospace' }}>
                            Deadline: {new Date(a.deadline).toLocaleString()}
                          </span>
                        )}
                      </div>
                      {a.details && (
                        <div className="text-gray-300 text-sm" style={{ fontFamily: 'Xanh Mono, monospace' }}>{a.details}</div>
                      )}
                      {a.files && a.files.length > 0 && (
                        <div className="flex flex-col gap-1 mt-2">
                          <span className="text-[#fde7c3] text-xs font-bold" style={{ fontFamily: 'Xanh Mono, monospace' }}>Files:</span>
                          <ul className="list-disc list-inside">
                            {a.files.map((link: string, idx: number) => (
                              <li key={idx}>
                                <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-300 underline" style={{ fontFamily: 'Xanh Mono, monospace' }}>{link}</a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
        {/* Tab Content: Classwork */}
        {activeTab === 'classwork' && (
          <>
            {/* Add Classwork Button */}
            <button
              className="bg-[#fde7c3] text-[#7a6a58] font-bold px-6 py-2 rounded-full mb-6 hover:bg-[#f5d7b7]"
              style={{ fontFamily: 'Xanh Mono, monospace' }}
              onClick={() => setClassworkOpen(true)}
            >
              + Add Classwork
            </button>
            {/* Classwork List */}
            <div className="w-full mb-6">
              <h3 className="text-xl font-bold text-[#fde7c3] mb-2" style={{ fontFamily: 'Xanh Mono, monospace' }}>
                Classwork
              </h3>
              {classworkLoading ? (
                <div className="text-gray-300" style={{ fontFamily: 'Xanh Mono, monospace' }}>Loading classwork...</div>
              ) : classworkError ? (
                <div className="text-red-400" style={{ fontFamily: 'Xanh Mono, monospace' }}>{classworkError}</div>
              ) : classworks.length === 0 ? (
                <div className="text-gray-400" style={{ fontFamily: 'Xanh Mono, monospace' }}>No classwork found.</div>
              ) : (
                <ul className="flex flex-col gap-4">
                  {classworks.map((cw) => (
                    <li key={cw.id} className="bg-[#232323] rounded-lg p-4 border border-[#fde7c3] flex flex-col gap-2">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <span className="text-lg font-bold text-[#f5d7b7]" style={{ fontFamily: 'Xanh Mono, monospace' }}>{cw.title}</span>
                        {cw.created_at && (
                          <span className="text-sm text-[#fde7c3]" style={{ fontFamily: 'Xanh Mono, monospace' }}>
                            {new Date(cw.created_at).toLocaleString()}
                          </span>
                        )}
                      </div>
                      {cw.details && (
                        <div className="text-gray-300 text-sm" style={{ fontFamily: 'Xanh Mono, monospace' }}>{cw.details}</div>
                      )}
                      {cw.files && cw.files.length > 0 && (
                        <div className="flex flex-col gap-1 mt-2">
                          <span className="text-[#fde7c3] text-xs font-bold" style={{ fontFamily: 'Xanh Mono, monospace' }}>PDFs:</span>
                          <ul className="list-disc list-inside">
                            {cw.files.map((link: string, idx: number) => {
                              // Extract filename from URL
                              const filename = link.split('/').pop() || link;
                              return (
                                <li key={idx}>
                                  <a
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-300 underline"
                                    style={{ fontFamily: 'Xanh Mono, monospace' }}
                                    title={link}
                                  >
                                    {filename}
                                  </a>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Add Classwork Modal (Dialog) */}
            <Dialog.Root open={classworkOpen} onOpenChange={setClassworkOpen}>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/60 z-40" />
                <Dialog.Content className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#2d2d2d] rounded-xl p-8 w-full max-w-md shadow-lg flex flex-col gap-6 border border-[#fde7c3]">
                  <Dialog.Title className="text-2xl font-bold text-[#fde7c3] mb-2" style={{ fontFamily: 'Xanh Mono, monospace' }}>
                    Add Classwork
                  </Dialog.Title>
                  {/* Classwork Form */}
                  <form
                    className="flex flex-col gap-4"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setCwLoading(true);
                      setCwError("");
                      setCwSuccess("");
                      // Validate required fields
                      if (!cwTitle.trim()) {
                        setCwError("Title is required.");
                        setCwLoading(false);
                        return;
                      }
                      if (cwFiles.length === 0) {
                        setCwError("Please upload at least one PDF file.");
                        setCwLoading(false);
                        return;
                      }
                      try {
                        // Upload all PDFs and collect URLs
                        const urls = [];
                        for (const file of cwFiles) {
                          if (file.type !== 'application/pdf') {
                            setCwError("Only PDF files are allowed.");
                            setCwLoading(false);
                            return;
                          }
                          const url = await uploadPdf(file);
                          urls.push(url);
                        }
                        // Insert classwork entry into Supabase
                        const { error } = await supabase.from('classwork').insert([
                          {
                            title: cwTitle,
                            details: cwDetails,
                            files: urls,
                          },
                        ]);
                        if (error) {
                          setCwError(error.message);
                        } else {
                          setCwSuccess("Classwork added successfully!");
                          // Reset form fields
                          setCwTitle("");
                          setCwDetails("");
                          setCwFiles([]);
                          // Close modal after short delay
                          setTimeout(() => {
                            setClassworkOpen(false);
                            setCwSuccess("");
                          }, 1000);
                        }
                      } catch (err) {
                        if (err instanceof Error) {
                          setCwError(err.message);
                        } else {
                          setCwError("Unknown error");
                        }
                      } finally {
                        setCwLoading(false);
                      }
                    }}
                  >
                    {/* Title Input */}
                    <input
                      type="text"
                      placeholder="Title"
                      value={cwTitle}
                      onChange={e => setCwTitle(e.target.value)}
                      className="px-4 py-2 rounded bg-black border border-[#fde7c3] text-white focus:outline-none focus:ring-2 focus:ring-[#fde7c3]"
                      style={{ fontFamily: 'Xanh Mono, monospace' }}
                      required
                    />
                    {/* Details Input */}
                    <textarea
                      placeholder="Details"
                      value={cwDetails}
                      onChange={e => setCwDetails(e.target.value)}
                      className="px-4 py-2 rounded bg-black border border-[#fde7c3] text-white focus:outline-none focus:ring-2 focus:ring-[#fde7c3] min-h-[80px]"
                      style={{ fontFamily: 'Xanh Mono, monospace' }}
                    />
                    {/* PDF File Upload */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[#fde7c3] font-bold" style={{ fontFamily: 'Xanh Mono, monospace' }}>
                        Upload PDF(s)
                      </label>
                      <input
                        type="file"
                        accept="application/pdf"
                        multiple
                        onChange={e => setCwFiles(e.target.files ? Array.from(e.target.files) : [])}
                        className="px-4 py-2 rounded bg-black border border-[#fde7c3] text-white focus:outline-none focus:ring-2 focus:ring-[#fde7c3]"
                        style={{ fontFamily: 'Xanh Mono, monospace' }}
                      />
                      {cwFiles.length > 0 && (
                        <ul className="text-xs text-[#fde7c3] mt-1" style={{ fontFamily: 'Xanh Mono, monospace' }}>
                          {cwFiles.map((file, idx) => (
                            <li key={idx}>{file.name}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                    {/* Modal Actions */}
                    <div className="flex gap-4 justify-end mt-4">
                      <button
                        type="button"
                        onClick={() => setClassworkOpen(false)}
                        className="bg-gray-700 text-white font-bold px-4 py-2 rounded-full hover:bg-gray-600"
                        style={{ fontFamily: 'Xanh Mono, monospace' }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-[#fde7c3] text-[#7a6a58] font-bold px-4 py-2 rounded-full hover:bg-[#f5d7b7] disabled:opacity-60"
                        style={{ fontFamily: 'Xanh Mono, monospace' }}
                        disabled={cwLoading || cwFiles.length === 0}
                      >
                        {cwLoading ? "Adding..." : "Add Classwork"}
                      </button>
                    </div>
                    {/* Error/Success Feedback */}
                    {cwError && (
                      <div className="text-red-400 text-sm mt-2" style={{ fontFamily: 'Xanh Mono, monospace' }}>{cwError}</div>
                    )}
                    {cwSuccess && (
                      <div className="text-green-400 text-sm mt-2" style={{ fontFamily: 'Xanh Mono, monospace' }}>{cwSuccess}</div>
                    )}
                  </form>
                  <Dialog.Close asChild>
                    <button
                      className="absolute top-2 right-2 text-[#fde7c3] text-2xl font-bold hover:text-[#f5d7b7]"
                      aria-label="Close"
                      style={{ fontFamily: 'Xanh Mono, monospace' }}
                    >
                      ×
                    </button>
                  </Dialog.Close>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </>
        )}
        {/* Add Assignment Modal (Dialog) */}
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/60 z-40" />
            <Dialog.Content className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#2d2d2d] rounded-xl p-8 w-full max-w-md shadow-lg flex flex-col gap-6 border border-[#fde7c3]">
              <Dialog.Title className="text-2xl font-bold text-[#fde7c3] mb-2" style={{ fontFamily: 'Xanh Mono, monospace' }}>
                Add Assignment
              </Dialog.Title>
              {/* Assignment Form */}
              <form
                className="flex flex-col gap-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setLoading(true);
                  setSubmitError("");
                  setSubmitSuccess("");
                  // Validate required fields
                  if (!title.trim()) {
                    setSubmitError("Title is required.");
                    setLoading(false);
                    return;
                  }
                  if (files.some((f) => !f.trim())) {
                    setSubmitError("All file links must be filled.");
                    setLoading(false);
                    return;
                  }
                  try {
                    // Insert assignment into Supabase
                    const { error } = await supabase.from("assignments").insert([
                      {
                        title,
                        details,
                        deadline: deadline ? new Date(deadline).toISOString() : null,
                        files,
                      },
                    ]);
                    if (error) {
                      setSubmitError(error.message);
                    } else {
                      setSubmitSuccess("Assignment added successfully!");
                      // Reset form fields
                      setTitle("");
                      setDetails("");
                      setDeadline("");
                      setFiles([""]);
                      // Close modal after short delay
                      setTimeout(() => {
                        setOpen(false);
                        setSubmitSuccess("");
                      }, 1000);
                    }
                  } catch (err) {
                    if (err instanceof Error) {
                      setSubmitError(err.message);
                    } else {
                      setSubmitError("Unknown error");
                    }
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                {/* Title Input */}
                <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="px-4 py-2 rounded bg-black border border-[#fde7c3] text-white focus:outline-none focus:ring-2 focus:ring-[#fde7c3]"
                  style={{ fontFamily: 'Xanh Mono, monospace' }}
                  required
                />
                {/* Details Input */}
                <textarea
                  placeholder="Details"
                  value={details}
                  onChange={e => setDetails(e.target.value)}
                  className="px-4 py-2 rounded bg-black border border-[#fde7c3] text-white focus:outline-none focus:ring-2 focus:ring-[#fde7c3] min-h-[80px]"
                  style={{ fontFamily: 'Xanh Mono, monospace' }}
                />
                {/* Deadline Input */}
                <input
                  type="datetime-local"
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                  className="px-4 py-2 rounded bg-black border border-[#fde7c3] text-white focus:outline-none focus:ring-2 focus:ring-[#fde7c3]"
                  style={{ fontFamily: 'Xanh Mono, monospace' }}
                />
                {/* Files (Links) Inputs */}
                <div className="flex flex-col gap-2">
                  <label className="text-[#fde7c3] font-bold" style={{ fontFamily: 'Xanh Mono, monospace' }}>
                    Files (Links)
                  </label>
                  {files.map((file, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="url"
                        placeholder={`File Link #${idx + 1}`}
                        value={file}
                        onChange={e => handleFileChange(idx, e.target.value)}
                        className="px-4 py-2 rounded bg-black border border-[#fde7c3] text-white focus:outline-none focus:ring-2 focus:ring-[#fde7c3] flex-1"
                        style={{ fontFamily: 'Xanh Mono, monospace' }}
                        required
                      />
                      {files.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(idx)}
                          className="text-red-400 px-2 py-1 rounded hover:bg-red-900"
                          style={{ fontFamily: 'Xanh Mono, monospace' }}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddFile}
                    className="bg-[#fde7c3] text-[#7a6a58] font-bold px-4 py-1 rounded-full mt-2 hover:bg-[#f5d7b7]"
                    style={{ fontFamily: 'Xanh Mono, monospace' }}
                  >
                    + Add File Link
                  </button>
                </div>
                {/* Modal Actions */}
                <div className="flex gap-4 justify-end mt-4">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="bg-gray-700 text-white font-bold px-4 py-2 rounded-full hover:bg-gray-600"
                    style={{ fontFamily: 'Xanh Mono, monospace' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#fde7c3] text-[#7a6a58] font-bold px-4 py-2 rounded-full hover:bg-[#f5d7b7] disabled:opacity-60"
                    style={{ fontFamily: 'Xanh Mono, monospace' }}
                    disabled={loading}
                  >
                    {loading ? "Adding..." : "Add Assignment"}
                  </button>
                </div>
                {/* Error/Success Feedback */}
                {submitError && (
                  <div className="text-red-400 text-sm mt-2" style={{ fontFamily: 'Xanh Mono, monospace' }}>{submitError}</div>
                )}
                {submitSuccess && (
                  <div className="text-green-400 text-sm mt-2" style={{ fontFamily: 'Xanh Mono, monospace' }}>{submitSuccess}</div>
                )}
              </form>
              <Dialog.Close asChild>
                <button
                  className="absolute top-2 right-2 text-[#fde7c3] text-2xl font-bold hover:text-[#f5d7b7]"
                  aria-label="Close"
                  style={{ fontFamily: 'Xanh Mono, monospace' }}
                >
                  ×
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
        {/* Example: Add more admin features below */}
      </div>
    </div>
  );
}
