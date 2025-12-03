import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
  onSwitchToForgotPassword?: () => void;
}

export default function LoginForm({ onSuccess, onSwitchToRegister, onSwitchToForgotPassword }: LoginFormProps) {
  const { login, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const result = await login({
      email: formData.email,
      password: formData.password,
    });

    if (!result.error) {
      // Wait a moment for session to be established
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 500);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error for this field when user starts typing
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
      <h2 className="text-3xl font-bold mb-6 text-center text-slate-100">Sign In</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg bg-slate-700 border ${
              validationErrors.email
                ? 'border-rose-500'
                : 'border-slate-600'
            } text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500`}
            placeholder="john.doe@example.com"
            disabled={loading}
            autoComplete="email"
          />
          {validationErrors.email && (
            <p className="mt-1 text-sm text-rose-400">{validationErrors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
            Password
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
            placeholder="Enter your password"
            disabled={loading}
            autoComplete="current-password"
          />
          {validationErrors.password && (
            <p className="mt-1 text-sm text-rose-400">{validationErrors.password}</p>
          )}
        </div>

        {/* Server Error */}
        {error && (
          <div className="bg-rose-900/30 border border-rose-500 rounded-lg p-3">
            <p className="text-sm text-rose-300">{error.message}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>

        {/* Links */}
        <div className="space-y-2">
          {onSwitchToRegister && (
            <p className="text-center text-sm text-slate-400">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-sky-400 hover:text-sky-300 underline"
              >
                Create one
              </button>
            </p>
          )}
          {onSwitchToForgotPassword && (
            <p className="text-center text-sm text-slate-400">
              <button
                type="button"
                onClick={onSwitchToForgotPassword}
                className="text-sky-400 hover:text-sky-300 underline"
              >
                Forgot your password?
              </button>
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

