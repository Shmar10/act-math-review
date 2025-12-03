import { useState } from 'react';

interface ChangePasswordProps {
  onSave: (currentPassword: string, newPassword: string) => Promise<boolean>;
  onCancel: () => void;
}

export default function ChangePassword({ onSave, onCancel }: ChangePasswordProps) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }

    if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (formData.currentPassword === formData.newPassword) {
      errors.newPassword = 'New password must be different from current password';
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
    const success = await onSave(formData.currentPassword, formData.newPassword);
    setSaving(false);

    if (success) {
      // Clear form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
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
      <h2 className="text-2xl font-bold text-slate-100 mb-6">Change Password</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Password */}
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-300 mb-1">
            Current Password
          </label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg bg-slate-700 border ${
              validationErrors.currentPassword
                ? 'border-rose-500'
                : 'border-slate-600'
            } text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500`}
            placeholder="Enter your current password"
            disabled={saving}
            autoComplete="current-password"
          />
          {validationErrors.currentPassword && (
            <p className="mt-1 text-sm text-rose-400">{validationErrors.currentPassword}</p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-slate-300 mb-1">
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg bg-slate-700 border ${
              validationErrors.newPassword
                ? 'border-rose-500'
                : 'border-slate-600'
            } text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500`}
            placeholder="At least 8 characters"
            disabled={saving}
            autoComplete="new-password"
          />
          {validationErrors.newPassword && (
            <p className="mt-1 text-sm text-rose-400">{validationErrors.newPassword}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg bg-slate-700 border ${
              validationErrors.confirmPassword
                ? 'border-rose-500'
                : 'border-slate-600'
            } text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500`}
            placeholder="Re-enter your new password"
            disabled={saving}
            autoComplete="new-password"
          />
          {validationErrors.confirmPassword && (
            <p className="mt-1 text-sm text-rose-400">{validationErrors.confirmPassword}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Changing Password...' : 'Change Password'}
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

