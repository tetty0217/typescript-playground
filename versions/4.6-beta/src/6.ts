/**
 * Object Rests Drop Unspreadable Members from Generic Objects
 * https://devblogs.microsoft.com/typescript/announcing-typescript-4-6-beta/#object-rests-drop-unspreadable-members-from-generic-objects
 */

class Thing {
  someProperty = 42;

  someMethod() {
    // ...
  }

  public pubSomeMethod() {
    // ...
  }
}

function foo<T extends Thing>(x: Thing) {
  let { someProperty, ...rest } = x;

  /**
   * let rest: Omit<T, "someProperty" | "someMethod">
   */
  rest.someMethod();
  // TS2339: Property 'someMethod' does not exist on type 'Omit '.
}


// class に限った話なので、今まで通りこういうのはOK
const hoge = {
  a: 1,
  b: 2,
  c: () => console.log(this.a)
}

function hogeFunc(p: typeof hoge){
  const {a, ...rest} = p
  rest.c()
}
