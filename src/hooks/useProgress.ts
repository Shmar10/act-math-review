import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { getUserProgress, updateProgress, syncProgress, mergeProgress } from '../services/progress';
import type { ProgressMap } from '../types.progress';
import useLocalStorage from './useLocalStorage';

/**
 * Hook to manage user progress with server-side syncing
 * Falls back to localStorage when offline or not authenticated
 */
export function useProgress() {
  const { user, isAuthenticated } = useAuth();
  const [localProgress, setLocalProgress] = useLocalStorage<ProgressMap>('amr.progress', {});
  const [serverProgress, setServerProgress] = useState<ProgressMap>({});
  const [syncing, setSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [migrated, setMigrated] = useState(false);

  // Load progress from server on login
  useEffect(() => {
    if (isAuthenticated && user && !migrated) {
      loadServerProgress();
    }
  }, [isAuthenticated, user, migrated]);

  // Auto-sync every 30 seconds when authenticated
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const interval = setInterval(() => {
      syncToServer();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated, user, localProgress]);

  const loadServerProgress = async () => {
    if (!user) return;

    try {
      setSyncing(true);
      const server = await getUserProgress(user.id);
      setServerProgress(server);

      // Merge with local progress (server wins conflicts)
      const merged = mergeProgress(localProgress, server);
      setLocalProgress(merged);

      // If we had local progress that wasn't on server, sync it
      const hasLocalOnly = Object.keys(localProgress).some(
        (id) => !server[id] && localProgress[id].correct + localProgress[id].wrong > 0
      );

      if (hasLocalOnly) {
        await syncToServer();
      }

      setMigrated(true);
      setLastSynced(new Date());
    } catch (err) {
      console.error('Error loading server progress:', err);
    } finally {
      setSyncing(false);
    }
  };

  const syncToServer = async () => {
    if (!user || !isAuthenticated) return;

    try {
      setSyncing(true);
      const result = await syncProgress(user.id, localProgress);
      
      if (!result.error) {
        setLastSynced(new Date());
        // Reload from server to get any updates
        const server = await getUserProgress(user.id);
        setServerProgress(server);
      }
    } catch (err) {
      console.error('Error syncing progress:', err);
    } finally {
      setSyncing(false);
    }
  };

  const updateQuestionProgress = useCallback(
    async (questionId: string, correct: boolean) => {
      // Update local progress immediately (optimistic update)
      setLocalProgress((prev) => {
        const current = prev[questionId] || { correct: 0, wrong: 0, lastAt: 0 };
        return {
          ...prev,
          [questionId]: {
            correct: current.correct + (correct ? 1 : 0),
            wrong: current.wrong + (correct ? 0 : 1),
            lastAt: Date.now(),
          },
        };
      });

      // Update server if authenticated
      if (isAuthenticated && user) {
        try {
          await updateProgress(user.id, questionId, correct);
          setLastSynced(new Date());
        } catch (err) {
          console.error('Error updating server progress:', err);
          // Progress is still saved locally, will sync later
        }
      }
    },
    [isAuthenticated, user, setLocalProgress]
  );

  // Get combined progress (server + local)
  const progress = mergeProgress(localProgress, serverProgress);

  return {
    progress,
    updateProgress: updateQuestionProgress,
    syncToServer,
    syncing,
    lastSynced,
    isOnline: isAuthenticated,
  };
}

