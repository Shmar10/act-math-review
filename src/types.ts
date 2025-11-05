export type Choice = {
  text: string;
  rationale: string;
};

export type ActQuestion = {
  id: string;
  topic: string;
  subtopic: string;
  diff: number;
  stem: string;
  choices: Choice[];
  answerIndex: number;
  solutionSteps: string[];
};
