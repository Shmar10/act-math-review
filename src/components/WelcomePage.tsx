import { useState, useRef, useEffect } from "react";

type PracticeMode = 'quick' | 'standard' | 'full' | 'study';
type QuestionSelectionMode = 'random' | 'shuffled' | 'sequential';

const PRACTICE_MODES = {
  quick: { 
    questions: 5, 
    timeMinutes: 6, 
    displayName: "Quick Warm‑Up",
    description: "Best for getting started or doing a short daily drill before a longer study session."
  },
  standard: { 
    questions: 10, 
    timeMinutes: 12, 
    displayName: "Timed Practice Set",
    description: "Best for building pacing and accuracy with a small, test‑style set."
  },
  full: { 
    questions: 60, 
    timeMinutes: 60, 
    displayName: "Full ACT Math Simulation",
    description: "Best for simulating the real ACT Math section and tracking score progress."
  },
  study: { 
    questions: 10, 
    timeMinutes: null, 
    displayName: "Guided Learning Mode",
    description: "Best for slowing down, seeing step‑by‑step solutions, and filling in skill gaps."
  },
} as const;

type Props = {
  topics: string[];
  topic: string;
  setTopic: (t: string) => void;
  diff: number;
  setDiff: (d: number) => void;
  questionSelectionMode: QuestionSelectionMode;
  setQuestionSelectionMode: (mode: QuestionSelectionMode) => void;
  practiceMode: PracticeMode;
  setPracticeMode: (mode: PracticeMode) => void;
  availableCount: number;
  onStartPractice: () => void;
};

export default function WelcomePage({
  topics,
  topic,
  setTopic,
  diff,
  setDiff,
  questionSelectionMode,
  setQuestionSelectionMode,
  practiceMode,
  setPracticeMode,
  availableCount,
  onStartPractice,
}: Props) {
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

  const selectedMode = PRACTICE_MODES[practiceMode];
  const filteredCount = availableCount;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
          ACT Math Review
        </h1>
        <p className="text-xl text-slate-300 mb-2">
          Master ACT Math through targeted practice
        </p>
        <p className="text-slate-400">
          {availableCount} questions available across {topics.length} topics
        </p>
      </div>

      {/* Introduction Card */}
      <div className="bg-slate-800/70 rounded-2xl p-6 border border-slate-700 mb-6">
        <h2 className="text-2xl font-bold mb-3">How to Use This Site</h2>
        <ol className="space-y-3 text-slate-300 list-decimal list-inside">
          <li>Select your preferences below to customize your practice session</li>
          <li>Choose a practice mode that matches your study goals</li>
          <li>Click "Start Practice" to begin working through questions</li>
          <li>Review your answers and track your progress over time</li>
        </ol>
      </div>

      {/* Configuration Section */}
      <div className="bg-slate-800/70 rounded-2xl p-6 border border-slate-700 mb-6">
        <h2 className="text-2xl font-bold mb-4">Configure Your Practice Session</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Topic Selection */}
          <div>
            <label className="block text-slate-300 font-semibold mb-2">
              Topic
            </label>
            <select
              className="w-full rounded-lg bg-slate-900 border border-slate-600 px-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            >
              <option value="All">All Topics</option>
              {topics.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <p className="text-xs text-slate-400 mt-1">
              Focus on specific math areas or practice all topics
            </p>
          </div>

          {/* Difficulty Selection */}
          <div>
            <label className="block text-slate-300 font-semibold mb-2">
              Difficulty Level
            </label>
            <select
              className="w-full rounded-lg bg-slate-900 border border-slate-600 px-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={diff}
              onChange={(e) => setDiff(Number(e.target.value))}
            >
              <option value={0}>All Difficulties</option>
              {[1, 2, 3, 4, 5].map(d => (
                <option key={d} value={d}>
                  {"★".repeat(d)} ({d === 1 ? 'Easy' : d === 5 ? 'Hard' : 'Medium'})
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-400 mt-1">
              Filter by question difficulty (1 = easiest, 5 = hardest)
            </p>
          </div>

          {/* Question Selection Mode */}
          <div>
            <label className="block text-slate-300 font-semibold mb-2">
              Question Selection Mode
            </label>
            <select
              className="w-full rounded-lg bg-slate-900 border border-slate-600 px-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={questionSelectionMode}
              onChange={(e) => setQuestionSelectionMode(e.target.value as QuestionSelectionMode)}
            >
              <option value="sequential">Sequential</option>
              <option value="shuffled">Shuffled</option>
              <option value="random">Random</option>
            </select>
            <div className="text-xs text-slate-400 mt-1 space-y-1">
              <p><strong>Sequential:</strong> Questions in order</p>
              <p><strong>Shuffled:</strong> Random order per session, no repeats</p>
              <p><strong>Random:</strong> Completely random, may repeat</p>
            </div>
          </div>

          {/* Practice Mode */}
          <div>
            <label className="block text-slate-300 font-semibold mb-2">
              Practice Mode
            </label>
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowPracticeMenu(!showPracticeMenu)}
                className="w-full rounded-lg bg-slate-900 border border-slate-600 px-4 py-2 text-left text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold">{selectedMode.displayName}</div>
                  <div className="text-xs text-slate-400">
                    {selectedMode.questions} questions
                    {selectedMode.timeMinutes ? `, ${selectedMode.timeMinutes} min` : ', untimed'}
                  </div>
                </div>
                <span className="text-xs">▼</span>
              </button>
              
              {showPracticeMenu && (
                <div className="absolute left-0 right-0 mt-2 bg-slate-900 border border-slate-600 rounded-lg shadow-xl z-10 overflow-hidden">
                  {(['quick', 'standard', 'full', 'study'] as PracticeMode[]).map(mode => {
                    const modeConfig = PRACTICE_MODES[mode];
                    const isSelected = practiceMode === mode;
                    return (
                      <button
                        key={mode}
                        onClick={() => {
                          setPracticeMode(mode);
                          setShowPracticeMenu(false);
                        }}
                        className={`w-full text-left px-4 py-3 hover:bg-slate-800 transition ${
                          isSelected ? 'bg-sky-900/30 border-l-4 border-sky-400' : ''
                        }`}
                        title={modeConfig.description}
                      >
                        <div className="font-semibold text-slate-100">
                          {modeConfig.displayName}
                        </div>
                        <div className="text-xs text-slate-400 mb-1">
                          {modeConfig.questions} questions
                          {modeConfig.timeMinutes ? `, ${modeConfig.timeMinutes} min` : ', untimed'}
                        </div>
                        <div className="text-xs text-slate-500 italic">
                          {modeConfig.description}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Choose the type of practice session that fits your goals
            </p>
          </div>
        </div>

        {/* Available Questions Count */}
        <div className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-slate-600">
          <p className="text-sm text-slate-300">
            <span className="font-semibold">{filteredCount}</span> question{filteredCount !== 1 ? 's' : ''} available 
            with your current filters
          </p>
        </div>
      </div>

      {/* Start Button */}
      <div className="text-center">
        <button
          onClick={onStartPractice}
          disabled={filteredCount === 0}
          className="px-8 py-4 rounded-xl bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-lg shadow-lg transition-all transform hover:scale-105"
        >
          Start Practice
        </button>
        {filteredCount === 0 && (
          <p className="text-sm text-rose-400 mt-2">
            No questions match your current filters. Please adjust your selections.
          </p>
        )}
      </div>
    </div>
  );
}

