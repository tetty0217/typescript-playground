/**
 * More Syntax and Binding Errors in JavaScript
 * https://devblogs.microsoft.com/typescript/announcing-typescript-4-6-beta/#more-syntax-and-binding-errors-in-javascript
 */

const foo = 1234;
// error: Cannot redeclare block-scoped variable 'foo'.

const foo = 5678;
// error: Cannot redeclare block-scoped variable 'foo'.

function container() {
    export function foo() {
    // TS1184: Modifiers cannot appear here.
    }
}
