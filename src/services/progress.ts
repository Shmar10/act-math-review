import { supabase } from '../lib/supabase';
import type { ProgressMap } from '../types.progress';

/**
 * Get all progress for the current user from Supabase
 */
export async function getUserProgress(userId: string): Promise<ProgressMap> {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('question_id, correct_count, wrong_count, last_attempt_at, last_correct')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching progress:', error);
      return {};
    }

    // Convert database format to ProgressMap format
    const progressMap: ProgressMap = {};
    data?.forEach((row) => {
      progressMap[row.question_id] = {
        correct: row.correct_count,
        wrong: row.wrong_count,
        lastAt: row.last_attempt_at ? new Date(row.last_attempt_at).getTime() : 0,
      };
    });

    return progressMap;
  } catch (err) {
    console.error('Error in getUserProgress:', err);
    return {};
  }
}

/**
 * Update progress for a single question
 */
export async function updateProgress(
  userId: string,
  questionId: string,
  correct: boolean
): Promise<{ error: Error | null }> {
  try {
    // Get current progress for this question
    const { data: existing } = await supabase
      .from('user_progress')
      .select('correct_count, wrong_count')
      .eq('user_id', userId)
      .eq('question_id', questionId)
      .single();

    const currentCorrect = existing?.correct_count || 0;
    const currentWrong = existing?.wrong_count || 0;

    // Calculate new values
    const newCorrect = correct ? currentCorrect + 1 : currentCorrect;
    const newWrong = correct ? currentWrong : currentWrong + 1;

    // Upsert (insert or update)
    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        question_id: questionId,
        correct_count: newCorrect,
        wrong_count: newWrong,
        last_attempt_at: new Date().toISOString(),
        last_correct: correct,
      }, {
        onConflict: 'user_id,question_id',
      });

    if (error) {
      console.error('Error updating progress:', error);
      return { error: new Error(error.message) };
    }

    return { error: null };
  } catch (err) {
    console.error('Error in updateProgress:', err);
    return { error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

/**
 * Sync multiple progress updates (batch)
 */
export async function syncProgress(
  userId: string,
  progress: ProgressMap
): Promise<{ error: Error | null; synced: number }> {
  try {
    const updates = Object.entries(progress).map(([questionId, stats]) => ({
      user_id: userId,
      question_id: questionId,
      correct_count: stats.correct,
      wrong_count: stats.wrong,
      last_attempt_at: stats.lastAt > 0 ? new Date(stats.lastAt).toISOString() : new Date().toISOString(),
      last_correct: stats.correct > stats.wrong, // Best guess if we don't have this info
    }));

    const { error } = await supabase
      .from('user_progress')
      .upsert(updates, {
        onConflict: 'user_id,question_id',
      });

    if (error) {
      console.error('Error syncing progress:', error);
      return { error: new Error(error.message), synced: 0 };
    }

    return { error: null, synced: updates.length };
  } catch (err) {
    console.error('Error in syncProgress:', err);
    return { 
      error: err instanceof Error ? err : new Error('Unknown error'),
      synced: 0 
    };
  }
}

/**
 * Merge local and server progress
 * Server values take precedence for conflicts
 */
export function mergeProgress(local: ProgressMap, server: ProgressMap): ProgressMap {
  const merged = { ...local };
  
  // Server values override local
  Object.entries(server).forEach(([questionId, stats]) => {
    merged[questionId] = stats;
  });

  return merged;
}

