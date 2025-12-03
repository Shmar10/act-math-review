import { supabaseAdmin, isAdminClientAvailable } from '../lib/supabaseAdmin';

export interface AdminUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  last_sign_in_at: string | null;
  progress_count: number;
  total_correct: number;
  total_wrong: number;
}

export interface AdminStats {
  totalUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  usersWithProgress: number;
  recentSignups: number; // Last 7 days
}

/**
 * Get all users with their profiles and statistics
 */
export async function getAllUsers(): Promise<{ data: AdminUser[] | null; error: Error | null }> {
  if (!isAdminClientAvailable()) {
    return {
      data: null,
      error: new Error('Admin client not available. Service role key not configured.'),
    };
  }

  try {
    // Get all users from auth.users
    const { data: authUsers, error: authError } = await supabaseAdmin!.auth.admin.listUsers();

    if (authError) {
      return { data: null, error: new Error(authError.message) };
    }

    // Get all profiles
    const { data: profiles, error: profileError } = await supabaseAdmin!
      .from('user_profiles')
      .select('*');

    if (profileError) {
      return { data: null, error: new Error(profileError.message) };
    }

    // Get progress statistics for all users
    const { data: progressStats, error: progressError } = await supabaseAdmin!
      .from('user_progress')
      .select('user_id, correct_count, wrong_count');

    if (progressError) {
      console.warn('Error fetching progress stats:', progressError);
    }

    // Combine data
    const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
    const progressMap = new Map<string, { correct: number; wrong: number }>();

    progressStats?.forEach((p) => {
      const existing = progressMap.get(p.user_id) || { correct: 0, wrong: 0 };
      progressMap.set(p.user_id, {
        correct: existing.correct + (p.correct_count || 0),
        wrong: existing.wrong + (p.wrong_count || 0),
      });
    });

    const users: AdminUser[] = (authUsers?.users || []).map((user) => {
      const profile = profileMap.get(user.id);
      const progress = progressMap.get(user.id) || { correct: 0, wrong: 0 };

      return {
        id: user.id,
        email: user.email || '',
        first_name: profile?.first_name || '',
        last_name: profile?.last_name || '',
        email_verified: user.email_confirmed_at !== null,
        created_at: user.created_at,
        updated_at: profile?.updated_at || user.created_at,
        last_sign_in_at: user.last_sign_in_at || null,
        progress_count: (progress.correct + progress.wrong) > 0 ? 1 : 0,
        total_correct: progress.correct,
        total_wrong: progress.wrong,
      };
    });

    // Sort by created_at (newest first)
    users.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return { data: users, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error'),
    };
  }
}

/**
 * Get admin statistics
 */
export async function getAdminStats(): Promise<{ data: AdminStats | null; error: Error | null }> {
  if (!isAdminClientAvailable()) {
    return {
      data: null,
      error: new Error('Admin client not available. Service role key not configured.'),
    };
  }

  try {
    // Get all users
    const { data: users, error: usersError } = await getAllUsers();
    if (usersError || !users) {
      return { data: null, error: usersError || new Error('Failed to get users') };
    }

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const stats: AdminStats = {
      totalUsers: users.length,
      verifiedUsers: users.filter(u => u.email_verified).length,
      unverifiedUsers: users.filter(u => !u.email_verified).length,
      usersWithProgress: users.filter(u => u.progress_count > 0).length,
      recentSignups: users.filter(u => new Date(u.created_at) >= sevenDaysAgo).length,
    };

    return { data: stats, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error'),
    };
  }
}

/**
 * Delete a user (cascades to profile, progress, sessions)
 */
export async function deleteUser(userId: string): Promise<{ error: Error | null }> {
  if (!isAdminClientAvailable()) {
    return {
      error: new Error('Admin client not available. Service role key not configured.'),
    };
  }

  try {
    const { error } = await supabaseAdmin!.auth.admin.deleteUser(userId);

    if (error) {
      return { error: new Error(error.message) };
    }

    return { error: null };
  } catch (err) {
    return {
      error: err instanceof Error ? err : new Error('Unknown error'),
    };
  }
}

/**
 * Get user details including progress breakdown
 */
export async function getUserDetails(userId: string): Promise<{
  data: AdminUser | null;
  error: Error | null;
}> {
  if (!isAdminClientAvailable()) {
    return {
      data: null,
      error: new Error('Admin client not available. Service role key not configured.'),
    };
  }

  try {
    const { data: users, error } = await getAllUsers();
    if (error || !users) {
      return { data: null, error: error || new Error('Failed to get users') };
    }

    const user = users.find(u => u.id === userId);
    return { data: user || null, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error'),
    };
  }
}

