/**
 * Allowing Code in Constructors Before super()
 * https://devblogs.microsoft.com/typescript/announcing-typescript-4-6-beta/#allowing-code-in-constructors-before-super
 */

const doSomeStuff = () => {
  console.log("something something する")
}
class Base {
  // ...
}

class Derived extends Base {
  someProperty = true;

  constructor() {
    // 怒られない
    doSomeStuff();
    super();
  }
}

