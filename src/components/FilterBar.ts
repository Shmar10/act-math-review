type Props = {
  topics: string[];
  topic: string; setTopic: (t: string) => void;
  diff: number; setDiff: (d: number) => void; // 1..5, 0 = all
  onStartPractice: () => void;
};

export default function FilterBar({ topics, topic, setTopic, diff, setDiff, onStartPractice }: Props) {
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

      <button
        onClick={onStartPractice}
        className="ml-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500"
        title="Start a 10-question timed session"
      >
        Start 10-Question Practice
      </button>
    </div>
  );
}
