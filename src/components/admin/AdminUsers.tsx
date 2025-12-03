import { useState, useEffect } from 'react';
import { getAllUsers, getAdminStats, deleteUser, type AdminUser, type AdminStats } from '../../services/admin';
import { isAdminClientAvailable } from '../../lib/supabaseAdmin';
import UserList from './UserList';
import AdminStatsOverview from './AdminStatsOverview';
import DeleteUserDialog from './DeleteUserDialog';

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVerified, setFilterVerified] = useState<'all' | 'verified' | 'unverified'>('all');
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!isAdminClientAvailable()) {
      setError('Admin client not configured. Please add VITE_SUPABASE_SERVICE_ROLE_KEY to your .env file.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [usersResult, statsResult] = await Promise.all([
        getAllUsers(),
        getAdminStats(),
      ]);

      if (usersResult.error) {
        setError(usersResult.error.message);
      } else {
        setUsers(usersResult.data || []);
      }

      if (statsResult.error) {
        console.error('Error loading stats:', statsResult.error);
      } else {
        setStats(statsResult.data || null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (user: AdminUser) => {
    setUserToDelete(user);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    setDeleting(true);
    const result = await deleteUser(userToDelete.id);

    if (result.error) {
      alert(`Error deleting user: ${result.error.message}`);
    } else {
      // Reload data
      await loadData();
      setUserToDelete(null);
    }

    setDeleting(false);
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = 
      filterVerified === 'all' ||
      (filterVerified === 'verified' && user.email_verified) ||
      (filterVerified === 'unverified' && !user.email_verified);

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen px-6 py-8 bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-4">Loading users...</div>
          <div className="text-slate-400">Please wait</div>
        </div>
      </div>
    );
  }

  if (error && !isAdminClientAvailable()) {
    return (
      <div className="min-h-screen px-6 py-8 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-rose-900/30 border border-rose-500 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-rose-400">Admin Client Not Configured</h2>
            <p className="text-slate-300 mb-4">{error}</p>
            <div className="bg-slate-800 rounded-lg p-4">
              <p className="text-sm text-slate-300 mb-2">To enable user management:</p>
              <ol className="text-sm text-slate-400 list-decimal list-inside space-y-1">
                <li>Go to Supabase Dashboard → Settings → API</li>
                <li>Copy the <code className="bg-slate-700 px-1 rounded">service_role</code> key</li>
                <li>Add to your <code className="bg-slate-700 px-1 rounded">.env</code> file:</li>
              </ol>
              <pre className="mt-2 text-xs bg-slate-900 p-2 rounded">
                VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
              </pre>
              <p className="text-xs text-slate-500 mt-2">
                ⚠️ Keep this key secret! Never commit it to git.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-8 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">User Management</h1>
            <p className="text-slate-400">
              Manage user accounts and view statistics
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                localStorage.removeItem("amr.admin.users.auth");
                window.location.href = "/";
              }}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500"
              title="Log out and return to main page"
            >
              🔒 Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-rose-900/30 border border-rose-500 rounded-lg p-4">
            <p className="text-rose-300">{error}</p>
            <button
              onClick={loadData}
              className="mt-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-sm"
            >
              Retry
            </button>
          </div>
        )}

        {/* Stats Overview */}
        {stats && <AdminStatsOverview stats={stats} />}

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4 items-center p-4 bg-slate-800 rounded-lg">
          <label className="text-slate-300 flex-1 min-w-[200px]">
            Search:
            <input
              type="text"
              className="ml-2 w-full rounded-lg bg-slate-700 border border-slate-600 px-3 py-2 text-white"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </label>
          <label className="text-slate-300">
            Filter:
            <select
              className="ml-2 rounded-lg bg-slate-700 border border-slate-600 px-3 py-2 text-white"
              value={filterVerified}
              onChange={(e) => setFilterVerified(e.target.value as 'all' | 'verified' | 'unverified')}
            >
              <option value="all">All Users</option>
              <option value="verified">Verified Only</option>
              <option value="unverified">Unverified Only</option>
            </select>
          </label>
          <button
            onClick={loadData}
            className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500"
          >
            🔄 Refresh
          </button>
        </div>

        {/* User List */}
        <UserList
          users={filteredUsers}
          onDelete={handleDelete}
        />

        {/* Delete Confirmation Dialog */}
        {userToDelete && (
          <DeleteUserDialog
            user={userToDelete}
            onConfirm={confirmDelete}
            onCancel={() => setUserToDelete(null)}
            deleting={deleting}
          />
        )}
      </div>
    </div>
  );
}

