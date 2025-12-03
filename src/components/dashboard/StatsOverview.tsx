import type { DashboardStats } from '../../services/dashboard';

interface StatsOverviewProps {
  stats: DashboardStats;
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  const progressPercent = stats.totalQuestions > 0
    ? Math.round((stats.totalAnswered / stats.totalQuestions) * 100)
    : 0;

  return (
    <div className="bg-slate-800/70 rounded-2xl p-8 border border-slate-700 mb-6">
      <h2 className="text-2xl font-bold text-slate-100 mb-6">Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Overall Accuracy */}
        <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700">
          <div className="text-sm text-slate-400 mb-2">Overall Accuracy</div>
          <div className="text-4xl font-bold text-emerald-400 mb-1">
            {stats.overallAccuracy}%
          </div>
          <div className="text-xs text-slate-500">
            {stats.totalCorrect} correct / {stats.totalCorrect + stats.totalWrong} answered
          </div>
        </div>

        {/* Total Answered */}
        <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700">
          <div className="text-sm text-slate-400 mb-2">Questions Answered</div>
          <div className="text-4xl font-bold text-sky-400 mb-1">
            {stats.totalAnswered}
          </div>
          <div className="text-xs text-slate-500">
            of {stats.totalQuestions} total
          </div>
        </div>

        {/* Progress */}
        <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700">
          <div className="text-sm text-slate-400 mb-2">Progress</div>
          <div className="text-4xl font-bold text-purple-400 mb-1">
            {progressPercent}%
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Total Correct */}
        <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700">
          <div className="text-sm text-slate-400 mb-2">Total Correct</div>
          <div className="text-4xl font-bold text-emerald-400 mb-1">
            {stats.totalCorrect}
          </div>
          <div className="text-xs text-slate-500">
            {stats.totalWrong} incorrect
          </div>
        </div>
      </div>
    </div>
  );
}

