import type { DashboardStats } from '../../services/dashboard';

interface DifficultyBreakdownProps {
  stats: DashboardStats;
}

export default function DifficultyBreakdown({ stats }: DifficultyBreakdownProps) {
  const difficultiesWithProgress = stats.byDifficulty.filter(d => d.correct + d.wrong > 0);

  if (difficultiesWithProgress.length === 0) {
    return (
      <div className="bg-slate-800/70 rounded-2xl p-8 border border-slate-700">
        <h2 className="text-2xl font-bold text-slate-100 mb-4">Performance by Difficulty</h2>
        <p className="text-slate-400">Start practicing to see your progress by difficulty level!</p>
      </div>
    );
  }

  const getDifficultyLabel = (diff: number) => {
    return '★'.repeat(diff) + '☆'.repeat(5 - diff);
  };

  return (
    <div className="bg-slate-800/70 rounded-2xl p-8 border border-slate-700">
      <h2 className="text-2xl font-bold text-slate-100 mb-6">Performance by Difficulty</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {difficultiesWithProgress.map((diff) => {
          const totalAnswered = diff.correct + diff.wrong;
          const accuracyColor = diff.accuracy >= 80
            ? 'text-emerald-400'
            : diff.accuracy >= 60
            ? 'text-yellow-400'
            : 'text-rose-400';

          return (
            <div
              key={diff.difficulty}
              className="bg-slate-900/50 rounded-xl p-4 border border-slate-700"
            >
              <div className="text-center">
                <div className="text-lg text-slate-300 mb-2">
                  {getDifficultyLabel(diff.difficulty)}
                </div>
                <div className={`text-3xl font-bold ${accuracyColor} mb-1`}>
                  {diff.accuracy}%
                </div>
                <div className="text-xs text-slate-400 mb-2">
                  {diff.correct} / {totalAnswered}
                </div>
                <div className="w-full bg-slate-700 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all ${
                      diff.accuracy >= 80
                        ? 'bg-emerald-500'
                        : diff.accuracy >= 60
                        ? 'bg-yellow-500'
                        : 'bg-rose-400'
                    }`}
                    style={{ width: `${diff.accuracy}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

