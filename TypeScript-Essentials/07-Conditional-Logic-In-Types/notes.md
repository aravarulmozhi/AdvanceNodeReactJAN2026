# Topic 07 - Conditional Logic in Types

## Overview

Conditional types let you express **type-level if/else logic**. They are one of TypeScript's most powerful features, enabling types that adapt based on the shape of other types. This topic builds on your understanding of generics and unions from previous sessions.

---

## 1. The `extends` Keyword in Different Contexts

The `extends` keyword appears in three distinct contexts in TypeScript. Understanding each is critical before diving into conditional types.

### 1a. Interface Extension

When used with interfaces (or classes), `extends` means **inheritance** -- "B has everything A has, plus more."

```ts
interface Animal {
  name: string;
  age: number;
}

interface Dog extends Animal {
  breed: string;
}

// Dog now has: name, age, and breed
const myDog: Dog = {
  name: "Rex",
  age: 5,
  breed: "German Shepherd",
};
```

You can extend multiple interfaces:

```ts
interface Serializable {
  serialize(): string;
}

interface Loggable {
  log(): void;
}

interface Model extends Serializable, Loggable {
  id: number;
}
```

### 1b. Generic Constraints

When used in generic type parameters, `extends` means **constraint** -- "T must be assignable to SomeType."

```ts
// T must have at least a 'length' property of type number
function getLength<T extends { length: number }>(item: T): number {
  return item.length;
}

getLength("hello");     // OK -- string has .length
getLength([1, 2, 3]);   // OK -- array has .length
// getLength(42);        // Error -- number has no .length
```

Another example constraining T to specific types:

```ts
function formatId<T extends string | number>(id: T): string {
  return `ID-${id}`;
}

formatId("abc");   // OK
formatId(123);     // OK
// formatId(true); // Error -- boolean does not extend string | number
```

### 1c. Conditional Types

When used in a **ternary-style expression at the type level**, `extends` means **"is assignable to"** -- it acts as a type-level condition.

```ts
// Syntax: T extends U ? TrueType : FalseType
//
// Read as: "If T is assignable to U, then the type is TrueType,
//           otherwise the type is FalseType."

type IsString<T> = T extends string ? true : false;

type A = IsString<string>;  // true
type B = IsString<number>;  // false
type C = IsString<"hello">; // true -- "hello" extends string
```

---

## 2. Basic Conditional Types

### Simple Boolean Check

```ts
type IsString<T> = T extends string ? true : false;

type Test1 = IsString<string>;    // true
type Test2 = IsString<"hello">;   // true  (literal extends its base type)
type Test3 = IsString<number>;    // false
type Test4 = IsString<42>;        // false
```

### Filtering with `never`

The `never` type is the "bottom type" -- it represents the empty set. When used in a union, `never` disappears. This makes it perfect for filtering.

```ts
// Our own version of the built-in NonNullable<T>
type MyNonNullable<T> = T extends null | undefined ? never : T;

type Result1 = MyNonNullable<string | null>;           // string
type Result2 = MyNonNullable<number | undefined>;      // number
type Result3 = MyNonNullable<string | null | undefined>; // string
type Result4 = MyNonNullable<null>;                    // never
```

### Returning Transformed Types

Conditional types can return any type, not just `true`/`false`:

```ts
type Wrap<T> = T extends string ? string[] : T extends number ? number[] : T;

type W1 = Wrap<string>;  // string[]
type W2 = Wrap<number>;  // number[]
type W3 = Wrap<boolean>; // boolean (falls through to the else)
```

---

## 3. Distributive Conditional Types

This is arguably the most important (and most confusing) behavior of conditional types in TypeScript.

### The Rule

> When a conditional type acts on a **naked type parameter** that is a **union type**, it **distributes** over each member of the union individually.

### What "Distributes" Means

```ts
type ToArray<T> = T extends any ? T[] : never;

// When T = string | number, distribution happens:
// Step 1: Apply to string  => string extends any ? string[]  : never => string[]
// Step 2: Apply to number  => number extends any ? number[]  : never => number[]
// Step 3: Union the results => string[] | number[]

type Result = ToArray<string | number>; // string[] | number[]
```

**Without distribution**, you might expect `(string | number)[]` -- a single array that can hold both. But distribution gives you `string[] | number[]` -- either a string array OR a number array.

