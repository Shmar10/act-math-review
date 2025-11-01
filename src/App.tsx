import { useEffect, useState } from "react";
import QuestionCard from "./components/QuestionCard";
import type { ActQuestion } from "./types";

export default function App() {
  const [qs, setQs] = useState<ActQuestion[]>([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    // Load one or more JSON files; you can merge more later.
    fetch("/act-math-review/content/questions/algebra.json")
      .then((r) => r.json())
      .then((data: ActQuestion[]) => setQs(data));
  }, []);

  if (!qs.length) {
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <div className="text-slate-300">Loading questions…</div>
      </div>
    );
  }

  const q = qs[idx % qs.length];

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="max-w-3xl w-full">
        <h1 className="text-3xl font-bold mb-6">ACT Math Review</h1>
        <QuestionCard
          question={q}
          onNext={() => setIdx((i) => (i + 1) % qs.length)}
        />
      </div>
    </div>
  );
}
