# Topic 01 - Setup and Basic Types

---

## What is TypeScript?

TypeScript is a **statically typed superset of JavaScript** developed and maintained by Microsoft. Every valid JavaScript file is already valid TypeScript. TypeScript adds an optional type system on top of JavaScript that is **completely erased at runtime** — the output is plain JavaScript.

```
TypeScript (.ts)  →  tsc (compiler)  →  JavaScript (.js)
```

- Created by **Anders Hejlsberg** (also the creator of C#) at Microsoft in 2012.
- It is **open source** and has one of the largest developer communities.
- TypeScript does **not** run in the browser or Node.js directly — it must be compiled to JavaScript first.

```typescript
// TypeScript code
function greet(name: string): string {
  return `Hello, ${name}`;
}

// Compiled JavaScript output (types are erased)
function greet(name) {
  return `Hello, ${name}`;
}
```

---

## Why Do We Need TypeScript?

JavaScript is dynamically typed. This means bugs often show up **at runtime** — in production, in front of users.

### The Problem with Plain JavaScript

```javascript
// JavaScript -- no errors until runtime
function calculateTotal(price, quantity) {
  return price * quantity;
}

calculateTotal("50", 2);   // Returns "502" (string concat!) -- silent bug
calculateTotal(50);         // Returns NaN -- no warning about missing arg
```

### The Same Code in TypeScript

```typescript
// TypeScript -- errors caught at compile time
function calculateTotal(price: number, quantity: number): number {
  return price * quantity;
}

calculateTotal("50", 2);   // Error: Argument of type 'string' is not assignable to 'number'
calculateTotal(50);         // Error: Expected 2 arguments, but got 1
```

### Core Reasons TypeScript Exists

| Problem in JavaScript | How TypeScript Solves It |
|---|---|
| No type checking — bugs found at runtime | Static type checking catches errors at compile time |
| No autocomplete for object shapes | Types enable IntelliSense/autocomplete in editors |
| Refactoring is risky — rename a property and things silently break | Compiler tracks every usage and reports errors instantly |
| Reading code requires guessing what a function expects/returns | Type annotations serve as living documentation |
| `undefined is not a function` errors in production | Strict null checks prevent null/undefined access |

---

## Benefits of TypeScript

### 1. Catch Bugs Before Runtime

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

function sendEmail(user: User) {
  // Typo caught immediately
  console.log(user.emal);  // Error: Property 'emal' does not exist. Did you mean 'email'?
}
```

### 2. Superior Editor Experience (IntelliSense)

TypeScript powers VS Code's autocomplete. When you type `user.`, you see all available properties with their types. This alone makes development significantly faster.

### 3. Safer Refactoring

Rename a property, change a function signature, or restructure an interface — the compiler instantly tells you every file that needs updating. No more "find and replace and pray."

### 4. Self-Documenting Code

```typescript
// Without TypeScript — what does this return? What does options accept?
function fetchUsers(options) { ... }

// With TypeScript — crystal clear
function fetchUsers(options: {
  page: number;
  limit: number;
  sortBy: keyof User;
}): Promise<User[]> { ... }
```

### 5. Scales to Large Codebases

- Small scripts with 1 developer — JavaScript works fine.
- Large applications with 10+ developers — TypeScript prevents entire categories of bugs and miscommunication.

### 6. Ecosystem Support

- Every major framework has first-class TypeScript support: **React, Angular, Vue, Express, NestJS, Next.js**.
- DefinitelyTyped (`@types/*`) provides type definitions for thousands of JavaScript libraries.

---

## Where to Use TypeScript

| Use Case | Why TypeScript Fits |
|---|---|
| **Backend APIs** (Node.js, Express, NestJS) | Type-safe request/response handling, validated payloads |
| **Frontend apps** (React, Angular, Vue, Next.js) | Component props validation, state management safety |
| **Full-stack applications** | Share types between frontend and backend |
| **Libraries and packages** (npm) | Consumers get autocomplete and type safety for free |
| **Large team projects** | Enforces contracts between modules and developers |
| **Enterprise applications** | Long-lived codebases benefit most from static typing |
| **CLI tools** | Type-safe argument parsing and configuration |
| **Serverless functions** (AWS Lambda, Azure Functions) | Catch errors before deploy since you can't debug live easily |

---

## When NOT to Use TypeScript

TypeScript is not always the right choice. Be pragmatic.

| Scenario | Why Plain JavaScript May Be Better |
|---|---|
| **Quick prototypes / throwaway scripts** | Type annotations slow down rapid experimentation |
| **Small single-file scripts** | The setup overhead isn't worth it for 20 lines of code |
| **Team has zero TypeScript experience** | Forcing it without training leads to `any` everywhere, which defeats the purpose |
| **Build system constraints** | Some environments (embedded scripts, legacy pipelines) cannot accommodate a compile step |
| **When the entire codebase is JavaScript** | Migrating is a commitment — don't do it halfway without a plan |

### Common Misconception

> "TypeScript catches all bugs."

**No.** TypeScript catches **type-related** bugs at compile time. It does not catch logic errors, race conditions, or runtime exceptions from external sources (network failures, bad API data). It is one layer of safety, not a replacement for testing.

---

## TypeScript vs JavaScript — At a Glance

| Feature | JavaScript | TypeScript |
|---|---|---|
| Typing | Dynamic (runtime) | Static (compile time) |
| Error detection | At runtime | At compile time + runtime |
| Compilation step | No | Yes (`.ts` → `.js`) |
| Learning curve | Lower | Slightly higher |
| Tooling / autocomplete | Basic | Excellent |
| Refactoring safety | Manual | Compiler-assisted |
| Runs in browser/Node directly | Yes | No (must compile first) |
| Community adoption | Universal | Rapidly growing, dominant in large projects |

---

## 1. TypeScript Setup with Node.js

### Step-by-step Project Initialization

```bash
# 1. Create a new project folder and navigate into it
mkdir my-ts-project
cd my-ts-project

# 2. Initialize a new Node.js project (creates package.json with defaults)
npm init -y

# 3. Install TypeScript and related dev dependencies
npm i typescript ts-node @types/node -D

# 4. Initialize a TypeScript configuration file (creates tsconfig.json)
npx tsc --init
```

**What each package does:**

| Package | Purpose |
|---|---|
| `typescript` | The TypeScript compiler (`tsc`) that converts `.ts` files to `.js` |
| `ts-node` | Runs TypeScript files directly without a separate compile step |
| `@types/node` | Type definitions for Node.js built-in modules (`fs`, `path`, `http`, etc.) |

---

## 2. tsconfig.json Essential Options

When you run `npx tsc --init`, a `tsconfig.json` file is generated. Here are the most important options:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "esModuleInterop": true
  }
}
```

### Explanation of Each Option

| Option | What It Does | Recommended Value |
|---|---|---|
| `target` | Which JavaScript version to compile down to. Controls which JS features are available in the output. | `ES2020` or `ES2022` for Node.js projects |
| `module` | The module system used in the output JavaScript. | `commonjs` for Node.js, `ESNext` for frontend/bundlers |
| `strict` | Enables ALL strict type-checking options at once (like `strictNullChecks`, `noImplicitAny`, etc.). | `true` (always) |
| `outDir` | The folder where compiled `.js` files are written. | `./dist` |
| `rootDir` | The root folder of your TypeScript source files. | `./src` |
| `esModuleInterop` | Allows default imports from CommonJS modules (e.g., `import express from 'express'` instead of `import * as express from 'express'`). | `true` |

---

## 3. Running TypeScript Files

There are three common ways to run TypeScript:

### Method 1: Compile then Run with `tsc`

```bash
# Compile all .ts files according to tsconfig.json
npx tsc

# Then run the compiled JavaScript
node dist/index.js
```

This is used in **production builds**. It produces `.js` files in your `outDir`.

### Method 2: Direct Execution with `ts-node`

```bash
# Run a .ts file directly (compiles in memory, no output files)
npx ts-node src/index.ts
```

This is used in **development**. No `.js` files are created on disk.

### Method 3: Using `tsx` (Faster Alternative)

```bash
# Install tsx globally or as a dev dependency
npm i tsx -D

# Run a .ts file directly (faster than ts-node, uses esbuild under the hood)
npx tsx src/index.ts
```

`tsx` is newer and faster than `ts-node`. It uses `esbuild` for near-instant startup.

---

## 4. Basic Types: string, number, boolean, null, undefined

TypeScript has the same primitive types as JavaScript, but you can explicitly annotate them.

```typescript
// --- string ---
let firstName: string = "Alice";
let greeting: string = `Hello, ${firstName}`;

// --- number ---
// Covers integers, floats, hex, octal, binary -- there is no separate int/float
let age: number = 30;
let price: number = 19.99;
let hex: number = 0xff;

// --- boolean ---
let isLoggedIn: boolean = true;
let hasPermission: boolean = false;

// --- null and undefined ---
// By default (with strict mode), null and undefined are their OWN types
// They are NOT assignable to other types unless you use union types
let nothing: null = null;
let notDefined: undefined = undefined;

// This will ERROR in strict mode:
// let name: string = null;  // Error: Type 'null' is not assignable to type 'string'

// To allow null, use a union type:
let nickname: string | null = null;
nickname = "Bob"; // This is fine
```

---

## 5. Arrays and Tuples

### Arrays

Two syntaxes for declaring typed arrays:

```typescript
// Syntax 1: type[] (preferred, more common)
let numbers: number[] = [1, 2, 3, 4, 5];
let names: string[] = ["Alice", "Bob", "Charlie"];

// Syntax 2: Array<type> (generic syntax)
let scores: Array<number> = [95, 87, 92];
let fruits: Array<string> = ["apple", "banana", "cherry"];

// Array of union types
let mixed: (string | number)[] = [1, "two", 3, "four"];

// Readonly array -- cannot push, pop, or modify
let readonlyNumbers: readonly number[] = [1, 2, 3];
// readonlyNumbers.push(4); // Error: Property 'push' does not exist on type 'readonly number[]'
```

### Tuples

A tuple is a fixed-length array where each element has a specific type. Order matters.

```typescript
// A tuple with exactly [string, number]
let person: [string, number] = ["Alice", 30];

// Accessing tuple elements -- TypeScript knows the type at each index
let personName: string = person[0]; // string
let personAge: number = person[1];  // number

// Tuple with more elements
let record: [number, string, boolean] = [1, "Alice", true];

// Optional tuple elements
let flexible: [string, number?] = ["Alice"];       // valid
let flexible2: [string, number?] = ["Alice", 30];  // also valid

// Named tuple elements (for documentation, does not affect runtime)
let user: [id: number, name: string] = [1, "Alice"];

// Destructuring a tuple
let [id, name] = user;
console.log(id);   // 1
console.log(name); // "Alice"
```

---

## 6. Enums

Enums let you define a set of named constants.

### Numeric Enums

```typescript
// By default, numeric enums start at 0 and auto-increment
enum Direction {
  Up,     // 0
  Down,   // 1
  Left,   // 2
  Right,  // 3
}

let move: Direction = Direction.Up;
console.log(move);            // 0
console.log(Direction[0]);    // "Up"  (reverse mapping)

// You can set custom starting values
enum StatusCode {
  OK = 200,
  NotFound = 404,
  InternalError = 500,
}

console.log(StatusCode.OK); // 200
```

### String Enums

```typescript
// String enums -- every member must be initialized with a string literal
enum Color {
  Red = "RED",
  Green = "GREEN",
  Blue = "BLUE",
}

let favorite: Color = Color.Red;
console.log(favorite); // "RED"

// Note: String enums do NOT have reverse mapping
// Color["RED"] would be undefined
```

### Const Enums

```typescript
// const enums are fully erased at compile time -- they become inline values
// This results in smaller, faster JavaScript output
const enum Size {
  Small = "S",
  Medium = "M",
  Large = "L",
}

let shirtSize = Size.Medium;
// Compiled JS: let shirtSize = "M";  (no enum object exists at runtime)
```

**When to use which:**
- **Numeric enums**: When you need reverse mapping or integer-based values.
- **String enums**: When you need readable, debuggable values (most common choice).
- **Const enums**: When you want maximum performance and don't need the enum object at runtime.

---

## 7. Type Annotations vs Type Inference

TypeScript can often figure out types on its own. You don't always need to write them explicitly.

### Type Annotations (Explicit)

You tell TypeScript exactly what the type is:

```typescript
let count: number = 10;
let message: string = "Hello";
let isReady: boolean = true;

function add(a: number, b: number): number {
  return a + b;
}
```

### Type Inference (Implicit)

TypeScript figures out the type from the assigned value:

```typescript
let count = 10;          // TypeScript infers: number
let message = "Hello";   // TypeScript infers: string
let isReady = true;      // TypeScript infers: boolean

// Hover over 'result' in VS Code -- TypeScript infers it as number
let result = add(5, 3);

// TypeScript infers the return type as number automatically
function multiply(a: number, b: number) {
  return a * b; // inferred return type: number
}
```

### When to Use Which?

| Scenario | Recommendation |
|---|---|
| Variable initialized with a value | Let TypeScript infer it (`let x = 10`) |
| Function parameters | **Always annotate** (`function greet(name: string)`) |
| Function return types | Annotate for public APIs; infer for simple/private functions |
| Variables without initial value | **Must annotate** (`let x: number;`) |
| Complex types or union types | Annotate for clarity |
| When inference gives a wrong/wider type | Annotate to narrow it |

```typescript
// GOOD: Let inference work
let age = 25;              // inferred as number, no need to annotate

// GOOD: Annotate parameters
function greet(name: string): string {
  return `Hello, ${name}`;
}

// NECESSARY: No initial value, must annotate
let score: number;
score = 100;

// NECESSARY: Inference would give 'string', but you want a union
let status: "active" | "inactive" = "active";
```

---

## 8. Special Types: any, unknown, never, void

### `any` -- Opt Out of Type Checking

```typescript
// 'any' disables ALL type checking. Avoid it whenever possible.
let data: any = "hello";
data = 42;          // no error
data = true;        // no error
data.toFixed();     // no error (even if data is not a number at runtime)
data.foo.bar.baz;   // no error (even though this will crash at runtime)

// WHY AVOID: You lose all the benefits of TypeScript
// WHEN TO USE: Migrating JS to TS incrementally, or genuinely dynamic data as last resort
```

### `unknown` -- Type-Safe Alternative to `any`

```typescript
// 'unknown' accepts any value, but you MUST narrow the type before using it
let input: unknown = "hello";

// input.toUpperCase(); // Error: 'input' is of type 'unknown'

// You must check the type first (type narrowing)
if (typeof input === "string") {
  console.log(input.toUpperCase()); // OK -- TypeScript knows it's a string here
}

if (typeof input === "number") {
  console.log(input.toFixed(2)); // OK -- TypeScript knows it's a number here
}

// USE unknown INSTEAD OF any when you don't know the type ahead of time
```

### `void` -- Function Returns Nothing

```typescript
// 'void' means the function does not return a meaningful value
function logMessage(message: string): void {
  console.log(message);
  // no return statement, or just 'return;' with no value
}

// void is NOT the same as undefined, but a void function can return undefined
let result: void = undefined; // This is valid but rarely useful
```

### `never` -- Function Never Returns

```typescript
// 'never' means the function NEVER completes normally
// Two common cases:

// Case 1: Function always throws an error
function throwError(message: string): never {
  throw new Error(message);
}

// Case 2: Function has an infinite loop
function infiniteLoop(): never {
  while (true) {
    // runs forever
  }
}

// 'never' is also the type of impossible values
type StringOrNumber = string | number;

function processValue(value: StringOrNumber) {
  if (typeof value === "string") {
    console.log(value.toUpperCase());
  } else if (typeof value === "number") {
    console.log(value.toFixed(2));
  } else {
    // value is 'never' here -- all possibilities are exhausted
    const exhaustiveCheck: never = value;
  }
}

```

### Summary Table

| Type | Accepts Any Value? | Must Narrow Before Use? | Use Case |
|---    |---|---|---|
| `any` | Yes| No (unsafe!) | Escape hatch, migration |
| `unknown` | Yes | Yes (safe!) | External data, APIs |
| `void` | N/A (return type) | N/A | Functions that don't return a value |
| `never` | No value possible | N/A | Functions that never return, exhaustive checks |

---

## 9. Union Types

A union type allows a variable to hold one of several types, separated by `|`.

```typescript
// A variable that can be a string OR a number
let id: string | number;
id = "abc-123";  // valid
id = 42;         // valid
// id = true;    // Error: Type 'boolean' is not assignable to type 'string | number'

// Union types in function parameters
function printId(id: string | number): void {
  // You can use methods common to both types
  console.log(`ID: ${id}`);

  // For type-specific methods, narrow with typeof
  if (typeof id === "string") {
    console.log(id.toUpperCase());  // string methods available here
  } else {
    console.log(id.toFixed(2));     // number methods available here
  }
}

printId("abc");  // ID: abc \n ABC
printId(100);    // ID: 100 \n 100.00

// Literal union types -- restrict to specific values
type Status = "active" | "inactive" | "suspended";

let userStatus: Status = "active";    // valid
// userStatus = "deleted";            // Error: not in the union

// Union with null (nullable types)
function findUser(id: number): string | null {
  if (id === 1) return "Alice";
  return null;
}

// Union of arrays
let data: string[] | number[] = [1, 2, 3];
data = ["a", "b", "c"];
```

---

## 10. Type Aliases vs Interfaces (Basic Intro)

### Type Aliases (`type` keyword)

A type alias gives a name to any type -- primitives, unions, tuples, objects, etc.

```typescript
// Alias for a union type
type ID = string | number;

// Alias for an object shape
type User = {
  id: number;
  name: string;
  email: string;
  age?: number;  // optional property (may or may not exist)
};

// Using the type alias
let userId: ID = "abc-123";

let alice: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  // age is optional, so we can skip it
};

// Alias for a tuple
type Coordinate = [number, number];
let point: Coordinate = [10, 20];


// Alias for a function signature
type MathOperation = (a: number, b: number) => number;
const add: MathOperation = (a, b) => a + b;
```


### Interfaces (`interface` keyword)

Interfaces are specifically for describing object shapes.

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  inStock?: boolean; // optional
}

let laptop: Product = {
  id: 1,
  name: "MacBook Pro",
  price: 2499,
};

// Interfaces can be extended
interface DigitalProduct extends Product {
  downloadUrl: string;
}

let ebook: DigitalProduct = {
  id: 2,
  name: "TypeScript Handbook",
  price: 29.99,
  downloadUrl: "https://example.com/download",
};
```

### Key Differences (for now)

| Feature | `type` | `interface` |
|---|---|---|
| Object shapes | Yes | Yes |
| Union types | Yes | No |
| Tuple types | Yes | No |
| Primitive aliases | Yes | No |
| Extending/Inheritance | `&` (intersection) | `extends` keyword |
| Declaration merging | No | Yes |
| General rule | Use for unions, primitives, tuples | Use for object shapes, classes |

We will explore interfaces in depth in a later topic.

---

## 11. Type Assertions

Type assertions tell TypeScript: "Trust me, I know what type this is." They do NOT change the runtime value -- they only affect the compiler.

### Syntax 1: `as` keyword (Preferred)

```typescript
let someValue: unknown = "Hello, TypeScript!";

// Assert that someValue is a string
let strLength: number = (someValue as string).length;
console.log(strLength); // 17

// Common use: DOM elements
// const input = document.getElementById("name") as HTMLInputElement;
// input.value = "Alice"; // TypeScript now knows it's an input element
```

### Syntax 2: Angle Bracket Syntax

```typescript
let someValue: unknown = "Hello, TypeScript!";

// Same assertion using angle brackets
let strLength: number = (<string>someValue).length;

// NOTE: Angle bracket syntax does NOT work in .tsx files (React JSX)
// Always prefer the 'as' syntax for consistency
```

### Important Rules

```typescript
// Type assertions are NOT type conversions -- they don't change the value
let num: unknown = 42;
let str = num as string;
// str is still 42 at runtime! TypeScript just stops warning you.
// This will cause bugs if you're wrong.

// TypeScript prevents clearly impossible assertions
// let x: string = 42 as string;
// Error: Conversion of type 'number' to type 'string' may be a mistake

// Double assertion (escape hatch -- avoid if possible)
let x = 42 as unknown as string; // Forces it through, but very unsafe

// BEST PRACTICE: Prefer type narrowing (typeof, instanceof) over assertions
// Assertions are for when YOU know more than the compiler
```

### When to Use Type Assertions

1. Working with DOM APIs (`document.getElementById` returns `HTMLElement | null`)
2. Working with external data you've validated yourself
3. When TypeScript's inference is too broad and you know the specific type
4. **Never** use assertions to silence errors you don't understand -- fix the root cause instead

---

## Quick Reference Cheat Sheet

```typescript
// --- Primitives ---
let str: string = "hello";
let num: number = 42;
let bool: boolean = true;
let n: null = null;
let u: undefined = undefined;

// --- Arrays ---
let nums: number[] = [1, 2, 3];
let strs: Array<string> = ["a", "b"];

// --- Tuple ---
let tuple: [string, number] = ["age", 30];

// --- Enum ---
enum Color { Red, Green, Blue }

// --- Union ---
let id: string | number = "abc";

// --- Type Alias ---
type Point = { x: number; y: number };

// --- Interface ---
interface Shape { area(): number; }

// --- any / unknown / void / never ---
let a: any = "anything";          // no safety
let u2: unknown = "must narrow";  // safe
function log(): void {}           // no return
function fail(): never { throw new Error(); } // never returns

// --- Type Assertion ---
let val = someUnknown as string;
```
