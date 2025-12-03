import type { AdminUser } from '../../services/admin';

interface UserListProps {
  users: AdminUser[];
  onDelete: (user: AdminUser) => void;
}

export default function UserList({ users, onDelete }: UserListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        No users found matching your filters.
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-900">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Progress</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Joined</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-750">
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-100">
                    {user.first_name} {user.last_name}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-slate-300">{user.email}</div>
                </td>
                <td className="px-4 py-3">
                  {user.email_verified ? (
                    <span className="px-2 py-1 rounded-lg bg-emerald-900/30 border border-emerald-500 text-emerald-300 text-xs">
                      ✓ Verified
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded-lg bg-yellow-900/30 border border-yellow-500 text-yellow-300 text-xs">
                      ⚠ Unverified
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {user.progress_count > 0 ? (
                    <div className="text-sm text-slate-300">
                      <div className="text-emerald-400">
                        {user.total_correct} correct
                      </div>
                      <div className="text-rose-400">
                        {user.total_wrong} wrong
                      </div>
                    </div>
                  ) : (
                    <span className="text-slate-500 text-sm">No progress</span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-400 text-sm">
                  {formatDate(user.created_at)}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => onDelete(user)}
                    className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-sm text-white"
                    title="Delete user account"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-3 bg-slate-900 border-t border-slate-700 text-sm text-slate-400">
        Showing {users.length} user{users.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}

