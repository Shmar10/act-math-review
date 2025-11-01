// src/global.d.ts
declare module "react-katex" {
  import * as React from "react";

  export interface MathProps {
    math: string;
    errorColor?: string;
    renderError?: (error: unknown) => React.ReactNode;
  }

  export const InlineMath: React.FC<MathProps>;
  export const BlockMath: React.FC<MathProps>;
  const _default: any;
  export default _default;
}
