/**
 * Object Rests Drop Unspreadable Members from Generic Objects
 * https://devblogs.microsoft.com/typescript/announcing-typescript-4-6-beta/#object-rests-drop-unspreadable-members-from-generic-objects
 */

class Thing {
  someProperty = 42;

  someMethod() {
    // ...
  }
}

function foo<T extends Thing>(x: T) {
  let { someProperty, ...rest } = x;

  /**
   * let rest: Omit<T, "someProperty">
   */
  rest.someMethod(); // OK
}
