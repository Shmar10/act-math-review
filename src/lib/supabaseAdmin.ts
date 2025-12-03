import { createClient } from '@supabase/supabase-js';

/**
 * Admin Supabase Client
 * 
 * This client uses the service role key for admin operations.
 * It bypasses Row Level Security (RLS) to allow admin access.
 * 
 * SECURITY: This should ONLY be used in admin context, never exposed to regular users.
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

// Only create admin client if service role key is available
export const supabaseAdmin = supabaseServiceRoleKey && supabaseUrl
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

// Check if admin client is available
export function isAdminClientAvailable(): boolean {
  return supabaseAdmin !== null;
}

