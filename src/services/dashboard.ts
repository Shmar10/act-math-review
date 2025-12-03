import { supabase } from '../lib/supabase';
import type { ActQuestion } from '../types';

export interface DashboardStats {
  totalQuestions: number;
  totalAnswered: number;
  totalCorrect: number;
  totalWrong: number;
  overallAccuracy: number;
  byTopic: TopicStats[];
  byDifficulty: DifficultyStats[];
}

export interface TopicStats {
  topic: string;
  total: number;
  correct: number;
  wrong: number;
  accuracy: number;
}

export interface DifficultyStats {
  difficulty: number;
  total: number;
  correct: number;
  wrong: number;
  accuracy: number;
}

/**
 * Get dashboard statistics for a user
 */
export async function getDashboardStats(
  userId: string,
  allQuestions: ActQuestion[]
): Promise<DashboardStats> {
  try {
    // Get user progress from database
    const { data: progressData, error } = await supabase
      .from('user_progress')
      .select('question_id, correct_count, wrong_count')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching progress:', error);
      return getEmptyStats();
    }

    // Create a map of question progress
    const progressMap = new Map<string, { correct: number; wrong: number }>();
    progressData?.forEach((row) => {
      progressMap.set(row.question_id, {
        correct: row.correct_count,
        wrong: row.wrong_count,
      });
    });

    // Calculate statistics
    let totalAnswered = 0;
    let totalCorrect = 0;
    let totalWrong = 0;

    // Group by topic
    const topicMap = new Map<string, { total: number; correct: number; wrong: number }>();
    // Group by difficulty
    const difficultyMap = new Map<number, { total: number; correct: number; wrong: number }>();

    allQuestions.forEach((question) => {
      const progress = progressMap.get(question.id);
      const answered = progress ? progress.correct + progress.wrong : 0;
      const correct = progress?.correct || 0;
      const wrong = progress?.wrong || 0;

      if (answered > 0) {
        totalAnswered++;
        totalCorrect += correct;
        totalWrong += wrong;
      }

      // Track by topic
      if (!topicMap.has(question.topic)) {
        topicMap.set(question.topic, { total: 0, correct: 0, wrong: 0 });
      }
      const topicStats = topicMap.get(question.topic)!;
      topicStats.total++;
      topicStats.correct += correct;
      topicStats.wrong += wrong;

      // Track by difficulty
      if (!difficultyMap.has(question.diff)) {
        difficultyMap.set(question.diff, { total: 0, correct: 0, wrong: 0 });
      }
      const diffStats = difficultyMap.get(question.diff)!;
      diffStats.total++;
      diffStats.correct += correct;
      diffStats.wrong += wrong;
    });

    // Convert maps to arrays
    const byTopic: TopicStats[] = Array.from(topicMap.entries())
      .map(([topic, stats]) => ({
        topic,
        total: stats.total,
        correct: stats.correct,
        wrong: stats.wrong,
        accuracy: stats.correct + stats.wrong > 0
          ? Math.round((stats.correct / (stats.correct + stats.wrong)) * 100)
          : 0,
      }))
      .sort((a, b) => b.accuracy - a.accuracy);

    const byDifficulty: DifficultyStats[] = Array.from(difficultyMap.entries())
      .map(([difficulty, stats]) => ({
        difficulty: Number(difficulty),
        total: stats.total,
        correct: stats.correct,
        wrong: stats.wrong,
        accuracy: stats.correct + stats.wrong > 0
          ? Math.round((stats.correct / (stats.correct + stats.wrong)) * 100)
          : 0,
      }))
      .sort((a, b) => a.difficulty - b.difficulty);

    const overallAccuracy = totalCorrect + totalWrong > 0
      ? Math.round((totalCorrect / (totalCorrect + totalWrong)) * 100)
      : 0;

    return {
      totalQuestions: allQuestions.length,
      totalAnswered,
      totalCorrect,
      totalWrong,
      overallAccuracy,
      byTopic,
      byDifficulty,
    };
  } catch (err) {
    console.error('Error in getDashboardStats:', err);
    return getEmptyStats();
  }
}

function getEmptyStats(): DashboardStats {
  return {
    totalQuestions: 0,
    totalAnswered: 0,
    totalCorrect: 0,
    totalWrong: 0,
    overallAccuracy: 0,
    byTopic: [],
    byDifficulty: [],
  };
}

