import { useState, useEffect } from 'react';
import { resetPassword } from '../../services/auth';
import { supabase } from '../../lib/supabase';

interface ResetPasswordProps {
  onSuccess?: () => void;
}

export default function ResetPassword({ onSuccess }: ResetPasswordProps) {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    // Check if we have a password reset token in the URL
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const type = hashParams.get('type');

    if (accessToken && type === 'recovery') {
      setHasToken(true);
    } else {
      setError('Invalid or missing reset token. Please request a new password reset link.');
    }
  }, []);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setError(null);
    setLoading(true);

    const result = await resetPassword(formData.password);
    setLoading(false);

    if (result.error) {
      setError(result.error.message);
    } else {
      setSuccess(true);
      if (onSuccess) {
        setTimeout(() => {
          // Clear the hash from URL and redirect
          window.history.replaceState({}, '', window.location.pathname);
          onSuccess();
        }, 2000);
      }
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
    setError(null);
  };

  if (!hasToken && !success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="bg-slate-800/70 rounded-2xl p-8 border border-slate-700 text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold mb-4 text-slate-100">Invalid Reset Link</h2>
            <p className="text-slate-300 mb-6">
              {error || 'This password reset link is invalid or has expired. Please request a new one.'}
            </p>
            <a
              href="/"
              className="px-6 py-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold transition inline-block"
            >
              Go to Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="bg-slate-800/70 rounded-2xl p-8 border border-slate-700 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold mb-4 text-slate-100">Password Reset Successful!</h2>
            <p className="text-slate-300 mb-6">
              Your password has been reset. You can now sign in with your new password.
            </p>
            <a
              href="/"
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-white font-semibold transition inline-block"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="bg-slate-800/70 rounded-2xl p-8 border border-slate-700">
          <h2 className="text-3xl font-bold mb-2 text-center text-slate-100">Reset Password</h2>
          <p className="text-slate-400 text-sm text-center mb-6">
            Enter your new password below.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg bg-slate-700 border ${
                  validationErrors.password
                    ? 'border-rose-500'
                    : 'border-slate-600'
                } text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500`}
                placeholder="At least 8 characters"
                disabled={loading}
                autoComplete="new-password"
              />
              {validationErrors.password && (
                <p className="mt-1 text-sm text-rose-400">{validationErrors.password}</p>
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
                disabled={loading}
                autoComplete="new-password"
              />
              {validationErrors.confirmPassword && (
                <p className="mt-1 text-sm text-rose-400">{validationErrors.confirmPassword}</p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-rose-900/30 border border-rose-500 rounded-lg p-3">
                <p className="text-sm text-rose-300">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

