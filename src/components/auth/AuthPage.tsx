import { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPassword from './ForgotPassword';
import Footer from '../Footer';

interface AuthPageProps {
  onAuthSuccess?: () => void;
}

export default function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md flex-1 flex flex-col justify-center">
        {mode === 'login' ? (
          <LoginForm
            onSuccess={onAuthSuccess}
            onSwitchToRegister={() => setMode('register')}
            onSwitchToForgotPassword={() => setMode('forgot')}
          />
        ) : mode === 'register' ? (
          <RegisterForm
            onSuccess={onAuthSuccess}
            onSwitchToLogin={() => setMode('login')}
          />
        ) : (
          <ForgotPassword
            onSuccess={() => setMode('login')}
            onBackToLogin={() => setMode('login')}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}

