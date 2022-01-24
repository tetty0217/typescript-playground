/**
 * More Syntax and Binding Errors in JavaScript
 * https://devblogs.microsoft.com/typescript/announcing-typescript-4-6-beta/#more-syntax-and-binding-errors-in-javascript
 */

const foo = 1234;

const foo = 5678;

function container() {
    export function foo() {
//  ~~~~~~
// error: Modifiers cannot appear here.

    }
}
