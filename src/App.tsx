import { useEffect, useMemo, useState } from "react";
import QuestionCard from "./components/QuestionCard";
import WelcomePage from "./components/WelcomePage";
import AdminReview from "./components/AdminReview";
import AdminUsers from "./components/admin/AdminUsers";
import AdminPasswordPrompt from "./components/AdminPasswordPrompt";
import AdminUsersPasswordPrompt from "./components/admin/AdminUsersPasswordPrompt";
import TeacherPrintPage from "./components/TeacherPrintPage";
import TeacherPasswordPrompt from "./components/TeacherPasswordPrompt";
import AuthPage from "./components/auth/AuthPage";
import EmailVerification from "./components/auth/EmailVerification";
import ResetPassword from "./components/auth/ResetPassword";
import EnvVarCheck from "./components/EnvVarCheck";
import Dashboard from "./components/dashboard/Dashboard";
import ProfilePage from "./components/profile/ProfilePage";
import { useAuth } from "./hooks/useAuth";
import type { ActQuestion } from "./types";
import { useProgress } from "./hooks/useProgress";
import useLocalStorage from "./hooks/useLocalStorage";
import { BANKS } from "./data/banks";
import { 
  trackPracticeStarted, 
  trackQuestionAnswered, 
  trackPracticeCompleted,
  trackAdminAccess 
} from "./utils/analytics";

type PracticeMode = 'quick' | 'standard' | 'full' | 'study';
type QuestionSelectionMode = 'random' | 'shuffled' | 'sequential';

const PRACTICE_MODES = {
  quick: { questions: 5, timeMinutes: 6 },
  standard: { questions: 10, timeMinutes: 12 },
  full: { questions: 60, timeMinutes: 60 },
  study: { questions: null, timeMinutes: null }, // untimed, unlimited questions
} as const;

