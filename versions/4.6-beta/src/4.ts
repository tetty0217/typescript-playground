/**
 * Control Flow Analysis for Dependent Parameters
 * https://devblogs.microsoft.com/typescript/announcing-typescript-4-6-beta/#control-flow-analysis-for-dependent-parameters
 */

type Func = (...args: ["a", number] | ["b", string]) => void;

/**
 * function f1(kind: any, payload: any): void
 */
const f1: Func = (kind, payload) => {
  if (kind === "a") {
    payload.toFixed(); // payload: number
  }
  if (kind === "b") {
    payload.toUpperCase();  // payload: string
  }
};

f1("a", 42);
f1("b", "hello");
