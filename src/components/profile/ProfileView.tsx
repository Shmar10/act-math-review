import type { UserProfile } from '../../services/profile';

interface ProfileViewProps {
  profile: UserProfile;
  onEdit: () => void;
  onChangePassword: () => void;
}

export default function ProfileView({ profile, onEdit, onChangePassword }: ProfileViewProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-slate-800/70 rounded-2xl p-8 border border-slate-700">
      <div className="space-y-6">
        {/* Name Section */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Name</label>
          <div className="text-xl text-slate-100">
            {profile.first_name} {profile.last_name}
          </div>
        </div>

        {/* Email Section */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
          <div className="flex items-center gap-2">
            <span className="text-xl text-slate-100">{profile.email}</span>
            {profile.email_verified ? (
              <span className="px-2 py-1 rounded-lg bg-emerald-900/30 border border-emerald-500 text-emerald-300 text-xs">
                ✓ Verified
              </span>
            ) : (
              <span className="px-2 py-1 rounded-lg bg-yellow-900/30 border border-yellow-500 text-yellow-300 text-xs">
                ⚠ Unverified
              </span>
            )}
          </div>
        </div>

        {/* Account Info */}
        <div className="pt-6 border-t border-slate-700">
          <h3 className="text-lg font-semibold text-slate-200 mb-4">Account Information</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Member Since</label>
              <div className="text-slate-300">{formatDate(profile.created_at)}</div>
            </div>
            {profile.updated_at !== profile.created_at && (
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Last Updated</label>
                <div className="text-slate-300">{formatDate(profile.updated_at)}</div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-6 border-t border-slate-700 flex gap-3">
          <button
            onClick={onEdit}
            className="px-6 py-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold transition"
          >
            Edit Profile
          </button>
          <button
            onClick={onChangePassword}
            className="px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold transition"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}