export default function App() {
  // User authentication
  const { user, loading: authLoading, logout, isAuthenticated } = useAuth();
  
  // Check for admin/teacher/dashboard/profile/reset-password mode via URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const isAdminMode = urlParams.get('admin') === 'true';
  const isAdminUsersMode = urlParams.get('admin') === 'users';
  const isTeacherMode = urlParams.get('teacher') === 'true';
  const isDashboardMode = urlParams.get('dashboard') === 'true';
  const isProfileMode = urlParams.get('profile') === 'true';
  const isResetPasswordMode = window.location.pathname.includes('/auth/reset-password') || 
                              (window.location.hash.includes('access_token') && window.location.hash.includes('type=recovery'));
  const isVerifyMode = urlParams.get('verify') === 'true' || 
                      (window.location.hash.includes('access_token') && !isResetPasswordMode);
  
  // Check if user is authenticated (stored in localStorage)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem("amr.admin.auth") === "true";
  });
  const [isAdminUsersAuthenticated, setIsAdminUsersAuthenticated] = useState(() => {
    return localStorage.getItem("amr.admin.users.auth") === "true";
  });
  const [isTeacherAuthenticated, setIsTeacherAuthenticated] = useState(() => {
    return localStorage.getItem("amr.teacher.auth") === "true";
  });

  const [all, setAll] = useState<ActQuestion[]>([]);
  const [topic, setTopic] = useLocalStorage<string>("amr.topic", "All");
  const [diff, setDiff] = useLocalStorage<number>("amr.diff", 0);
  const { progress, updateProgress: updateQuestionProgress } = useProgress();
  const [questionSelectionMode, setQuestionSelectionMode] = useLocalStorage<QuestionSelectionMode>("amr.questionMode", "sequential");
  const [practiceMode, setPracticeMode] = useLocalStorage<PracticeMode>("amr.practiceMode", "standard");
  const [sessionIdx, setSessionIdx] = useState(0);
  const [inPractice, setInPractice] = useState(false);
  const [sessionLen, setSessionLen] = useState(10);
  const [timeLeft, setTimeLeft] = useState(12 * 60);
  const [sessionResults, setSessionResults] = useState<Record<string, boolean>>({});
  const [shuffledQuestions, setShuffledQuestions] = useState<ActQuestion[]>([]);

  // Load all question files from banks
  useEffect(() => {
    const base = import.meta.env.BASE_URL;
    const promises = BANKS.map(bank =>
      fetch(`${base}content/questions/${bank.file}`)
        .then(r => r.json())
        .catch(err => {
          console.error(`Failed to load ${bank.file}:`, err);
          return [];
        })
    );
    Promise.all(promises).then(results => {
      const merged = results.flat();
      setAll(merged);
    });
  }, []);

  // timer
  useEffect(() => {
    if (!inPractice || practiceMode === 'study') return;
    if (timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [inPractice, timeLeft, practiceMode]);

  const filtered = useMemo(() => {
    return all.filter(q =>
      (topic === "All" || q.topic === topic) &&
      (diff === 0 || q.diff === diff)
    );
  }, [all, topic, diff]);

  // Helper function to shuffle array
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Get current question based on selection mode
  const current = useMemo(() => {
    if (!filtered.length) return null;
    
    if (questionSelectionMode === 'random') {
      // Completely random each time - can repeat
      const randomIdx = Math.floor(Math.random() * filtered.length);
      return filtered[randomIdx];
    } else if (questionSelectionMode === 'shuffled') {
      // Use shuffled array if in practice, otherwise sequential
      if (inPractice && shuffledQuestions.length > 0) {
        return shuffledQuestions[sessionIdx % shuffledQuestions.length] || null;
      }
      // Fallback to sequential when not in practice
      return filtered[sessionIdx % filtered.length];
    } else {
      // Sequential - original behavior
      return filtered[sessionIdx % filtered.length];
    }
  }, [filtered, sessionIdx, questionSelectionMode, inPractice, shuffledQuestions]);

  function handleResult(correct: boolean, id: string) {
    // Track session-specific results
    setSessionResults(prev => ({ ...prev, [id]: correct }));
    
    // Track question answered in analytics
    const question = all.find(q => q.id === id);
    if (question) {
      trackQuestionAnswered(id, correct, question.topic);
    }
    
    // Update persistent progress (now syncs to server)
    updateQuestionProgress(id, correct);
  }

  function startPractice() {
    const config = PRACTICE_MODES[practiceMode];
    setSessionLen(config.questions || Infinity); // Infinity for unlimited (study mode)
    setTimeLeft(config.timeMinutes ? config.timeMinutes * 60 : Infinity);
    setSessionIdx(0);
    setSessionResults({});
    
    // If shuffled mode, create a new shuffled array for this session
    if (questionSelectionMode === 'shuffled') {
      setShuffledQuestions(shuffleArray(filtered));
    }
    
    // Track practice session started
    trackPracticeStarted(practiceMode, topic, diff);
    
    setInPractice(true);
  }

  const done = inPractice && (
    (practiceMode === 'study' ? false : sessionIdx >= sessionLen) || 
    (practiceMode !== 'study' && timeLeft <= 0)
  );

  // Track practice completion
  useEffect(() => {
    if (done && inPractice && Object.keys(sessionResults).length > 0) {
      const correct = Object.values(sessionResults).filter(r => r).length;
      const total = Object.keys(sessionResults).length;
      trackPracticeCompleted(practiceMode, total, correct);
    }
  }, [done, inPractice, sessionResults, practiceMode]);

  // Track admin access
  useEffect(() => {
    if (isAdminMode && isAdminAuthenticated) {
      trackAdminAccess();
    }
  }, [isAdminMode, isAdminAuthenticated]);

  // Calculate topics - must be before any early returns (React hooks rule)
  const topics = useMemo(() => [...new Set(all.map(q => q.topic))].sort(), [all]);
  const filteredCount = filtered.length;

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-300">Loading...</div>
      </div>
    );
  }

  // Show password reset page
  if (isResetPasswordMode) {
    return (
      <ResetPassword
        onSuccess={() => {
          window.location.href = window.location.pathname.replace('/auth/reset-password', '');
        }}
      />
    );
  }

  // Show email verification page
  if (isVerifyMode || (!user?.email_confirmed_at && user && isAuthenticated)) {
    return <EmailVerification onVerified={() => window.location.reload()} />;
  }

  // Show profile page if profile mode is enabled
  if (isProfileMode && isAuthenticated) {
    return (
      <ProfilePage
        onClose={() => {
          // This will be handled by the button's onClick which navigates
        }}
      />
    );
  }

  // Show dashboard if dashboard mode is enabled
  if (isDashboardMode && isAuthenticated) {
    return (
      <Dashboard
        onClose={() => {
          // This will be handled by the button's onClick which navigates
        }}
      />
    );
  }

  // Show auth page if not authenticated (skip for admin/teacher modes)
  if (!isAuthenticated && !isAdminMode && !isTeacherMode) {
    return <AuthPage onAuthSuccess={() => window.location.reload()} />;
  }

  // Show teacher print page if teacher mode is enabled and authenticated
  if (isTeacherMode) {
    if (!isTeacherAuthenticated) {
      return (
        <TeacherPasswordPrompt
          onSuccess={() => {
            setIsTeacherAuthenticated(true);
          }}
          onCancel={() => {
            // Remove teacher parameter and go back to main page
            window.history.replaceState({}, "", window.location.pathname);
            setIsTeacherAuthenticated(false);
          }}
        />
      );
    }
    return <TeacherPrintPage />;
  }

  // Show admin review if admin mode is enabled and authenticated
  if (isAdminMode) {
    if (!isAdminAuthenticated) {
      return (
        <AdminPasswordPrompt
          onSuccess={() => {
            setIsAdminAuthenticated(true);
            trackAdminAccess();
          }}
          onCancel={() => {
            // Remove admin parameter and go back to main page
            window.history.replaceState({}, "", window.location.pathname);
            setIsAdminAuthenticated(false);
          }}
        />
      );
    }
    return <AdminReview />;
  }

  // Show admin users if admin=users mode is enabled and authenticated (separate password)
  if (isAdminUsersMode) {
    if (!isAdminUsersAuthenticated) {
      return (
        <AdminUsersPasswordPrompt
          onSuccess={() => {
            setIsAdminUsersAuthenticated(true);
          }}
          onCancel={() => {
            // Remove admin parameter and go back to main page
            window.history.replaceState({}, "", window.location.pathname);
            setIsAdminUsersAuthenticated(false);
          }}
        />
      );
    }
    return <AdminUsers />;
  }

  // Show welcome page when not in practice
  if (!inPractice) {
    return (
      <div className="min-h-screen px-6 py-8">
        <EnvVarCheck />
        <div className="mx-auto max-w-4xl">
          {/* Header with Auth and Admin/Teacher links */}
          <div className="flex justify-between items-center gap-2 mb-4">
            {/* User info and actions */}
            {isAuthenticated && user && (
              <div className="flex items-center gap-3">
                <a
                  href="?profile=true"
                  className="text-sm text-slate-300 hover:text-slate-100 underline"
                  title="View your profile"
                >
                  {user.user_metadata?.first_name} {user.user_metadata?.last_name}
                </a>
                <a
                  href="?dashboard=true"
                  className="text-sm px-3 py-1 rounded-lg bg-sky-700 hover:bg-sky-600 text-white"
                  title="View your progress dashboard"
                >
                  📊 Dashboard
                </a>
                <button
                  onClick={async () => {
                    await logout();
                    window.location.reload();
                  }}
                  className="text-sm px-3 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300"
                >
                  Logout
                </button>
              </div>
            )}
            
            {/* Admin and Teacher links */}
            <div className="flex gap-2 ml-auto">
              <a
                href="?teacher=true"
                className="text-sm px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white"
                title="Teacher: Generate printable worksheets"
              >
                📄 Teacher Print
              </a>
              <a
                href="?admin=true"
                className="text-sm px-3 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300"
                title="Admin: View all questions and answers"
              >
                🔍 Admin Review
              </a>
            </div>
          </div>

          <WelcomePage
            topics={topics}
            topic={topic}
            setTopic={setTopic}
            diff={diff}
            setDiff={setDiff}
            questionSelectionMode={questionSelectionMode}
            setQuestionSelectionMode={setQuestionSelectionMode}
            practiceMode={practiceMode}
            setPracticeMode={setPracticeMode}
            availableCount={filteredCount}
            onStartPractice={startPractice}
          />
        </div>
      </div>
    );
  }

  // Practice mode - show clean interface with navigation
  return (
    <div className="min-h-screen px-6 py-8">
      <EnvVarCheck />
      <div className="mx-auto max-w-4xl">
        {/* Navigation Bar */}
        <PracticeNavBar
          sessionIdx={sessionIdx}
          sessionLen={sessionLen}
          practiceMode={practiceMode}
          timeLeft={timeLeft}
          onExit={() => {
            if (confirm("Are you sure you want to exit? Your progress will be saved.")) {
              setInPractice(false);
            }
          }}
        />

        {!current && <div className="text-slate-300">Loading questions…</div>}

        {current && !done && (
          <QuestionCard
            question={current}
            onNext={() => setSessionIdx(i => i + 1)}
            onResult={handleResult}
            studyMode={practiceMode === 'study'}
          />
        )}

        {done && (
          <Summary
            sessionResults={sessionResults}
            onRestart={startPractice}
            onExit={() => setInPractice(false)}
          />
        )}
      </div>
    </div>
  );
}

