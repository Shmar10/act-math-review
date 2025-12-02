import { useEffect, useState, useRef } from "react";
import type { ReactNode } from "react";
import type { ActQuestion } from "../types";
import { BANKS } from "../data/banks";
import { InlineMath, BlockMath } from "react-katex";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

type ProblemSelection = {
  topic: string;
  subtopic: string;
  difficulty: number;
  question: ActQuestion | null;
};

type AnswerFormat = "answers-only" | "answers-with-steps";

export default function TeacherPrintPage() {
  const [allQuestions, setAllQuestions] = useState<ActQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [numProblems, setNumProblems] = useState(1);
  const [selections, setSelections] = useState<ProblemSelection[]>([]);
  const [generating, setGenerating] = useState(false);
  const [answerFormat, setAnswerFormat] = useState<AnswerFormat>("answers-only");
  const printRef = useRef<HTMLDivElement>(null);

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

  // Get unique topics and subtopics
  const topics = [...new Set(allQuestions.map((q) => q.topic))].sort();

  // Initialize selections when numProblems changes
  useEffect(() => {
    const newSelections: ProblemSelection[] = Array.from({ length: numProblems }, () => ({
      topic: "",
      subtopic: "",
      difficulty: 0,
      question: null,
    }));
    setSelections(newSelections);
  }, [numProblems]);

  // Get subtopics filtered by selected topic for a specific selection
  const getSubtopicsForSelection = (selection: ProblemSelection): string[] => {
    if (!selection.topic) return [];
    return [
      ...new Set(
        allQuestions
          .filter((q) => q.topic === selection.topic)
          .map((q) => q.subtopic)
      )
    ].sort();
  };

  // Handle selection change
  const handleSelectionChange = (index: number, field: keyof ProblemSelection, value: string | number) => {
    const newSelections = [...selections];
    const currentSelection = newSelections[index];
    
    // If topic changes, reset subtopic
    if (field === "topic" && value !== currentSelection.topic) {
      newSelections[index] = {
        topic: value as string,
        subtopic: "",
        difficulty: currentSelection.difficulty,
        question: null,
      };
    } else {
      newSelections[index] = {
        ...currentSelection,
        [field]: value,
        question: null, // Reset question when selection changes
      };
    }
    setSelections(newSelections);
  };

  // Get available questions for a selection
  const getAvailableQuestions = (selection: ProblemSelection): ActQuestion[] => {
    if (!selection.topic || !selection.subtopic) return [];

    return allQuestions.filter(
      (q) =>
        q.topic === selection.topic &&
        q.subtopic === selection.subtopic &&
        (selection.difficulty === 0 || q.diff === selection.difficulty)
    );
  };

  // Pick a random question for a selection
  const pickRandomQuestion = (index: number) => {
    const selection = selections[index];
    const available = getAvailableQuestions(selection);
    if (available.length === 0) return;

    const randomQuestion = available[Math.floor(Math.random() * available.length)];
    const newSelections = [...selections];
    newSelections[index] = {
      ...newSelections[index],
      question: randomQuestion,
    };
    setSelections(newSelections);
  };

  // Generate PDF
  const generatePDF = async () => {
    // Validate all selections have questions
    const allHaveQuestions = selections.every((s) => s.question !== null);
    if (!allHaveQuestions) {
      alert("Please select questions for all problem slots.");
      return;
    }

    setGenerating(true);
    
    try {
      // Wait a bit for rendering
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (!printRef.current) {
        alert("Error: Could not find content to print.");
        setGenerating(false);
        return;
      }

      // Create PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Get both pages (problems page and answer key page) - filter to only direct children
      const pages = Array.from(printRef.current.children).filter(
        (child) => child instanceof HTMLElement
      ) as HTMLElement[];
      
      // Process each page (problems page and answer key page)
      for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
        const pageElement = pages[pageIndex];
        
        // Capture this page
        const canvas = await html2canvas(pageElement, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
        });

        const imgData = canvas.toDataURL("image/png");
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 0;

        // Add new page if not the first
        if (pageIndex > 0) {
          pdf.addPage();
        }

        // Add image to PDF
        pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        
        // If content is taller than one page, split across pages
        let heightLeft = imgHeight * ratio;
        let position = 0;

        while (heightLeft > pdfHeight + 1) { // Add small buffer to prevent infinite loops
          position = heightLeft - pdfHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", imgX, -position, imgWidth * ratio, imgHeight * ratio);
          heightLeft -= pdfHeight;
        }
      }

      // Save PDF
      pdf.save(`ACT-Math-Practice-${new Date().toISOString().split("T")[0]}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen px-6 py-8 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">Loading questions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-8 bg-slate-900 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Teacher Print Generator</h1>
            <p className="text-slate-400">
              Select problems to generate a printable practice worksheet
            </p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("amr.teacher.auth");
              window.location.href = window.location.pathname;
            }}
            className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600"
          >
            ← Back to App
          </button>
        </div>

        {/* Problem Count and Answer Format Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <label className="block text-sm font-medium mb-2">
              Number of Problems
            </label>
            <select
              value={numProblems}
              onChange={(e) => setNumProblems(parseInt(e.target.value))}
              className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 focus:border-sky-500 focus:outline-none text-white"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <label className="block text-sm font-medium mb-2">
              Answer Key Format
            </label>
            <select
              value={answerFormat}
              onChange={(e) => setAnswerFormat(e.target.value as AnswerFormat)}
              className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 focus:border-sky-500 focus:outline-none text-white"
            >
              <option value="answers-only">Answers Only</option>
              <option value="answers-with-steps">Answers + Solution Steps</option>
            </select>
            <p className="text-xs text-slate-400 mt-2">
              Answers will be printed on a separate page
            </p>
          </div>
        </div>

        {/* Problem Selections */}
        <div className="space-y-4 mb-6">
          {selections.map((selection, index) => {
            const available = getAvailableQuestions(selection);
            return (
              <div
                key={index}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700"
              >
                <h3 className="text-lg font-semibold mb-4">
                  Problem {index + 1}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Topic
                    </label>
                    <select
                      value={selection.topic}
                      onChange={(e) =>
                        handleSelectionChange(index, "topic", e.target.value)
                      }
                      className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 focus:border-sky-500 focus:outline-none text-white"
                    >
                      <option value="">Select Topic...</option>
                      {topics.map((topic) => (
                        <option key={topic} value={topic}>
                          {topic}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Subtopic
                    </label>
                    <select
                      value={selection.subtopic}
                      onChange={(e) =>
                        handleSelectionChange(index, "subtopic", e.target.value)
                      }
                      disabled={!selection.topic}
                      className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 focus:border-sky-500 focus:outline-none text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Select Subtopic...</option>
                      {getSubtopicsForSelection(selection).map((subtopic) => (
                        <option key={subtopic} value={subtopic}>
                          {subtopic}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Difficulty
                    </label>
                    <select
                      value={selection.difficulty}
                      onChange={(e) =>
                        handleSelectionChange(
                          index,
                          "difficulty",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 focus:border-sky-500 focus:outline-none text-white"
                    >
                      <option value={0}>Any</option>
                      {[1, 2, 3, 4, 5].map((d) => (
                        <option key={d} value={d}>
                          Level {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => pickRandomQuestion(index)}
                      disabled={
                        !selection.topic ||
                        !selection.subtopic ||
                        available.length === 0
                      }
                      className="w-full px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      {selection.question
                        ? `✓ Selected (${available.length} available)`
                        : `Pick Random (${available.length} available)`}
                    </button>
                  </div>
                </div>
                {selection.question && (
                  <div className="mt-4 p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-slate-300">
                        Selected: {selection.question.id} (Difficulty: {selection.question.diff})
                      </p>
                      <button
                        onClick={() => pickRandomQuestion(index)}
                        className="text-xs px-3 py-1 rounded bg-slate-600 hover:bg-slate-500 text-slate-200"
                      >
                        Pick Different Question
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Generate PDF Button */}
        <div className="flex justify-center">
          <button
            onClick={generatePDF}
            disabled={
              generating ||
              selections.some((s) => s.question === null) ||
              selections.length === 0
            }
            className="px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold transition"
          >
            {generating ? "Generating PDF..." : "📄 Generate PDF"}
          </button>
        </div>

        {/* Hidden print preview */}
        <div ref={printRef} style={{ position: "absolute", left: "-9999px", top: 0 }}>
          {/* Problems Page */}
          <div className="bg-white text-black p-12" style={{ width: "210mm", minHeight: "297mm", fontFamily: "Arial, sans-serif" }}>
            <h2 className="text-3xl font-bold mb-8 text-center" style={{ marginBottom: "2rem" }}>
              ACT Math Practice Problems
            </h2>
            <div className="text-sm text-gray-600 mb-6 text-center">
              Generated: {new Date().toLocaleDateString()}
            </div>
            <div style={{ columnCount: 2, columnGap: "2rem", columnFill: "auto" }}>
              {selections.map((selection, index) => {
                if (!selection.question) return null;
                const q = selection.question;
                return (
                  <div key={index} className="mb-6 pb-6 border-b border-gray-300" style={{ marginBottom: "1.5rem", paddingBottom: "1rem", breakInside: "avoid", pageBreakInside: "avoid" }}>
                    <div className="mb-3">
                      <span className="text-sm font-semibold text-gray-700">
                        Problem {index + 1}
                      </span>
                      <div className="mt-2 text-base font-medium leading-relaxed" style={{ lineHeight: "1.6" }}>
                        <PrintStem text={q.stem} />
                      </div>
                    </div>
                    <ol className="list-[upper-alpha] list-inside space-y-2 ml-4" style={{ lineHeight: "1.6", fontSize: "0.9rem" }}>
                      {q.choices.map((choice, idx) => (
                        <li key={idx} style={{ marginBottom: "0.5rem" }}>
                          <PrintInlinePieces text={choice.text} />
                        </li>
                      ))}
                    </ol>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Answer Key Page */}
          <div className="bg-white text-black p-12" style={{ width: "210mm", minHeight: "297mm", fontFamily: "Arial, sans-serif", pageBreakBefore: "always" }}>
            <h2 className="text-3xl font-bold mb-8 text-center" style={{ marginBottom: "2rem" }}>
              Answer Key
            </h2>
            <div className="text-sm text-gray-600 mb-6 text-center">
              Generated: {new Date().toLocaleDateString()}
            </div>
            {selections.map((selection, index) => {
              if (!selection.question) return null;
              const q = selection.question;
              const correctChoice = q.choices[q.answerIndex];
              const choiceLetters = ["A", "B", "C", "D", "E"];
              
              return (
                <div key={index} className="mb-8 pb-6 border-b-2 border-gray-300" style={{ marginBottom: "2rem", paddingBottom: "1.5rem" }}>
                  <div className="mb-3">
                    <span className="text-lg font-bold text-gray-800">
                      Problem {index + 1}: {choiceLetters[q.answerIndex]}
                    </span>
                    <div className="mt-2 text-base text-gray-700">
                      <PrintInlinePieces text={correctChoice.text} />
                    </div>
                  </div>
                  
                  {answerFormat === "answers-with-steps" && q.solutionSteps && q.solutionSteps.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-300">
                      <h4 className="text-sm font-semibold text-gray-800 mb-3">Solution Steps:</h4>
                      <ol className="list-decimal list-inside space-y-2 ml-4" style={{ lineHeight: "1.8" }}>
                        {q.solutionSteps.map((step, stepIdx) => (
                          <li key={stepIdx} className="text-sm text-gray-700">
                            <PrintInlinePieces text={step} />
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions for rendering LaTeX in print preview (similar to QuestionCard)
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

function PrintStem({ text }: { text: string }) {
  const parts = splitBlocks(text);
  return (
    <>
      {parts.map((p, i) =>
        p.block ? (
          <BlockMath key={i} math={strip(p.content)} />
        ) : (
          <PrintInlinePieces key={i} text={p.content} />
        )
      )}
    </>
  );
}

function PrintInlinePieces({ text }: { text: string }) {
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
            renderError={() => <span>{part}</span>}
          />
        );
      } else {
        const restored = part.replace(new RegExp(placeholder, "g"), "$");
        elements.push(<span key={`text-${i}`}>{restored}</span>);
      }
    });

    return <>{elements}</>;
  }

  // No inline math delimiters: treat everything as plain text
  const textWithDollarsRestored = text.replace(/\\\$/g, "$");
  return <span>{textWithDollarsRestored}</span>;
}

