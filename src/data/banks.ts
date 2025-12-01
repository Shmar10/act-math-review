// src/data/banks.ts
export type Bank = {
  key: string;            // internal ID
  topic: string;          // top-level topic shown in the badge
  subtopic: string;       // subtopic shown in the badge and dropdown
  file: string;           // filename under public/content/questions
};

export const BANKS: Bank[] = [
  // ========== PRE-ALGEBRA & NUMBER SENSE ==========
  { key: "NUM-OPS", topic: "Pre-Algebra", subtopic: "Basic Operations", file: "number-operations.json" },
  { key: "NUM-FAC", topic: "Pre-Algebra", subtopic: "Factors & Multiples", file: "number-factors.json" },
  { key: "NUM-RAT", topic: "Pre-Algebra", subtopic: "Ratios & Proportions", file: "number-ratios.json" },

  // ========== ALGEBRA ==========
  { key: "ALG-MIX", topic: "Algebra", subtopic: "Mixed Practice", file: "algebra.json" },
  { key: "ALG-LIN", topic: "Algebra", subtopic: "Linear Equations", file: "algebra-linear.json" },
  { key: "ALG-INEQ", topic: "Algebra", subtopic: "Linear Inequalities", file: "algebra-linear-inequalities.json" },
  { key: "ALG-SYS", topic: "Algebra", subtopic: "Systems of Linear Equations", file: "algebra-systems.json" },
  { key: "ALG-EXP", topic: "Algebra", subtopic: "Exponents & Radicals", file: "algebra-exponents.json" },
  { key: "ALG-QUA", topic: "Algebra", subtopic: "Solving Quadratics", file: "algebra-quadratics.json" },
  { key: "ALG-ABS", topic: "Algebra", subtopic: "Absolute Value Equations", file: "algebra-absolute-value.json" },
  { key: "ALG-WRD", topic: "Algebra", subtopic: "Word Problems", file: "algebra-word-problems.json" },

  // ========== ALGEBRA II ==========
  { key: "A2-POL", topic: "Algebra II", subtopic: "Polynomials & Rational Expressions", file: "algebra2-polynomials.json" },
  { key: "A2-COM", topic: "Algebra II", subtopic: "Complex Numbers & Quadratics", file: "algebra2-complex.json" },

  // ========== FUNCTIONS ==========
  { key: "FUN-QUAD", topic: "Functions", subtopic: "Quadratic Functions", file: "functions-quadratic.json" },
  { key: "FUN-TRN", topic: "Functions", subtopic: "Transformations & Composition", file: "functions-transformations.json" },

  // ========== COORDINATE GEOMETRY ==========
  { key: "COO-DST", topic: "Coordinate Geometry", subtopic: "Distance & Midpoint", file: "coord-geometry-distance-midpoint.json" },
  { key: "COO-LNP", topic: "Coordinate Geometry", subtopic: "Lines & Parabolas", file: "coord-geometry-lines-parabolas.json" },
  { key: "COO-CIR", topic: "Coordinate Geometry", subtopic: "Circles", file: "coord-geometry-circles.json" },

  // ========== GEOMETRY ==========
  { key: "GEO-ANG", topic: "Geometry", subtopic: "Angles & Lines", file: "geometry-angles.json" },
  { key: "GEO-TRI", topic: "Geometry", subtopic: "Triangles", file: "geometry-triangles.json" },
  { key: "GEO-CIR", topic: "Geometry", subtopic: "Circles", file: "geometry-circles.json" },
  { key: "GEO-POL", topic: "Geometry", subtopic: "Polygons & Area", file: "geometry-polygons.json" },
  { key: "GEO-3D", topic: "Geometry", subtopic: "3D Shapes & Volume", file: "geometry-3d.json" },

  // ========== TRIGONOMETRY ==========
  { key: "TRI-RGT", topic: "Trigonometry", subtopic: "Right Triangles", file: "trig-right-triangles.json" },
  { key: "TRI-UNT", topic: "Trigonometry", subtopic: "Unit Circle", file: "trig-unit-circle.json" },
  { key: "TRI-GRA", topic: "Trigonometry", subtopic: "Graphs", file: "trig-graphs.json" },
  { key: "TRI-IDN", topic: "Trigonometry", subtopic: "Identities & Advanced", file: "trig-identities.json" },

  // ========== STATISTICS & PROBABILITY ==========
  { key: "STA-DAT", topic: "Statistics", subtopic: "Data Analysis", file: "stats-data-analysis.json" },
  { key: "STA-PRO", topic: "Statistics", subtopic: "Probability", file: "stats-probability.json" },
  { key: "PRB-ADV", topic: "Probability", subtopic: "Advanced Probability", file: "probability-advanced.json" },

  // ========== PRECALCULUS ==========
  { key: "PRE-FUN", topic: "Precalculus", subtopic: "Functions & Graphs", file: "precalc-functions.json" },
  { key: "PRE-LOG", topic: "Precalculus", subtopic: "Logarithms & Exponentials", file: "precalc-logs.json" },
  { key: "PRE-SEQ", topic: "Precalculus", subtopic: "Sequences & Series", file: "precalc-sequences.json" },
  { key: "PRE-CON", topic: "Precalculus", subtopic: "Conic Sections", file: "conic-sections.json" },

  // ========== ADVANCED TOPICS (Less Common) ==========
  { key: "ADV-MAT", topic: "Number & Quantity", subtopic: "Matrices", file: "matrices.json" },
  { key: "ADV-VEC", topic: "Advanced", subtopic: "Vectors", file: "vectors.json" }
];
