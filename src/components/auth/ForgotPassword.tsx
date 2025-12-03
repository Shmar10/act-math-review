import { useState } from 'react';
import { requestPasswordReset } from '../../services/auth';

interface ForgotPasswordProps {
  onSuccess?: () => void;
  onBackToLogin?: () => void;
}

export default function ForgotPassword({ onSuccess, onBackToLogin }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    const result = await requestPasswordReset(email.trim());
    setLoading(false);

    if (result.error) {
      setError(result.error.message);
    } else {
      setSuccess(true);
      if (onSuccess) {
        setTimeout(() => onSuccess(), 3000);
      }
    }
  };

  if (success) {
    return (
      <div className="bg-slate-800/70 rounded-2xl p-8 border border-slate-700 text-center">
        <div className="text-5xl mb-4">📧</div>
        <h2 className="text-2xl font-bold mb-4 text-slate-100">Check Your Email</h2>
        <p className="text-slate-300 mb-2">
          We've sent a password reset link to <strong>{email}</strong>
        </p>
        <p className="text-slate-400 text-sm mb-6">
          Click the link in the email to reset your password. The link will expire in 1 hour.
        </p>
        {onBackToLogin && (
          <button
            onClick={onBackToLogin}
            className="px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold transition"
          >
            Back to Login
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-slate-800/70 rounded-2xl p-8 border border-slate-700">
      <h2 className="text-3xl font-bold mb-2 text-center text-slate-100">Forgot Password?</h2>
      <p className="text-slate-400 text-sm text-center mb-6">
        Enter your email address and we'll send you a link to reset your password.
      </p>

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
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            className={`w-full px-4 py-2 rounded-lg bg-slate-700 border ${
              error
                ? 'border-rose-500'
                : 'border-slate-600'
            } text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500`}
            placeholder="your.email@example.com"
            disabled={loading}
            autoComplete="email"
          />
          {error && (
            <p className="mt-1 text-sm text-rose-400">{error}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>

        {/* Back to Login */}
        {onBackToLogin && (
          <p className="text-center text-sm text-slate-400">
            Remember your password?{' '}
            <button
              type="button"
              onClick={onBackToLogin}
              className="text-sky-400 hover:text-sky-300 underline"
            >
              Sign in
            </button>
          </p>
        )}
      </form>
    </div>
  );
}

