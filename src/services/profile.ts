import { supabase } from '../lib/supabase';

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Get user profile from database
 */
export async function getUserProfile(userId: string): Promise<{ data: UserProfile | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as UserProfile, error: null };
  } catch (err) {
    console.error('Error in getUserProfile:', err);
    return { 
      data: null, 
      error: err instanceof Error ? err : new Error('Unknown error') 
    };
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  updates: { first_name?: string; last_name?: string }
): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .update({
        first_name: updates.first_name,
        last_name: updates.last_name,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      console.error('Error updating profile:', error);
      return { error: new Error(error.message) };
    }

    // Also update auth user metadata
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        first_name: updates.first_name,
        last_name: updates.last_name,
      },
    });

    if (authError) {
      console.error('Error updating auth metadata:', authError);
      // Don't fail the whole operation if this fails
    }

    return { error: null };
  } catch (err) {
    console.error('Error in updateUserProfile:', err);
    return { 
      error: err instanceof Error ? err : new Error('Unknown error') 
    };
  }
}

/**
 * Change user password
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<{ error: Error | null }> {
  try {
    // First verify current password by trying to sign in
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
      return { error: new Error('User not found') };
    }

    // Verify current password
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (signInError) {
      return { error: new Error('Current password is incorrect') };
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      console.error('Error updating password:', updateError);
      return { error: new Error(updateError.message) };
    }

    return { error: null };
  } catch (err) {
    console.error('Error in changePassword:', err);
    return { 
      error: err instanceof Error ? err : new Error('Unknown error') 
    };
  }
}

