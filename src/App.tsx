import { useEffect, useMemo, useState } from "react";
import QuestionCard from "./components/QuestionCard";
import FilterBar from "./components/FilterBar";
import type { ActQuestion } from "./types";
import type { ProgressMap } from "./types.progress";
import useLocalStorage from "./hooks/useLocalStorage";

const SESSION_LEN = 10;        // number of questions in a practice set
const TIMER_SECONDS = 12 * 60; // 12 minutes (ACT pace ~72s per Q)

export default function App() {
  const [all, setAll] = useState<ActQuestion[]>([]);
  const [topic, setTopic] = useLocalStorage<string>("amr.topic", "All");
  const [diff, setDiff] = useLocalStorage<number>("amr.diff", 0);
  const [progress, setProgress] = useLocalStorage<ProgressMap>("amr.progress", {});
  const [sessionIdx, setSessionIdx] = useState(0);
  const [inPractice, setInPractice] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);

  // Load questions (you can merge more files here)
  useEffect(() => {
    const base = import.meta.env.BASE_URL;
    fetch(`${base}content/questions/algebra.json`)
      .then(r => r.json())
      .then((data: ActQuestion[]) => setAll(data));
  }, []);

  // timer
  useEffect(() => {
    if (!inPractice) return;
    if (timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [inPractice, timeLeft]);

  const filtered = useMemo(() => {
    return all.filter(q =>
      (topic === "All" || q.topic === topic) &&
      (diff === 0 || q.diff === diff)
    );
  }, [all, topic, diff]);

  const current = filtered.length ? filtered[sessionIdx % filtered.length] : null;

  function handleResult(correct: boolean, id: string) {
    setProgress(p => {
      const prev = p[id] ?? { correct: 0, wrong: 0, lastAt: 0 };
      const next = {
        correct: prev.correct + (correct ? 1 : 0),
        wrong: prev.wrong + (correct ? 0 : 1),
        lastAt: Date.now(),
      };
      return { ...p, [id]: next };
    });
  }

  function startPractice() {
    setInPractice(true);
    setTimeLeft(TIMER_SECONDS);
    setSessionIdx(0);
  }

  const done = inPractice && (sessionIdx >= SESSION_LEN || timeLeft <= 0);

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-4">ACT Math Review</h1>

        <FilterBar
          topics={[...new Set(all.map(q => q.topic))].sort()}
          topic={topic} setTopic={setTopic}
          diff={diff} setDiff={setDiff}
          onStartPractice={startPractice}
        />

        {inPractice && !done && (
          <div className="mb-3 flex items-center gap-4 text-slate-300">
            <span>Question {sessionIdx + 1}/{SESSION_LEN}</span>
            <TimerBadge seconds={timeLeft} />
          </div>
        )}

        {!current && <div className="text-slate-300">Loading questions…</div>}

        {current && !done && (
          <QuestionCard
            question={current}
            onNext={() => setSessionIdx(i => i + 1)}
            onResult={handleResult}
          />
        )}

        {done && (
          <Summary
            progress={progress}
            used={filtered.slice(0, Math.min(SESSION_LEN, filtered.length)).map(q => q.id)}
            onRestart={startPractice}
            onExit={() => setInPractice(false)}
          />
        )}
      </div>
    </div>
  );
}

/* ---------- UI helpers ---------- */
function TimerBadge({ seconds }: { seconds: number }) {
  const m = Math.max(0, Math.floor(seconds / 60));
  const s = Math.max(0, seconds % 60).toString().padStart(2, "0");
  const danger = seconds <= 60;
  return (
    <span className={`px-3 py-1 rounded-xl border ${danger ? "bg-rose-900/40 border-rose-500" : "bg-slate-800 border-slate-600"}`}>
      ⏱ {m}:{s}
    </span>
  );
}

function Summary({ progress, used, onRestart, onExit }:{
  progress: Record<string, {correct:number; wrong:number}>;
  used: string[];
  onRestart: () => void;
  onExit: () => void;
}) {
  const stats = used.map(id => progress[id] ?? {correct:0, wrong:0});
  const correct = stats.reduce((a,b)=>a+(b.correct>0?1:0),0);
  return (
    <div className="bg-slate-800/70 rounded-2xl p-6 border border-slate-700">
      <h2 className="text-2xl font-bold mb-2">Session Complete</h2>
      <p className="mb-4 text-slate-300">
        You answered <b>{correct}</b> out of <b>{used.length}</b> correctly.
      </p>
      <div className="flex gap-2">
        <button onClick={onRestart} className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500">Restart</button>
        <button onClick={onExit} className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600">Back to Review</button>
      </div>
    </div>
  );
}
