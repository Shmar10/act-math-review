// src/data/banks.ts
export type Bank = {
  key: string;            // internal ID
  topic: string;          // top-level topic shown in the badge
  subtopic: string;       // subtopic shown in the badge and dropdown
  file: string;           // filename under public/content/questions
};

export const BANKS: Bank[] = [
  // Algebra (your original mixed bank with 2 items)
  { key: "ALG-LIN", topic: "Algebra", subtopic: "Linear Equations", file: "algebra.json" },

  // Number & Quantity
  { key: "NUM-RAT", topic: "Number & Quantity", subtopic: "Ratios & Proportions", file: "number-quantity-ratios.json" },

  // Geometry
  { key: "GEO-TRI", topic: "Geometry", subtopic: "Triangles", file: "geometry-triangles.json" },
  { key: "GEO-CIR", topic: "Geometry", subtopic: "Circles", file: "geometry-circles.json" },

  // Trig
  { key: "TRI-RGT", topic: "Trigonometry", subtopic: "Right Triangles", file: "trig-right.json" },

  // Stats & Probability
  { key: "STA-PRO", topic: "Statistics & Probability", subtopic: "Core Skills", file: "stats-prob.json" },

  // Precalculus
  { key: "PRE-FUN", topic: "Precalculus", subtopic: "Functions & Graphs", file: "precalc-functions.json" },
  { key: "PRE-LOG", topic: "Precalculus", subtopic: "Logarithms & Exponentials", file: "precalc-logs.json" },
  { key: "PRE-SEQ", topic: "Precalculus", subtopic: "Sequences & Series", file: "precalc-sequences.json" },

  // Coordinate Geometry
  { key: "COO-LNP", topic: "Coordinate Geometry", subtopic: "Lines & Parabolas", file: "coord-geometry-lines-parabolas.json" },

  // Algebra II
  { key: "A2-POL", topic: "Algebra II", subtopic: "Polynomials & Rational Expressions", file: "algebra2-polynomials.json" },
  { key: "A2-COM", topic: "Algebra II", subtopic: "Complex Numbers & Quadratics", file: "algebra2-complex.json" }
];
