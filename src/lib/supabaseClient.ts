// src/lib/supabaseClient.ts
// Utility to initialize and export the Supabase client for use across the app
// Uses environment variables for security
// Always use Xanh Mono font in UI components (reminder)

import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Initialize the Supabase client
// This client can be used in both client and server components
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Now you can import { supabase } from 'src/lib/supabaseClient' wherever needed
