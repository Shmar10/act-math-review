import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { ActQuestion } from "../types";
import { BANKS } from "../data/banks";
import { InlineMath, BlockMath } from "react-katex";

export default function AdminReview() {
  const [allQuestions, setAllQuestions] = useState<ActQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTopic, setFilterTopic] = useState<string>("All");
  const [filterSubtopic, setFilterSubtopic] = useState<string>("All");
  const [filterDiff, setFilterDiff] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAllAnswers, setShowAllAnswers] = useState(false);

  // Load all questions
  useEffect(() => {
    const base = import.meta.env.BASE_URL;
    const promises = BANKS.map((bank) =>
      fetch(`${base}content/questions/${bank.file}`)
        .then((r) => r.json())
        .then((questions) =>
          questions.map((q: ActQuestion) => ({ ...q, sourceFile: bank.file }))
        )
        .catch((err) => {
          console.error(`Failed to load ${bank.file}:`, err);
          return [];
        })
    );
    Promise.all(promises).then((results) => {
      const merged = results.flat();
      setAllQuestions(merged);
      setLoading(false);
    });
  }, []);

  const topics = [...new Set(allQuestions.map((q) => q.topic))].sort();
  
  // Get subtopics filtered by selected topic
  const subtopics = [
    ...new Set(
      allQuestions
        .filter((q) => filterTopic === "All" || q.topic === filterTopic)
        .map((q) => q.subtopic)
    )
  ].sort();

  // Reset subtopic filter when topic changes
  useEffect(() => {
    if (filterTopic === "All") {
      setFilterSubtopic("All");
    } else {
      // Check if current subtopic is still valid for the new topic
      const validSubtopic = allQuestions.some(
        (q) => q.topic === filterTopic && q.subtopic === filterSubtopic
      );
      if (!validSubtopic) {
        setFilterSubtopic("All");
      }
    }
  }, [filterTopic, allQuestions, filterSubtopic]);

  const filtered = allQuestions.filter((q) => {
    const topicMatch = filterTopic === "All" || q.topic === filterTopic;
    const subtopicMatch = filterSubtopic === "All" || q.subtopic === filterSubtopic;
    const diffMatch = filterDiff === 0 || q.diff === filterDiff;
    const term = searchTerm.toLowerCase();
    const searchMatch =
      term === "" ||
      q.id.toLowerCase().includes(term) ||
      q.stem.toLowerCase().includes(term) ||
      q.subtopic.toLowerCase().includes(term);
    return topicMatch && subtopicMatch && diffMatch && searchMatch;
  });

  if (loading) {
    return (
      <div className="min-h-screen px-6 py-8 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">Loading questions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-8 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Question Review</h1>
            <p className="text-slate-400">
              Total: {allQuestions.length} questions | Showing: {filtered.length}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAllAnswers(!showAllAnswers)}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500"
            >
              {showAllAnswers ? "▲ Hide All Answers" : "▼ Show All Answers"}
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("amr.admin.auth");
                window.location.href = "/act-math-review/";
              }}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500"
              title="Log out and return to main page"
            >
              🔒 Logout
            </button>
            <button
              onClick={() => {
                window.location.href = window.location.pathname;
              }}
              className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600"
            >
              ← Back to App
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4 items-center p-4 bg-slate-800 rounded-lg">
          <label className="text-slate-300">
            Topic:
            <select
              className="ml-2 rounded-lg bg-slate-700 border border-slate-600 px-2 py-1"
              value={filterTopic}
              onChange={(e) => setFilterTopic(e.target.value)}
            >
              <option value="All">All</option>
              {topics.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          <label className="text-slate-300">
            Subtopic:
            <select
              className="ml-2 rounded-lg bg-slate-700 border border-slate-600 px-2 py-1"
              value={filterSubtopic}
              onChange={(e) => setFilterSubtopic(e.target.value)}
              disabled={subtopics.length === 0}
            >
              <option value="All">All</option>
              {subtopics.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <label className="text-slate-300">
            Difficulty:
            <select
              className="ml-2 rounded-lg bg-slate-700 border border-slate-600 px-2 py-1"
              value={filterDiff}
              onChange={(e) => setFilterDiff(Number(e.target.value))}
            >
              <option value={0}>All</option>
              {[1, 2, 3, 4, 5].map((d) => (
                <option key={d} value={d}>
                  {"★".repeat(d)}
                </option>
              ))}
            </select>
          </label>

          <label className="text-slate-300 flex-1 min-w-[200px]">
            Search:
            <input
              type="text"
              className="ml-2 w-full rounded-lg bg-slate-700 border border-slate-600 px-2 py-1"
              placeholder="Search by ID, stem, or subtopic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </label>
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {filtered.map((q, idx) => (
            <QuestionReviewCard
              key={q.id}
              question={q}
              index={idx + 1}
              defaultExpanded={showAllAnswers}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            No questions match your filters.
          </div>
        )}
      </div>
    </div>
  );
}

function QuestionReviewCard({
  question,
  index,
  defaultExpanded = false,
}: {
  question: ActQuestion & { sourceFile?: string };
  index: number;
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  // Update expanded state when defaultExpanded prop changes
  useEffect(() => {
    setExpanded(defaultExpanded);
  }, [defaultExpanded]);

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-mono text-slate-400">#{index}</span>
            <span className="text-sm font-mono text-slate-400">
              {question.id}
            </span>
            <span className="px-2 py-1 rounded bg-slate-700 text-xs">
              {question.topic} — {question.subtopic}
            </span>
            <span className="text-yellow-400">
              {"★".repeat(question.diff)}
            </span>
            {question.sourceFile && (
              <span className="text-xs text-slate-500 font-mono">
                {question.sourceFile}
              </span>
            )}
          </div>

          <div className="prose prose-invert max-w-none mb-3">
            <StemDisplay text={question.stem} />
          </div>

          {expanded && (
            <div className="mt-4 space-y-4 border-t border-slate-700 pt-4">
              {/* Answer Choices */}
              <div>
                <h4 className="font-semibold mb-2 text-green-400">
                  Answer Choices:
                </h4>
                <ul className="space-y-2">
                  {question.choices.map((choice, i) => (
                    <li
                      key={i}
                      className={`p-3 rounded-lg border ${
                        i === question.answerIndex
                          ? "bg-emerald-900/30 border-emerald-600"
                          : "bg-slate-700/50 border-slate-600"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="font-semibold text-slate-300">
                          {String.fromCharCode(65 + i)}.
                        </span>
                        <div className="flex-1">
                          <div className="mb-1">
                            <InlinePieces text={choice.text} />
                          </div>
                          <div className="text-sm text-slate-400 italic">
                            <InlinePieces text={choice.rationale} />
                          </div>
                        </div>
                        {i === question.answerIndex && (
                          <span className="text-xs px-2 py-1 rounded bg-emerald-700">
                            ✓ Correct
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Solution Steps */}
              <div>
                <h4 className="font-semibold mb-2 text-blue-400">
                  Solution Steps:
                </h4>
                <ol className="list-decimal list-inside space-y-2 ml-2">
                  {question.solutionSteps.map((step, i) => (
                    <li key={i} className="text-slate-300">
                      <InlinePieces text={step} />
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="ml-4 px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 text-sm"
        >
          {expanded ? "▲ Hide" : "▼ Show"} Answers
        </button>
      </div>
    </div>
  );
}

/* ---------- LaTeX Rendering (aligned with QuestionCard) ---------- */

function StemDisplay({ text }: { text: string }) {
  const parts = splitBlocks(text);
  return (
    <>
      {parts.map((p, i) =>
        p.block ? (
          <BlockMath key={i} math={strip(p.content)} />
        ) : (
          <p key={i} className="whitespace-pre-wrap">
            <InlinePieces text={p.content} />
          </p>
        )
      )}
    </>
  );
}

function InlinePieces({ text }: { text: string }) {
  // Replace escaped dollar signs with a placeholder before processing
  const placeholder = "__DOLLAR__";
  const processedText = text.replace(/\\\$/g, placeholder);

  // If $...$ exists, render those inline segments as math
  if (/\$[^$]+\$/.test(processedText)) {
    const parts = processedText.split(/(\$[^$]+\$)/g);
    const elements: ReactNode[] = [];

    parts.forEach((part, i) => {
      if (!part) return;

      if (part.startsWith("$") && part.endsWith("$")) {
        const math = part.slice(1, -1).replace(new RegExp(placeholder, "g"), "$");
        elements.push(
          <InlineMath
            key={`math-${i}`}
            math={math}
            renderError={() => (
              <span className="whitespace-pre-wrap">{part}</span>
            )}
          />
        );
      } else {
        const restored = part.replace(new RegExp(placeholder, "g"), "$");
        elements.push(
          <span key={`text-${i}`} className="whitespace-pre-wrap">
            {restored}
          </span>
        );
      }
    });

    return <>{elements}</>;
  }

  // No inline math delimiters: plain text
  const textWithDollarsRestored = text.replace(/\\\$/g, "$");
  return (
    <span className="whitespace-pre-wrap">
      {textWithDollarsRestored}
    </span>
  );
}

function splitBlocks(s: string) {
  const out: { block: boolean; content: string }[] = [];
  const re = /(\$\$[\s\S]+?\$\$)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s)) !== null) {
    if (m.index > last) out.push({ block: false, content: s.slice(last, m.index) });
    out.push({ block: true, content: m[0] });
    last = re.lastIndex;
  }
  if (last < s.length) out.push({ block: false, content: s.slice(last) });
  return out;
}

const strip = (s: string) => s.replace(/^\${1,2}|\${1,2}$/g, "");
