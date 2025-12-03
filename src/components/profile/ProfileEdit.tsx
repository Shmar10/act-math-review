import { useState } from 'react';
import type { UserProfile } from '../../services/profile';

interface ProfileEditProps {
  profile: UserProfile;
  onSave: (updates: { first_name: string; last_name: string }) => Promise<boolean>;
  onCancel: () => void;
}

export default function ProfileEdit({ profile, onSave, onCancel }: ProfileEditProps) {
  const [formData, setFormData] = useState({
    first_name: profile.first_name,
    last_name: profile.last_name,
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.first_name.trim()) {
      errors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      errors.last_name = 'Last name is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);
    const success = await onSave({
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
    });
    setSaving(false);

    if (success) {
      // onSave will handle navigation back to view mode
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="bg-slate-800/70 rounded-2xl p-8 border border-slate-700">
      <h2 className="text-2xl font-bold text-slate-100 mb-6">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* First Name */}
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium text-slate-300 mb-1">
            First Name
          </label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg bg-slate-700 border ${
              validationErrors.first_name
                ? 'border-rose-500'
                : 'border-slate-600'
            } text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500`}
            disabled={saving}
          />
          {validationErrors.first_name && (
            <p className="mt-1 text-sm text-rose-400">{validationErrors.first_name}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="last_name" className="block text-sm font-medium text-slate-300 mb-1">
            Last Name
          </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg bg-slate-700 border ${
              validationErrors.last_name
                ? 'border-rose-500'
                : 'border-slate-600'
            } text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500`}
            disabled={saving}
          />
          {validationErrors.last_name && (
            <p className="mt-1 text-sm text-rose-400">{validationErrors.last_name}</p>
          )}
        </div>

        {/* Note about email */}
        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
          <p className="text-sm text-slate-400">
            <strong>Note:</strong> Email changes are not currently supported. Contact support if you need to change your email address.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold transition disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

