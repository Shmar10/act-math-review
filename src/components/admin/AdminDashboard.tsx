import { useState } from 'react';
import AdminReview from '../AdminReview';
import AdminUsers from './AdminUsers';

type TabType = 'review' | 'users';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('review');

  const handleLogout = () => {
    // Clear all admin authentication
    localStorage.removeItem("amr.admin.auth");
    localStorage.removeItem("amr.admin.users.auth");
    window.location.href = "/act-math-review/";
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header with Tabs */}
      <div className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-slate-400 text-sm">Developer/Admin Access</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 transition"
              title="Log out and return to main page"
            >
              🔒 Logout
            </button>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('review')}
              className={`px-4 py-2 rounded-lg transition ${
                activeTab === 'review'
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              🔍 Question Review
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-lg transition ${
                activeTab === 'users'
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              👥 User Management
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'review' && <AdminReview />}
        {activeTab === 'users' && <AdminUsers />}
      </div>
    </div>
  );
}

