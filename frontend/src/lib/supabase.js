import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Get current session token for API calls.
 */
export async function getAccessToken() {
  const { data } = await supabase.auth.getSession();
  return data?.session?.access_token || null;
}

/**
 * Sign in with email and password.
 */
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

/**
 * Sign up with email, password, and user metadata.
 */
export async function signUp(email, password, metadata = {}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: metadata },
  });
  if (error) throw error;
  return data;
}

/**
 * Sign out.
 */
export async function signOut() {
  await supabase.auth.signOut();
}

/**
 * Get current user.
 */
export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
}
