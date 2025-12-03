import { supabase } from '../lib/supabase';

/**
 * Request password reset email
 */
export async function requestPasswordReset(email: string): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}${window.location.pathname.includes('/act-math-review') ? '/act-math-review' : ''}/auth/reset-password`,
    });

    if (error) {
      console.error('Error requesting password reset:', error);
      return { error: new Error(error.message) };
    }

    return { error: null };
  } catch (err) {
    console.error('Error in requestPasswordReset:', err);
    return { 
      error: err instanceof Error ? err : new Error('Unknown error') 
    };
  }
}

/**
 * Reset password with token from email
 */
export async function resetPassword(newPassword: string): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error('Error resetting password:', error);
      return { error: new Error(error.message) };
    }

    return { error: null };
  } catch (err) {
    console.error('Error in resetPassword:', err);
    return { 
      error: err instanceof Error ? err : new Error('Unknown error') 
    };
  }
}

