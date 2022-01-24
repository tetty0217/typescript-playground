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
    payload.toFixed();  // string | number
    // TS2339: Property 'toFixed' does not exist on type 'string | number'.
    //         Property 'toFixed' does not exist on type 'string'.
  }
  if (kind === "b") {
    payload.toUpperCase(); // string | number
    // TS2339: Property 'toUpperCase' does not exist on type 'string | number'.
    //         Property 'toUpperCase' does not exist on type 'number'.
  }
};

f1("a", 42);
f1("b", "hello");
