import { useState, FormEvent } from "react";
import { ADMIN_USERS_PASSWORD } from "../../config/adminUsers";

type Props = {
  onSuccess: () => void;
  onCancel: () => void;
};

export default function AdminUsersPasswordPrompt({ onSuccess, onCancel }: Props) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Simple delay to prevent instant feedback (UX)
    setTimeout(() => {
      if (password === ADMIN_USERS_PASSWORD) {
        // Store authentication in localStorage (session persistence)
        localStorage.setItem("amr.admin.users.auth", "true");
        onSuccess();
      } else {
        setError("Incorrect password. Please try again.");
        setIsSubmitting(false);
        setPassword("");
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center px-4">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 max-w-md w-full shadow-xl">
        <h2 className="text-2xl font-bold mb-2">User Management Access Required</h2>
        <p className="text-slate-300 mb-6">Please enter the user management admin password to continue.</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 focus:border-sky-500 focus:outline-none text-white"
              placeholder="Enter password"
              autoFocus
              disabled={isSubmitting}
            />
            {error && (
              <p className="mt-2 text-sm text-rose-400">{error}</p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting || !password}
              className="flex-1 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isSubmitting ? "Checking..." : "Submit"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

