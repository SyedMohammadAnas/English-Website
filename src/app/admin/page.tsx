"use client";
import React, { useState } from "react";

// Admin password (for demo purposes, in production use env vars and server-side auth)
const ADMIN_PASSWORD = "admin123";

export default function AdminPage() {
  // State to track password input and access
  const [input, setInput] = useState("");
  const [access, setAccess] = useState(false);
  const [error, setError] = useState("");

  // Handle password form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === ADMIN_PASSWORD) {
      setAccess(true);
      setError("");
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#2d2d2d] px-4">
      {/* Admin Dashboard Content */}
      <div className="bg-black rounded-xl shadow-lg p-8 w-full max-w-lg flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-6 text-[#f5d7b7]" style={{ fontFamily: 'Xanh Mono, monospace' }}>
          Admin Dashboard
        </h2>
        {/* Add your admin dashboard features/components here */}
        <p className="text-white mb-2" style={{ fontFamily: 'Xanh Mono, monospace' }}>
          Welcome, Admin! You now have access to the dashboard.
        </p>
        {/* Example: Add more admin features below */}
      </div>
    </div>
  );
}
