import { useEffect, useState } from 'react';

export default function EnvVarCheck() {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey || 
        supabaseUrl === 'https://placeholder.supabase.co' ||
        supabaseAnonKey === 'placeholder-key') {
      setShowWarning(true);
    }
  }, []);

  if (!showWarning) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 bg-rose-900/90 border border-rose-500 rounded-lg p-4 text-white">
      <div className="flex items-start gap-3">
        <div className="text-2xl">⚠️</div>
        <div className="flex-1">
          <h3 className="font-bold mb-2">Missing Environment Variables</h3>
          <p className="text-sm mb-2">
            Your Supabase credentials are not configured. Please:
          </p>
          <ol className="text-sm list-decimal list-inside space-y-1 mb-2">
            <li>Create a <code className="bg-slate-800 px-1 rounded">.env</code> file in the project root</li>
            <li>Add your <code className="bg-slate-800 px-1 rounded">VITE_SUPABASE_URL</code> and <code className="bg-slate-800 px-1 rounded">VITE_SUPABASE_ANON_KEY</code></li>
            <li>Restart your dev server (stop with Ctrl+C, then run <code className="bg-slate-800 px-1 rounded">npm run dev</code> again)</li>
          </ol>
          <p className="text-xs text-rose-200">
            See <code className="bg-slate-800 px-1 rounded">docs/CREATE_ENV_FILE_GUIDE.md</code> for detailed instructions.
          </p>
        </div>
        <button
          onClick={() => setShowWarning(false)}
          className="text-rose-200 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

