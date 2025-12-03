import type { AdminStats } from '../../services/admin';

interface AdminStatsOverviewProps {
  stats: AdminStats;
}

export default function AdminStatsOverview({ stats }: AdminStatsOverviewProps) {
  return (
    <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
        <div className="text-sm text-slate-400 mb-1">Total Users</div>
        <div className="text-3xl font-bold text-sky-400">{stats.totalUsers}</div>
      </div>
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
        <div className="text-sm text-slate-400 mb-1">Verified</div>
        <div className="text-3xl font-bold text-emerald-400">{stats.verifiedUsers}</div>
        <div className="text-xs text-slate-500 mt-1">
          {stats.totalUsers > 0 
            ? Math.round((stats.verifiedUsers / stats.totalUsers) * 100) 
            : 0}%
        </div>
      </div>
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
        <div className="text-sm text-slate-400 mb-1">Unverified</div>
        <div className="text-3xl font-bold text-yellow-400">{stats.unverifiedUsers}</div>
      </div>
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
        <div className="text-sm text-slate-400 mb-1">With Progress</div>
        <div className="text-3xl font-bold text-purple-400">{stats.usersWithProgress}</div>
        <div className="text-xs text-slate-500 mt-1">
          {stats.totalUsers > 0 
            ? Math.round((stats.usersWithProgress / stats.totalUsers) * 100) 
            : 0}% active
        </div>
      </div>
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
        <div className="text-sm text-slate-400 mb-1">Recent (7 days)</div>
        <div className="text-3xl font-bold text-pink-400">{stats.recentSignups}</div>
      </div>
    </div>
  );
}

