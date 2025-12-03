import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getUserProfile, updateUserProfile, changePassword, type UserProfile } from '../../services/profile';
import ProfileView from './ProfileView';
import ProfileEdit from './ProfileEdit';
import ChangePassword from './ChangePassword';

interface ProfilePageProps {
  onClose?: () => void;
}

type ViewMode = 'view' | 'edit' | 'password';

export default function ProfilePage({ onClose }: ProfilePageProps) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('view');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      const { data, error: profileError } = await getUserProfile(user.id);
      if (profileError) {
        setError(profileError.message);
      } else {
        setProfile(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (updates: { first_name: string; last_name: string }) => {
    if (!user) return;

    setError(null);
    const { error: updateError } = await updateUserProfile(user.id, updates);
    
    if (updateError) {
      setError(updateError.message);
      return false;
    }

    // Reload profile and switch back to view mode
    await loadProfile();
    setViewMode('view');
    return true;
  };

  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    setError(null);
    const { error: passwordError } = await changePassword(currentPassword, newPassword);
    
    if (passwordError) {
      setError(passwordError.message);
      return false;
    }

    setViewMode('view');
    return true;
  };

  if (loading) {
    return (
      <div className="min-h-screen px-6 py-8 bg-slate-900">
        <div className="mx-auto max-w-4xl">
          <div className="text-center text-slate-300">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!profile && !error) {
    return (
      <div className="min-h-screen px-6 py-8 bg-slate-900">
        <div className="mx-auto max-w-4xl">
          <div className="text-center text-slate-300">Profile not found.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-8 bg-slate-900">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-100 mb-2">Profile</h1>
            <p className="text-slate-400">Manage your account settings</p>
          </div>
          {onClose && (
            <button
              onClick={() => {
                const url = new URL(window.location.href);
                url.searchParams.delete('profile');
                window.location.href = url.pathname + url.search;
              }}
              className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300"
            >
              Close
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-rose-900/30 border border-rose-500 rounded-lg p-4 mb-6">
            <p className="text-sm text-rose-300">{error}</p>
          </div>
        )}

        {/* View Mode */}
        {viewMode === 'view' && profile && (
          <ProfileView
            profile={profile}
            onEdit={() => setViewMode('edit')}
            onChangePassword={() => setViewMode('password')}
          />
        )}

        {/* Edit Mode */}
        {viewMode === 'edit' && profile && (
          <ProfileEdit
            profile={profile}
            onSave={handleUpdateProfile}
            onCancel={() => setViewMode('view')}
          />
        )}

        {/* Change Password Mode */}
        {viewMode === 'password' && (
          <ChangePassword
            onSave={handleChangePassword}
            onCancel={() => setViewMode('view')}
          />
        )}
      </div>
    </div>
  );
}

