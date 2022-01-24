/**
 * Improved Recursion Depth Checks
 * https://devblogs.microsoft.com/typescript/announcing-typescript-4-6-beta/#improved-recursion-depth-checks
 */

namespace First {
  interface Source {
    prop: string;
  }

  interface Target {
    prop: number;
  }

  function check(source: Source, target: Target) {
    target = source;
    // error!
    // Type 'Source' is not assignable to type 'Target'.
    //   Types of property 'prop' are incompatible.
    //     Type 'string' is not assignable to type 'number'.
  }
}

namespace Second {
  interface Source<T> {
    prop: Source<Source<T>>;
  }

  interface Target<T> {
    prop: Target<Target<T>>;
  }

  function check(source: Source<string>, target: Target<number>) {
    // 怒られない
    target = source;
  }
}


namespace Third {
  interface Foo<T> {
    prop: T;
  }

  declare let x: Foo<Foo<Foo<Foo<Foo<Foo<string>>>>>>;
  declare let y: Foo<Foo<Foo<Foo<Foo<string>>>>>;

  x = y;
  // 怒られる
  /**
   * TS2322: Type 'Foo<Foo<Foo<Foo<Foo<string>>>>>' is not assignable to type 'Foo<Foo<Foo<Foo<Foo<Foo<string>>>>>>'.
   *  Type 'Foo<Foo<Foo<Foo<string>>>>' is not assignable to type 'Foo<Foo<Foo<Foo<Foo<string>>>>>'.
   *    Type 'Foo<Foo<Foo<string>>>' is not assignable to type 'Foo<Foo<Foo<Foo<string>>>>'.
   *      Type 'Foo<Foo<string>>' is not assignable to type 'Foo<Foo<Foo<string>>>'.
   *        Type 'Foo<string>' is not assignable to type 'Foo<Foo<string>>'.
   *          Type 'string' is not assignable to type 'Foo<string>'.
   */
}
