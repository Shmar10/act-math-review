import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export default function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const { register, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

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

    const result = await register({
      email: formData.email,
      password: formData.password,
      first_name: formData.firstName,
      last_name: formData.lastName,
    });

    if (!result.error) {
      setShowSuccess(true);
      // Call onSuccess after a short delay to show success message
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 2000);
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

  if (showSuccess) {
    return (
      <div className="bg-slate-800/70 rounded-2xl p-8 border border-slate-700 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-bold mb-4 text-slate-100">Registration Successful!</h2>
        <p className="text-slate-300 mb-2">
          We've sent a verification email to <strong>{formData.email}</strong>
        </p>
        <p className="text-slate-400 text-sm">
          Please check your email and click the verification link to activate your account.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/70 rounded-2xl p-8 border border-slate-700">
      <h2 className="text-3xl font-bold mb-6 text-center text-slate-100">Create Account</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First Name */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-slate-300 mb-1">
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg bg-slate-700 border ${
              validationErrors.firstName
                ? 'border-rose-500'
                : 'border-slate-600'
            } text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500`}
            placeholder="John"
            disabled={loading}
          />
          {validationErrors.firstName && (
            <p className="mt-1 text-sm text-rose-400">{validationErrors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-slate-300 mb-1">
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg bg-slate-700 border ${
              validationErrors.lastName
                ? 'border-rose-500'
                : 'border-slate-600'
            } text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500`}
            placeholder="Doe"
            disabled={loading}
          />
          {validationErrors.lastName && (
            <p className="mt-1 text-sm text-rose-400">{validationErrors.lastName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
            Email Address *
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
          />
          {validationErrors.email && (
            <p className="mt-1 text-sm text-rose-400">{validationErrors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
            Password *
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
          />
          {validationErrors.password && (
            <p className="mt-1 text-sm text-rose-400">{validationErrors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-1">
            Confirm Password *
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
            placeholder="Re-enter your password"
            disabled={loading}
          />
          {validationErrors.confirmPassword && (
            <p className="mt-1 text-sm text-rose-400">{validationErrors.confirmPassword}</p>
          )}
        </div>

        {/* Server Error */}
        {error && (
          <div className="bg-rose-900/30 border border-rose-500 rounded-lg p-3">
            <div className="text-sm text-rose-300 whitespace-pre-line">
              {error.message}
            </div>
            {error.message.includes('school/work networks') && (
              <div className="mt-3 pt-3 border-t border-rose-700">
                <a
                  href="/docs/SCHOOL_NETWORK_SOLUTIONS.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-sky-400 hover:text-sky-300 underline"
                >
                  View detailed solutions for school network issues →
                </a>
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

        {/* Switch to Login */}
        {onSwitchToLogin && (
          <p className="text-center text-sm text-slate-400">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
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