### Another Example: Filtering Unions

```ts
type ExtractStrings<T> = T extends string ? T : never;

type Mixed = string | number | "hello" | boolean | "world";
type OnlyStrings = ExtractStrings<Mixed>;
// Distribution:
//   string  extends string ? string  : never => string
//   number  extends string ? number  : never => never
//   "hello" extends string ? "hello" : never => "hello"
//   boolean extends string ? boolean : never => never
//   "world" extends string ? "world" : never => "world"
// Union: string | never | "hello" | never | "world"
// Simplified: string  (since "hello" and "world" are subtypes of string)
type Result = OnlyStrings; // string
```

### What "Naked Type Parameter" Means

Distribution ONLY happens when the type parameter is used directly (naked), not wrapped in anything:

```ts
// Naked T -- distribution WILL happen
type Distributed<T> = T extends string ? "yes" : "no";

// Wrapped T -- distribution will NOT happen
type NotDistributed<T> = [T] extends [string] ? "yes" : "no";
```

### Preventing Distribution with the Tuple Trick

Sometimes you want to check the union **as a whole**, not each member. Wrap both sides in a tuple:

```ts
type IsStringDistributed<T> = T extends string ? true : false;
type IsStringNonDistributed<T> = [T] extends [string] ? true : false;

// With string | number:
type D = IsStringDistributed<string | number>;
// Distributes: (string extends string ? true : false) | (number extends string ? true : false)
// = true | false
// = boolean

type ND = IsStringNonDistributed<string | number>;
// Does NOT distribute: [string | number] extends [string] ? true : false
// string | number is NOT assignable to string
// = false
```

This is a critical distinction:
- **Distributed result**: `boolean` (i.e., `true | false`)
- **Non-distributed result**: `false`

### Practical Use: Detecting `never`

The `never` type is an empty union. Distribution over an empty union produces `never` without ever evaluating the branches. This means:

```ts
type IsNever<T> = T extends never ? true : false;

// This does NOT work as expected!
type Test = IsNever<never>; // never (not true!)
// Because: distributing over an empty union yields never

// Fix: prevent distribution
type IsNeverFixed<T> = [T] extends [never] ? true : false;

type Test2 = IsNeverFixed<never>;  // true
type Test3 = IsNeverFixed<string>; // false
```

---

## 4. Nested Conditional Types

You can chain conditional types like nested ternaries:

```ts
type TypeName<T> =
  T extends string ? "string" :
  T extends number ? "number" :
  T extends boolean ? "boolean" :
  T extends undefined ? "undefined" :
  T extends null ? "null" :
  T extends Function ? "function" :
  T extends Array<any> ? "array" :
  "object";

type T1 = TypeName<string>;         // "string"
type T2 = TypeName<42>;             // "number"
type T3 = TypeName<true>;           // "boolean"
type T4 = TypeName<undefined>;      // "undefined"
type T5 = TypeName<null>;           // "null"
type T6 = TypeName<() => void>;     // "function"
type T7 = TypeName<number[]>;       // "array"
type T8 = TypeName<{ a: 1 }>;       // "object"
```

### Nested with Distribution

Remember, if T is a union, the nested conditional distributes over each member:

```ts
type T9 = TypeName<string | number>;  // "string" | "number"
type T10 = TypeName<string | null>;   // "string" | "null"
```

---

## 5. Real-World Examples

### Example 1: Extracting Array Element Types

```ts
type Flatten<T> = T extends Array<infer U> ? U : T;

type F1 = Flatten<string[]>;    // string
type F2 = Flatten<number[][]>;  // number[] (only one level)
type F3 = Flatten<string>;      // string (not an array, return as-is)
```

(We use `infer` here -- see the teaser section below.)

### Example 2: Making Properties Optional Based on Type

```ts
type StringKeysOptional<T> = {
  [K in keyof T as T[K] extends string ? K : never]?: T[K];
} & {
  [K in keyof T as T[K] extends string ? never : K]: T[K];
};

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

type FlexibleUser = StringKeysOptional<User>;
// { name?: string; email?: string } & { id: number; age: number }
```

### Example 3: Exclude and Extract (Built-in Utility Types)

These are built-in conditional types that are very commonly used:

