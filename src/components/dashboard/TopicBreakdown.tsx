import type { DashboardStats } from '../../services/dashboard';

interface TopicBreakdownProps {
  stats: DashboardStats;
}

export default function TopicBreakdown({ stats }: TopicBreakdownProps) {
  const topicsWithProgress = stats.byTopic.filter(t => t.correct + t.wrong > 0);

  if (topicsWithProgress.length === 0) {
    return (
      <div className="bg-slate-800/70 rounded-2xl p-8 border border-slate-700 mb-6">
        <h2 className="text-2xl font-bold text-slate-100 mb-4">Performance by Topic</h2>
        <p className="text-slate-400">Start practicing to see your progress by topic!</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/70 rounded-2xl p-8 border border-slate-700 mb-6">
      <h2 className="text-2xl font-bold text-slate-100 mb-6">Performance by Topic</h2>
      
      <div className="space-y-4">
        {topicsWithProgress.map((topic) => {
          const totalAnswered = topic.correct + topic.wrong;
          const accuracyColor = topic.accuracy >= 80
            ? 'text-emerald-400'
            : topic.accuracy >= 60
            ? 'text-yellow-400'
            : 'text-rose-400';

          return (
            <div
              key={topic.topic}
              className="bg-slate-900/50 rounded-xl p-4 border border-slate-700"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1">
                  <div className="text-lg font-semibold text-slate-100 mb-1">
                    {topic.topic}
                  </div>
                  <div className="text-sm text-slate-400">
                    {totalAnswered} questions answered
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${accuracyColor}`}>
                    {topic.accuracy}%
                  </div>
                  <div className="text-xs text-slate-500">
                    {topic.correct} / {totalAnswered}
                  </div>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-slate-700 rounded-full h-2 mt-3">
                <div
                  className={`h-2 rounded-full transition-all ${
                    topic.accuracy >= 80
                      ? 'bg-emerald-500'
                      : topic.accuracy >= 60
                      ? 'bg-yellow-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${topic.accuracy}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

