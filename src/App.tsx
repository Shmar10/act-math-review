import { useState } from "react";
import { InlineMath } from "react-katex";

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="max-w-xl w-full rounded-2xl border border-slate-700 bg-slate-800 p-8 shadow">
        <h1 className="text-3xl font-bold mb-4">ACT Math Review — Vite + React + Tailwind</h1>

        <p className="mb-4 text-slate-300">
          Example formula: <InlineMath math="a^2 + b^2 = c^2" />
        </p>

        <button
          className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500"
          onClick={() => setCount(c => c + 1)}
        >
          Clicks: {count}
        </button>
      </div>
    </div>
  );
}