```ts
// Built-in definitions:
// type Exclude<T, U> = T extends U ? never : T;
// type Extract<T, U> = T extends U ? T : never;

type Letters = "a" | "b" | "c" | "d";

type WithoutAB = Exclude<Letters, "a" | "b">;  // "c" | "d"
type OnlyAB = Extract<Letters, "a" | "b">;      // "a" | "b"
```

### Example 4: Function Overload Resolution

```ts
type IsVoidFunction<T> = T extends (...args: any[]) => void ? true : false;

type R1 = IsVoidFunction<() => void>;        // true
type R2 = IsVoidFunction<() => string>;       // true (string is assignable to void in this context)
type R3 = IsVoidFunction<(x: number) => void>; // true
type R4 = IsVoidFunction<string>;              // false
```

---

## 6. Brief Intro to `infer` (Teaser)

The `infer` keyword lets you **declare a type variable within the extends clause** and capture part of a type. It only works inside conditional types.

> Full coverage of `infer` and advanced patterns will be in the Advanced Conditional Types session. This is just a preview.

### Basic Syntax

```ts
// T extends (pattern with infer R) ? (use R) : (fallback)

type GetReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type RT1 = GetReturnType<() => string>;          // string
type RT2 = GetReturnType<(x: number) => boolean>; // boolean
type RT3 = GetReturnType<string>;                 // never (not a function)
```

### How It Works

Think of `infer R` as a **placeholder** that TypeScript fills in by pattern-matching:

1. TypeScript checks: "Does T match the pattern `(...args: any[]) => ???`?"
2. If yes, whatever `???` is gets captured as `R`, and you can use `R` in the true branch.
3. If no, the false branch is used.

### A Few More Teasers

```ts
// Extract the first parameter type
type FirstParam<T> = T extends (first: infer P, ...rest: any[]) => any ? P : never;

type FP1 = FirstParam<(name: string, age: number) => void>; // string
type FP2 = FirstParam<() => void>;                           // never

// Extract element type from an array
type ElementOf<T> = T extends (infer E)[] ? E : never;

type E1 = ElementOf<string[]>;  // string
type E2 = ElementOf<number[]>;  // number
type E3 = ElementOf<string>;    // never

// Extract the resolved type from a Promise
type Awaited<T> = T extends Promise<infer U> ? U : T;

type A1 = Awaited<Promise<string>>;  // string
type A2 = Awaited<Promise<number>>;  // number
type A3 = Awaited<string>;           // string (not a promise, return as-is)
```

---

## 7. How This Connects to Advanced Conditional Types

This topic establishes the **foundation**. Here is what we covered and what comes next:

| This Session (Foundation)                     | Advanced Session (Deep Dive)                        |
|-----------------------------------------------|-----------------------------------------------------|
| `extends` as a condition                      | Complex multi-level conditions                      |
| Basic `true : false` patterns                 | Pattern matching with `infer`                       |
| Distributive behavior and prevention          | Advanced distribution control                       |
| Simple `infer` teaser                         | `infer` in multiple positions                       |
| `never` as a filter                           | `never` behavior edge cases                         |
| Nested conditionals                           | Recursive conditional types                         |
| Built-in `Exclude`, `Extract`                 | Building complex utility types from scratch         |

---

## Key Takeaways

1. **Conditional types** use the syntax `T extends U ? X : Y` to express type-level branching.
2. **Distribution** automatically happens when a union is passed to a conditional type with a naked type parameter -- each member is processed individually and the results are unioned.
3. **Prevent distribution** by wrapping in tuples: `[T] extends [U]`.
4. **`never` acts as a filter** in unions -- use it to remove members from unions.
5. **`infer`** lets you pattern-match and extract parts of types (more in the advanced session).
6. **Nested conditionals** work like chained ternaries for multi-branch type logic.

---

## Quick Reference

```ts
// Basic conditional type
type Condition<T> = T extends SomeType ? TrueResult : FalseResult;

// Distributive (default when T is naked)
type Dist<T> = T extends U ? X : Y;  // distributes over union members

// Non-distributive (wrapped in tuple)
type NoDist<T> = [T] extends [U] ? X : Y;  // checks union as a whole

// Filtering with never
type Filter<T> = T extends Unwanted ? never : T;

// Infer (teaser)
type Extract<T> = T extends Pattern<infer R> ? R : Fallback;
```
