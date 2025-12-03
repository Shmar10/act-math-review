import { useState, useEffect } from 'react';
import { User, Session, AuthError as SupabaseAuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { RegisterData, LoginData, AuthError } from '../types/user';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  });

  // Check for existing session on mount
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      setAuthState({
        user: session?.user ?? null,
        session: session,
        loading: false,
        error: error ? { message: error.message } : null,
      });
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthState({
        user: session?.user ?? null,
        session: session,
        loading: false,
        error: null,
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  const register = async (data: RegisterData): Promise<{ error: AuthError | null }> => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));

      // Check if Supabase is configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || 
          supabaseUrl === 'https://placeholder.supabase.co' ||
          supabaseKey === 'placeholder-key') {
        const authError: AuthError = {
          message: 'Supabase is not configured. Please check your .env file and restart the dev server.',
        };
        setAuthState((prev) => ({ ...prev, loading: false, error: authError }));
        return { error: authError };
      }

      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.first_name,
            last_name: data.last_name,
          },
          emailRedirectTo: `${window.location.origin}${window.location.pathname.includes('/act-math-review') ? '/act-math-review' : ''}/auth/verify`,
        },
      });

      if (error) {
        const authError: AuthError = {
          message: error.message,
          status: error.status,
        };
        setAuthState((prev) => ({ ...prev, loading: false, error: authError }));
        return { error: authError };
      }

      setAuthState((prev) => ({
        ...prev,
        user: authData.user,
        session: authData.session,
        loading: false,
        error: null,
      }));

      return { error: null };
    } catch (err) {
      let errorMessage = 'An unexpected error occurred';
      
      if (err instanceof TypeError && err.message.includes('fetch')) {
        // Check for specific network error patterns
        const errorStr = err.toString().toLowerCase();
        const isNetworkError = errorStr.includes('failed to fetch') || 
                              errorStr.includes('networkerror') ||
                              errorStr.includes('network request failed');
        
        if (isNetworkError) {
          errorMessage = 'Network connection failed. This often happens on school/work networks that block external services.\n\n' +
            'Solutions:\n' +
            '• Try using a mobile hotspot or home network\n' +
            '• Contact your IT department to whitelist Supabase\n' +
            '• Use a VPN (if allowed by your network)\n' +
            '• Check if your firewall/antivirus is blocking the connection';
        } else {
          errorMessage = 'Failed to connect to Supabase. Please check:\n' +
            '1. Your Supabase URL is correct in .env file\n' +
            '2. Your internet connection\n' +
            '3. Supabase project is active';
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      const authError: AuthError = {
        message: errorMessage,
      };
      setAuthState((prev) => ({ ...prev, loading: false, error: authError }));
      return { error: authError };
    }
  };

  const login = async (data: LoginData): Promise<{ error: AuthError | null }> => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));

      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        const authError: AuthError = {
          message: error.message,
          status: error.status,
        };
        setAuthState((prev) => ({ ...prev, loading: false, error: authError }));
        return { error: authError };
      }

      setAuthState((prev) => ({
        ...prev,
        user: authData.user,
        session: authData.session,
        loading: false,
        error: null,
      }));

      return { error: null };
    } catch (err) {
      let errorMessage = 'An unexpected error occurred';
      
      if (err instanceof TypeError && err.message.includes('fetch')) {
        const errorStr = err.toString().toLowerCase();
        const isNetworkError = errorStr.includes('failed to fetch') || 
                              errorStr.includes('networkerror') ||
                              errorStr.includes('network request failed');
        
        if (isNetworkError) {
          errorMessage = 'Network connection failed. This often happens on school/work networks that block external services.\n\n' +
            'Solutions:\n' +
            '• Try using a mobile hotspot or home network\n' +
            '• Contact your IT department to whitelist Supabase\n' +
            '• Use a VPN (if allowed by your network)';
        } else {
          errorMessage = 'Failed to connect. Please check your internet connection and try again.';
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      const authError: AuthError = {
        message: errorMessage,
      };
      setAuthState((prev) => ({ ...prev, loading: false, error: authError }));
      return { error: authError };
    }
  };

  const logout = async (): Promise<{ error: AuthError | null }> => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));

      const { error } = await supabase.auth.signOut();

      if (error) {
        const authError: AuthError = {
          message: error.message,
          status: error.status,
        };
        setAuthState((prev) => ({ ...prev, loading: false, error: authError }));
        return { error: authError };
      }

      setAuthState({
        user: null,
        session: null,
        loading: false,
        error: null,
      });

      return { error: null };
    } catch (err) {
      const authError: AuthError = {
        message: err instanceof Error ? err.message : 'An unexpected error occurred',
      };
      setAuthState((prev) => ({ ...prev, loading: false, error: authError }));
      return { error: authError };
    }
  };

  const resendVerificationEmail = async (email: string): Promise<{ error: AuthError | null }> => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}${window.location.pathname.includes('/act-math-review') ? '/act-math-review' : ''}/auth/verify`,
        },
      });

      if (error) {
        return { error: { message: error.message, status: error.status } };
      }

      return { error: null };
    } catch (err) {
      return {
        error: {
          message: err instanceof Error ? err.message : 'An unexpected error occurred',
        },
      };
    }
  };

  return {
    user: authState.user,
    session: authState.session,
    loading: authState.loading,
    error: authState.error,
    register,
    login,
    logout,
    resendVerificationEmail,
    isAuthenticated: !!authState.user,
  };
}