/* ---------- UI helpers ---------- */
function PracticeNavBar({
  sessionIdx,
  sessionLen,
  practiceMode,
  timeLeft,
  onExit,
}: {
  sessionIdx: number;
  sessionLen: number | typeof Infinity;
  practiceMode: PracticeMode;
  timeLeft: number;
  onExit: () => void;
}) {
  const isUnlimited = sessionLen === Infinity;
  const progressPercent = isUnlimited ? 0 : (sessionIdx / sessionLen) * 100;

  return (
    <div className="mb-6 bg-slate-800/70 rounded-xl p-4 border border-slate-700">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Progress */}
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-slate-300 font-semibold">
              {isUnlimited 
                ? `Question ${sessionIdx + 1}`
                : `Question ${sessionIdx + 1} of ${sessionLen}`
              }
            </span>
            {!isUnlimited && (
              <span className="text-xs text-slate-400">{Math.round(progressPercent)}%</span>
            )}
          </div>
          {!isUnlimited && (
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-sky-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          )}
        </div>

        {/* Timer / Mode Badge */}
        <div className="flex items-center gap-3">
          {practiceMode !== 'study' ? (
            <TimerBadge seconds={timeLeft} />
          ) : (
            <span className="px-3 py-1 rounded-xl border bg-slate-700 border-slate-600 text-xs text-slate-300">
              📖 Untimed Practice
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <a
            href="?admin=true"
            className="px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs transition"
            title="Admin: View all questions and answers"
          >
            🔍 Admin
          </a>
          <button
            onClick={onExit}
            className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm transition"
          >
            Exit Practice
          </button>
        </div>
      </div>
    </div>
  );
}

function TimerBadge({ seconds }: { seconds: number }) {
  const m = Math.max(0, Math.floor(seconds / 60));
  const s = Math.max(0, seconds % 60).toString().padStart(2, "0");
  const danger = seconds <= 60;
  return (
    <span className={`px-3 py-1 rounded-xl border text-sm font-mono ${danger ? "bg-rose-900/40 border-rose-500 text-rose-300" : "bg-slate-700 border-slate-600 text-slate-300"}`}>
      ⏱ {m}:{s}
    </span>
  );
}

function Summary({ sessionResults, onRestart, onExit }:{
  sessionResults: Record<string, boolean>;
  onRestart: () => void;
  onExit: () => void;
}) {
  const questionIds = Object.keys(sessionResults);
  const correct = Object.values(sessionResults).filter(result => result).length;
  const total = questionIds.length;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  
  return (
    <div className="bg-slate-800/70 rounded-2xl p-8 border border-slate-700 text-center">
      <h2 className="text-3xl font-bold mb-4">Session Complete! 🎉</h2>
      <div className="mb-6">
        <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
          {percentage}%
        </div>
        <p className="text-lg text-slate-300">
          You answered <b className="text-emerald-400">{correct}</b> out of <b>{total}</b> correctly.
        </p>
      </div>
      <div className="flex gap-3 justify-center">
        <button
          onClick={onRestart}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-white font-semibold transition"
        >
          Practice Again
        </button>
        <button
          onClick={onExit}
          className="px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
