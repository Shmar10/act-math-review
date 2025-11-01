export type Choice = { label: string; text: string; rationale: string };

export type ActQuestion = {
  id: string;
  topic: string;
  subtopic: string;
  diff: 1 | 2 | 3 | 4 | 5;   // difficulty stars
  stem: string;              // LaTeX allowed with $...$ or $$...$$
  choices: Choice[];         // A–E typically
  answerIndex: number;       // correct index into choices
  solutionSteps: string[];   // ordered explanation
};
