import { useState, FormEvent } from "react";
import { ADMIN_PASSWORD } from "../../config/admin";
import Footer from "../Footer";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Simple delay to prevent instant feedback (UX)
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        // Store authentication in localStorage (session persistence)
        localStorage.setItem("amr.admin.auth", "true");
        // Redirect to admin dashboard
        window.location.href = "/act-math-review/admin";
      } else {
        setError("Incorrect password. Please try again.");
        setIsSubmitting(false);
        setPassword("");
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 max-w-md w-full shadow-xl">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2">Admin Login</h1>
            <p className="text-slate-400">Developer/Admin Access</p>
          </div>
          
          <p className="text-slate-300 mb-6 text-center">
            Please enter the admin password to access admin features.
          </p>

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
                placeholder="Enter admin password"
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
                {isSubmitting ? "Checking..." : "Login"}
              </button>
              <button
                type="button"
                onClick={() => {
                  window.location.href = "/act-math-review/";
                }}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

