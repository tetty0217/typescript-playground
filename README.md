# typescript-playground v4.6-beta

## スケジュール

### イテレーションプラン

https://github.com/microsoft/TypeScript/issues/46858

### @typescript-eslint

https://github.com/typescript-eslint/typescript-eslint/issues/4471

※スケジュール未定；；


## Index
- [super前のコンストラクタでのコードの許可](#super前のコンストラクタでのコードの許可)
- [再帰深度チェックの改善](#再帰深度チェックの改善)
- [インデックス付きアクセス推論の改良](#インデックス付きアクセス推論の改良)
- [依存パラメータに対する制御フロー解析](#依存パラメータに対する制御フロー解析
  )
- [JavaScriptのシンタックスエラーとバインディングエラーの増加](#JavaScriptのシンタックスエラーとバインディングエラーの増加)
- [TypeScript Trace Analyzer](#TypeScript Trace Analyzer)
- [JavaScriptファイルには常に文法エラーとバインディングエラーが発生する](JavaScriptファイルには常に文法エラーとバインディングエラーが発生する)


## super前のコンストラクタでのコードの許可


| 4.5                               | 4.6-beta                               | 
|-----------------------------------|----------------------------------------|
| [Source](./versions/4.5/src/1.ts) | [Source](./versions/4.6-beta/src/1.ts) |

Class 構文を使う際に super が強制だったところ、ユースケースとして super 前に有益なコードが実行されることがあるので制限を緩和した変更。

```typescript
class Base {
    // ...
}

class Derived extends Base {
    someProperty = true;

    constructor() {
        // これはエラーとなっていたところ、許可されることになる
        doSomeStuff();
        super();
    }
}
```


## 再帰深度チェックの改善

| 4.5                               | 4.6-beta                               | 
|-----------------------------------|----------------------------------------|
| [Source](./versions/4.5/src/2.ts) | [Source](./versions/4.6-beta/src/2.ts) |


Generics の無限ネストによる推論の手抜きをある程度やめた変更（＋パフォーマンス改善）

```typescript
interface Source {
    prop: string;
}

interface Target {
    prop: number;
}

function check(source: Source, target: Target) {
    target = source;
    // 怒られが発生する。
    // Type 'Source' is not assignable to type 'Target'.
    //   Types of property 'prop' are incompatible.
    //     Type 'string' is not assignable to type 'number'.
}
```

当然ながら、Source と Target とでは同じ prop というメンバを持っているが互換性がない。

↓こいつなんで通るんだっけ・・・

```typescript
interface Source<T> {
    prop: Source<Source<T>>;
}

interface Target<T> {
    prop: Target<Target<T>>;
}

function check(source: Source<string>, target: Target<number>) {
    target = source;
}
```

上のようにしてみると通ってしまうんですよねー。

というのは、型システムの「型の無限拡張に対して、この型には実は互換性があるのでは？という可能性を得る」という気遣いにある。

これは困るのと、型チェックにかけるにあたってパフォーマンス面でもネガティブなので対応したとのこと。


```typescript
interface Foo<T> {
    prop: T;
}

declare let x: Foo<Foo<Foo<Foo<Foo<Foo<string>>>>>>;
declare let y: Foo<Foo<Foo<Foo<Foo<string>>>>>;

x = y;
```

上のケースは怒られが発生する。

ついでに、明示した型のご検出をスルーするようになったので、無限拡張をしている場合に検出する速度がかなり早まったそう。

「redux-immutable、react-lazylog、yup」などの DefinitelyTyped においてチェック時間が半減したとのこと。


## インデックス付きアクセス推論の改良

| 4.5                               | 4.6-beta                               | 
|-----------------------------------|----------------------------------------|
| [Source](./versions/4.5/src/3.ts) | [Source](./versions/4.6-beta/src/3.ts) |


MapObject に対する型のインデックスがリッチになった変更。

```typescript
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

processRecord({
    kind: "string",
    v: "hello!",

    // 'val' used to implicitly have the type 'string | number | boolean',
    // but now is correctly inferred to just 'string'.
    f: val => {
        console.log(val.toUpperCase());
    }
})
```

以前のバージョンまではこの `processRecord` の推論が貧しい状態だったので、場合によっては type assertion 等が必要だったところ、それが不要になったよという話。

[詳細](https://github.com/microsoft/TypeScript/pull/47109)


## 依存パラメータに対する制御フロー解析

| 4.5                               | 4.6-beta                               | 
|-----------------------------------|----------------------------------------|
| [Source](./versions/4.5/src/4.ts) | [Source](./versions/4.6-beta/src/4.ts) |


Union type を持つ Rest Parameter を宣言している時、処理の流れ（パラメータの依存）に沿って推論をしてくれるよという変更。

```typescript
type Func = (...args: ["a", number] | ["b", string]) => void;

const f1: Func = (kind, payload) => {
    if (kind === "a") {
        payload.toFixed();  // 'payload' narrowed to 'number'
    }
    if (kind === "b") {
        payload.toUpperCase();  // 'payload' narrowed to 'string'
    }
};

f1("a", 42);
f1("b", "hello");
```


## JavaScriptのシンタックスエラーとバインディングエラーの増加

| 4.5                               | 4.6-beta                               | 
|-----------------------------------|----------------------------------------|
| [Source](./versions/4.5/src/5.js) | [Source](./versions/4.6-beta/src/5.js) |

TypeScript Project において、JavaScript の Syntax Error と Binding Error を増やした変更。

（const の重複宣言をちゃんと怒るとか）

その他の変更
- Modifier の誤りを怒ってくれる
- `@ts-check ` という中々にダサいデコレーターをデコレートするのは不要になった


## TypeScript Trace Analyzer

generateTrace flag が使いづらいから、TypeScript のビルドパフォーマンスを検証するために作ったよ。つかってみてね。
- [@typescript/analyze-trace](https://www.npmjs.com/package/@typescript/analyze-trace)


# Breaking Changes 
## Object Rest による汎用オブジェクトからの未拡散メンバの削除

| 4.5                               | 4.6-beta                               | 
|-----------------------------------|----------------------------------------|
| [Source](./versions/4.5/src/6.ts) | [Source](./versions/4.6-beta/src/6.ts) |


Object を Rest Parameter で保持する場合の破壊的変更([背景](https://github.com/microsoft/TypeScript/pull/47078))

```typescript
class Thing {
    someProperty = 42;

    someMethod() {
        // ...
    }
}

function foo<T extends Thing>(x: T) {
    let { someProperty, ...rest } = x;

    // Used to work, is now an error!
    // Property 'someMethod' does not exist on type 'Omit<T, "someProperty" | "someMethod">'.
    rest.someMethod();
}
```

上記の現象の理由としては、TS は `..rest` が非属性型から構造化されたときにどのように動作するかをモデル化していないため。


## JavaScriptファイルには常に文法エラーとバインディングエラーが発生する

[JavaScriptのシンタックスエラーとバインディングエラーの増加](#avaScriptのシンタックスエラーとバインディングエラーの増加) の変更によるもの。

除外したい場合は `@ts-nocheck` を使う。


