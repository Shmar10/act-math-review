import { useState, useEffect, useRef } from "react";

type Props = {
  topics: string[];
  topic: string; setTopic: (t: string) => void;
  diff: number; setDiff: (d: number) => void; // 1..5, 0 = all
  questionSelectionMode: 'random' | 'shuffled' | 'sequential';
  setQuestionSelectionMode: (mode: 'random' | 'shuffled' | 'sequential') => void;
  onStartPractice: (mode: 'quick' | 'standard' | 'full' | 'study') => void;
};

export default function FilterBar({ topics, topic, setTopic, diff, setDiff, questionSelectionMode, setQuestionSelectionMode, onStartPractice }: Props) {
  const [showPracticeMenu, setShowPracticeMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowPracticeMenu(false);
      }
    }
    if (showPracticeMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showPracticeMenu]);

  return (
    <div className="mb-4 flex flex-wrap gap-3 items-center">
      <label className="text-slate-300">
        Topic:
        <select
          className="ml-2 rounded-lg bg-slate-800 border border-slate-600 px-2 py-1"
          value={topic} onChange={(e) => setTopic(e.target.value)}
        >
          <option value="All">All</option>
          {topics.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </label>

      <label className="text-slate-300">
        Difficulty:
        <select
          className="ml-2 rounded-lg bg-slate-800 border border-slate-600 px-2 py-1"
          value={diff} onChange={(e) => setDiff(Number(e.target.value))}
        >
          <option value={0}>All</option>
          {[1,2,3,4,5].map(d => <option key={d} value={d}>{"★".repeat(d)}</option>)}
        </select>
      </label>

      <label className="text-slate-300" title="Sequential: Questions in order | Shuffled: Random order per session, no repeats | Random: Completely random, may repeat">
        Question Mode:
        <select
          className="ml-2 rounded-lg bg-slate-800 border border-slate-600 px-2 py-1"
          value={questionSelectionMode}
          onChange={(e) => setQuestionSelectionMode(e.target.value as 'random' | 'shuffled' | 'sequential')}
        >
          <option value="sequential">Sequential</option>
          <option value="shuffled">Shuffled</option>
          <option value="random">Random</option>
        </select>
      </label>

      <div className="ml-auto relative" ref={menuRef}>
        <button
          onClick={() => setShowPracticeMenu(!showPracticeMenu)}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 flex items-center gap-2"
        >
          Practice Mode
          <span className="text-xs">▼</span>
        </button>
        
        {showPracticeMenu && (
          <div className="absolute right-0 mt-2 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-10 min-w-[200px]">
            <button
              onClick={() => { onStartPractice('quick'); setShowPracticeMenu(false); }}
              className="w-full text-left px-4 py-2 hover:bg-slate-700 rounded-t-lg"
            >
              <div className="font-semibold">Quick Practice</div>
              <div className="text-xs text-slate-400">5 questions, 6 min</div>
            </button>
            <button
              onClick={() => { onStartPractice('standard'); setShowPracticeMenu(false); }}
              className="w-full text-left px-4 py-2 hover:bg-slate-700"
            >
              <div className="font-semibold">Standard Practice</div>
              <div className="text-xs text-slate-400">10 questions, 12 min</div>
            </button>
            <button
              onClick={() => { onStartPractice('full'); setShowPracticeMenu(false); }}
              className="w-full text-left px-4 py-2 hover:bg-slate-700"
            >
              <div className="font-semibold">Full Test</div>
              <div className="text-xs text-slate-400">60 questions, 60 min</div>
            </button>
            <button
              onClick={() => { onStartPractice('study'); setShowPracticeMenu(false); }}
              className="w-full text-left px-4 py-2 hover:bg-slate-700 rounded-b-lg"
            >
              <div className="font-semibold">Study Mode</div>
              <div className="text-xs text-slate-400">Untimed, show solutions</div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
