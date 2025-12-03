import type { AdminUser } from '../../services/admin';

interface DeleteUserDialogProps {
  user: AdminUser;
  onConfirm: () => void;
  onCancel: () => void;
  deleting: boolean;
}

export default function DeleteUserDialog({
  user,
  onConfirm,
  onCancel,
  deleting,
}: DeleteUserDialogProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4 text-rose-400">Delete User Account</h2>
        
        <div className="mb-6">
          <p className="text-slate-300 mb-4">
            Are you sure you want to delete this user account? This action cannot be undone.
          </p>
          
          <div className="bg-slate-900 rounded-lg p-4 mb-4">
            <div className="text-slate-100 font-medium mb-2">
              {user.first_name} {user.last_name}
            </div>
            <div className="text-slate-400 text-sm mb-1">{user.email}</div>
            <div className="text-slate-500 text-xs">
              Joined: {new Date(user.created_at).toLocaleDateString()}
            </div>
            {user.progress_count > 0 && (
              <div className="text-slate-500 text-xs mt-1">
                Has {user.total_correct + user.total_wrong} progress entries
              </div>
            )}
          </div>

          <div className="bg-rose-900/20 border border-rose-500/50 rounded-lg p-3">
            <p className="text-rose-300 text-sm">
              ⚠️ This will permanently delete:
            </p>
            <ul className="text-rose-200 text-xs mt-2 list-disc list-inside space-y-1">
              <li>User account and authentication</li>
              <li>User profile</li>
              <li>All progress data</li>
              <li>All practice sessions</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="flex-1 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white"
          >
            {deleting ? 'Deleting...' : 'Delete User'}
          </button>
        </div>
      </div>
    </div>
  );
}

