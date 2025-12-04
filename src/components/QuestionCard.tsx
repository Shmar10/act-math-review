import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { InlineMath, BlockMath } from "react-katex";
import type { ActQuestion, Choice } from "../types";

type Props = {
  question: ActQuestion;
  onNext?: () => void;
  onResult?: (correct: boolean, id: string) => void;
  studyMode?: boolean;
};

// ---------- shuffle utilities ----------
type Shuffled = { choices: Choice[]; correctIndex: number; map: number[] };

function shuffleChoices(q: ActQuestion): Shuffled {
  const idxs = q.choices.map((_, i) => i);
  for (let i = idxs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idxs[i], idxs[j]] = [idxs[j], idxs[i]];
  }
  const choices = idxs.map((i) => q.choices[i]);
  const correctIndex = idxs.indexOf(q.answerIndex);
  return { choices, correctIndex, map: idxs };
}

export default function QuestionCard({
  question,
  onNext,
  onResult,
  studyMode = false,
}: Props) {
  const [shuf, setShuf] = useState<Shuffled>(() => shuffleChoices(question));
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [distractors, setDistractors] = useState<Set<number>>(new Set());

  // Re-shuffle on question change
  useEffect(() => {
    setShuf(shuffleChoices(question));
    setSelected(null);
    setChecked(false);
    setShowSteps(false);
    setDistractors(new Set());
  }, [question.id]);

  const isCorrect = useMemo(
    () => checked && selected !== null && selected === shuf.correctIndex,
    [checked, selected, shuf.correctIndex]
  );

  return (
    <div className="bg-slate-800/70 rounded-2xl p-6 border border-slate-700 shadow-xl">
      <div className="mb-3 flex items-center gap-3 text-xs text-slate-300">
        <span className="px-2 py-1 rounded bg-slate-900/60">
          {question.topic} — {question.subtopic}
        </span>
        <span aria-label={`difficulty ${question.diff}`}>
          {"★".repeat(question.diff)}
        </span>
      </div>

      <div className="prose prose-invert max-w-none mb-6">
        <Stem text={question.stem} />
      </div>

      <ul className="space-y-2 mb-4">
        {shuf.choices.map((choice, i) => {
          const letter = String.fromCharCode(65 + i); // A, B, C, ...
          const chosen = selected === i;
          const correct = checked && i === shuf.correctIndex;
          const wrong = checked && chosen && i !== shuf.correctIndex;
          const isDistractor = distractors.has(i);

          return (
            <li key={shuf.map[i]}>
              <div className="relative flex items-center">
                {isDistractor && (
                  <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-red-500 z-10 pointer-events-none" style={{ transform: 'translateY(-50%)' }} />
                )}
                <button
                  onClick={() => setSelected(i)}
                  disabled={checked}
                  className={[
                    "flex-1 text-left px-4 py-3 rounded-xl border transition relative",
                    isDistractor && "line-through decoration-red-500 decoration-2",
                    chosen && !checked && "border-sky-400 bg-sky-900/30",
                    correct && "border-emerald-400 bg-emerald-900/30",
                    wrong && "border-rose-400 bg-rose-900/30",
                    !chosen &&
                      !checked &&
                      "border-slate-600 hover:border-slate-500 hover:bg-slate-800/40",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <span className="font-semibold mr-2">{letter}.</span>
                  <InlinePieces text={choice.text} />
                </button>
                <label className="ml-2 flex items-center cursor-pointer px-2 relative z-20" title="Mark as distractor">
                  <input
                    type="checkbox"
                    checked={isDistractor}
                    onChange={(e) => {
                      e.stopPropagation();
                      const newDistractors = new Set(distractors);
                      if (e.target.checked) {
                        newDistractors.add(i);
                      } else {
                        newDistractors.delete(i);
                      }
                      setDistractors(newDistractors);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-5 h-5 rounded border-2 border-slate-500 bg-slate-700 text-red-500 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-800 cursor-pointer accent-red-500 relative z-20"
                  />
                </label>
              </div>

              {checked && (selected === i || i === shuf.correctIndex) && (
                <div className="mt-1 ml-4 text-sm text-slate-300 italic">
                  <InlinePieces text={choice.rationale} />
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
          onClick={onNext}
          disabled={!checked}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50"
        >
          Next
        </button>

        <button
          onClick={() => {
            const wasShowing = showSteps;
            setShowSteps((s) => !s);
            // If showing solution for the first time without selecting an answer, mark as incorrect and enable next
            // If they've selected an answer, allow them to still check it
            if (!wasShowing && !checked && selected === null) {
              setChecked(true);
              onResult?.(false, question.id);
            }
          }}
          className="ml-auto px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600"
        >
          {showSteps ? "Hide Solution" : "Show Solution"}
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

/* ---------- KaTeX helpers (inline + block) ---------- */

function Stem({ text }: { text: string }) {
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
        // Math expression
        const math = part.slice(1, -1).replace(new RegExp(placeholder, "g"), "$");
        elements.push(
          <InlineMath
            key={`math-${i}`}
            math={math}
            renderError={() => <span className="whitespace-pre-wrap">{part}</span>}
          />
        );
      } else {
        // Plain text segment
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

  // No inline math delimiters: treat everything as plain text
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
