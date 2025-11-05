import { useEffect, useMemo, useState } from "react";
import { InlineMath, BlockMath } from "react-katex";
import type { ActQuestion, Choice } from "../types";

type Props = {
  question: ActQuestion;
  onNext?: () => void;
  onResult?: (correct: boolean, id: string) => void;
};

// --- shuffle utilities ---
type Shuffled = { choices: Choice[]; correctIndex: number; map: number[] };

function shuffleChoices(q: ActQuestion): Shuffled {
  // Create a shuffled index map so we can re-order choices
  const idxs = q.choices.map((_, i) => i);
  for (let i = idxs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idxs[i], idxs[j]] = [idxs[j], idxs[i]];
  }
  const choices = idxs.map((i) => q.choices[i]);
  const correctIndex = idxs.indexOf(q.answerIndex);
  return { choices, correctIndex, map: idxs };
}

export default function QuestionCard({ question, onNext, onResult }: Props) {
  const [shuf, setShuf] = useState<Shuffled>(() => shuffleChoices(question));
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [showSteps, setShowSteps] = useState(false);

  // Re-shuffle when the question changes
  useEffect(() => {
    setShuf(shuffleChoices(question));
    setSelected(null);
    setChecked(false);
    setShowSteps(false);
  }, [question.id]);

  const isCorrect = useMemo(
    () => checked && selected !== null && selected === shuf.correctIndex,
    [checked, selected, shuf.correctIndex]
  );

  // fixed letters A–E (or as many as needed)
  const LETTERS = useMemo(() => {
    const all = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    return all.slice(0, shuf.choices.length);
  }, [shuf.choices.length]);

  return (
    <div className="bg-slate-800/70 rounded-2xl p-6 border border-slate-700 shadow-xl">
      <div className="mb-3 flex items-center gap-3 text-xs text-slate-300">
        <span className="px-2 py-1 rounded bg-slate-900/60">
          {question.topic} — {question.subtopic}
        </span>
        <span aria-label={`difficulty ${question.diff}`}>{"★".repeat(question.diff)}</span>
      </div>

      <div className="prose prose-invert max-w-none mb-6">
        <Stem text={question.stem} />
      </div>

      <ul className="space-y-2 mb-4">
        {LETTERS.map((letter, i) => {
          const choice = shuf.choices[i];
          const chosen = selected === i;
          const correct = checked && i === shuf.correctIndex;
          const wrong = checked && chosen && i !== shuf.correctIndex;

          return (
            <li key={letter}>
              <button
                onClick={() => setSelected(i)}
                disabled={checked}
                className={[
                  "w-full text-left px-4 py-3 rounded-xl border transition",
                  chosen && !checked && "border-sky-400 bg-sky-900/30",
                  correct && "border-emerald-400 bg-emerald-900/30",
                  wrong && "border-rose-400 bg-rose-900/30",
                  !chosen && !checked &&
                    "border-slate-600 hover:border-slate-500 hover:bg-slate-800/40",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <span className="font-semibold mr-2">{letter}.</span>
                {/* Render the shuffled choice text (labels on the left stay A–E) */}
                <InlinePieces text={choice.text} />
              </button>

              {/* Show rationale for the chosen option + the correct option */}
              {checked && (selected === i || i === shuf.correctIndex) && (
                <div className="mt-1 ml-4 text-sm text-slate-300 italic">
                  {choice.rationale}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <div className="flex gap-2">
        <button
          onClick={() => {
            if (selected !== null) {
              setChecked(true);
              onResult?.(selected === shuf.correctIndex, question.id);
            }
          }}
          disabled={selected === null || checked}
          className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50"
        >
          {checked ? "Checked" : "Check Answer"}
        </button>

        <button
          onClick={() => setShowSteps((s) => !s)}
          className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600"
        >
          {showSteps ? "Hide Solution" : "Show Solution"}
        </button>

        <button
          onClick={onNext}
          disabled={!checked}
          className="ml-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {(showSteps || (checked && !isCorrect)) && (
        <ol className="mt-5 space-y-2 text-slate-200">
          {question.solutionSteps.map((s, idx) => (
            <li key={idx} className="bg-slate-900/50 rounded-lg p-3">
              <InlinePieces text={s} />
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

/* -------- KaTeX helpers (inline/block + tolerant inline parser) -------- */

function Stem({ text }: { text: string }) {
  const parts = splitBlocks(text);
  return (
    <>
      {parts.map((p, i) =>
        p.block ? (
          <BlockMath key={i} math={strip(p.content)} />
        ) : (
          <p key={i}>
            <InlinePieces text={p.content} />
          </p>
        )
      )}
    </>
  );
}

function InlinePieces({ text }: { text: string }) {
  // If already delimited with $...$, render those segments inline
  if (/\$[^$]+\$/.test(text)) {
    const segs = text.split(/(\$[^$]+\$)/g);
    return (
      <>
        {segs.map((seg, i) =>
          seg.startsWith("$") && seg.endsWith("$") ? (
            <InlineMath
              key={i}
              math={seg.slice(1, -1)}
              renderError={() => <span>{seg}</span>}
            />
          ) : (
            <span key={i}>{seg}</span>
          )
        )}
      </>
    );
  }
  // Heuristic: attempt inline math if it "looks like" math/LaTeX
  const looksMath = /\\|[\^_=+\-*/()]/.test(text);
  return looksMath ? (
    <InlineMath math={text} renderError={() => <span>{text}</span>} />
  ) : (
    <span>{text}</span>
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
