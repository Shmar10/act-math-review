import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useProgress } from '../../hooks/useProgress';
import { getDashboardStats, type DashboardStats } from '../../services/dashboard';
import type { ActQuestion } from '../../types';
import { BANKS } from '../../data/banks';
import StatsOverview from './StatsOverview';
import TopicBreakdown from './TopicBreakdown';
import DifficultyBreakdown from './DifficultyBreakdown';
import Footer from '../Footer';

interface DashboardProps {
  onClose?: () => void;
}

export default function Dashboard({ onClose }: DashboardProps) {
  const { user } = useAuth();
  const { progress } = useProgress();
  const [allQuestions, setAllQuestions] = useState<ActQuestion[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Load all questions
  useEffect(() => {
    const base = import.meta.env.BASE_URL;
    const promises = BANKS.map(bank =>
      fetch(`${base}content/questions/${bank.file}`)
        .then(r => r.json())
        .catch(err => {
          console.error(`Failed to load ${bank.file}:`, err);
          return [];
        })
    );
    Promise.all(promises).then(results => {
      const merged = results.flat();
      setAllQuestions(merged);
    });
  }, []);

  // Load dashboard stats
  useEffect(() => {
    if (user && allQuestions.length > 0) {
      loadStats();
    }
  }, [user, allQuestions.length]);

  const loadStats = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const dashboardStats = await getDashboardStats(user.id, allQuestions);
      setStats(dashboardStats);
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center text-slate-300">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center text-slate-300">Unable to load dashboard data.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-8 bg-slate-900">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-100 mb-2">Your Progress</h1>
            <p className="text-slate-400">Track your ACT Math practice performance</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300"
            >
              Close
            </button>
          )}
        </div>

        {/* Stats Overview */}
        <StatsOverview stats={stats} />

        {/* Topic Breakdown */}
        <TopicBreakdown stats={stats} />

        {/* Difficulty Breakdown */}
        <DifficultyBreakdown stats={stats} />
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

