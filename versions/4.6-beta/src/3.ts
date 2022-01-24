/**
 * Indexed Access Inference Improvements
 * https://devblogs.microsoft.com/typescript/announcing-typescript-4-6-beta/#indexed-access-inference-improvements
 */

interface TypeMap {
  "number": number;
  "string": string;
  "boolean": boolean;
}

type UnionRecord<P extends keyof TypeMap> = { [K in P]:
  {
    kind: K;
    v: TypeMap[K];
    f: (p: TypeMap[K]) => void;
  }
}[P];

function processRecord<K extends keyof TypeMap>(record: UnionRecord<K>) {
  record.f(record.v);
}

/**
 * function processRecord<"string">(
 *  record: {kind: "string", v: string, f: (p: string) => void}): void
 */
processRecord({
  kind: "string",
  v: "hello!",

  f: val => {
    console.log(val.toUpperCase());
    // ＾＾
  }
})
