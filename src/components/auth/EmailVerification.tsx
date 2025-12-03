import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

interface EmailVerificationProps {
  onVerified?: () => void;
}

export default function EmailVerification({ onVerified }: EmailVerificationProps) {
  const { user, resendVerificationEmail } = useAuth();
  const [isVerifying, setIsVerifying] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already verified
    if (user?.email_confirmed_at) {
      if (onVerified) {
        setTimeout(() => onVerified(), 1000);
      }
      return;
    }

    // Supabase automatically handles email verification via URL hash
    // Check periodically if verification happened
    const checkVerification = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email_confirmed_at) {
        setMessage('Email verified successfully!');
        setTimeout(() => {
          if (onVerified) onVerified();
        }, 2000);
      }
    };

    // Check URL hash for verification token
    if (window.location.hash.includes('access_token')) {
      setIsVerifying(true);
      // Wait a moment for Supabase to process the token
      setTimeout(() => {
        checkVerification();
        setIsVerifying(false);
      }, 1000);
    }
  }, [user, onVerified]);


  const handleResend = async () => {
    if (!user?.email) return;

    setError(null);
    setMessage(null);

    const result = await resendVerificationEmail(user.email);
    if (result.error) {
      setError(result.error.message);
    } else {
      setMessage('Verification email sent! Please check your inbox.');
    }
  };

  if (user?.email_confirmed_at) {
    return (
      <div className="bg-slate-800/70 rounded-2xl p-8 border border-slate-700 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-bold mb-4 text-slate-100">Email Verified!</h2>
        <p className="text-slate-300">Your email has been verified successfully.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="bg-slate-800/70 rounded-2xl p-8 border border-slate-700 text-center">
          {isVerifying ? (
            <>
              <div className="text-5xl mb-4">⏳</div>
              <h2 className="text-2xl font-bold mb-4 text-slate-100">Verifying Email...</h2>
              <p className="text-slate-300">Please wait while we verify your email address.</p>
            </>
          ) : (
            <>
              <div className="text-5xl mb-4">📧</div>
              <h2 className="text-2xl font-bold mb-4 text-slate-100">Verify Your Email</h2>
              <p className="text-slate-300 mb-4">
                We've sent a verification email to <strong>{user?.email}</strong>
              </p>
              <p className="text-slate-400 text-sm mb-6">
                Please check your inbox and click the verification link to activate your account.
              </p>

              {message && (
                <div className="bg-emerald-900/30 border border-emerald-500 rounded-lg p-3 mb-4">
                  <p className="text-sm text-emerald-300">{message}</p>
                </div>
              )}

              {error && (
                <div className="bg-rose-900/30 border border-rose-500 rounded-lg p-3 mb-4">
                  <p className="text-sm text-rose-300">{error}</p>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={handleResend}
                  className="w-full py-2 px-4 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium transition"
                >
                  Resend Verification Email
                </button>
                <p className="text-xs text-slate-500">
                  Didn't receive the email? Check your spam folder or try resending.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

