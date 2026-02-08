# Topic 02 - Functions and Objects in TypeScript

## 1. Function Type Annotations

TypeScript allows you to annotate both the **parameter types** and the **return type** of a function.

```typescript
// Parameter types are annotated after each parameter name
// Return type is annotated after the parameter list with a colon
function add(a: number, b: number): number {
  return a + b;
}

// TypeScript can infer the return type, but explicit is often preferred
function getFullName(first: string, last: string): string {
  return `${first} ${last}`;
}

// void return type means the function does not return a value
function logMessage(message: string): void {
  console.log(message);
}

// never return type means the function never completes normally
// (it throws an error or runs forever)
function throwError(message: string): never {
  throw new Error(message);
}
```

**Key Takeaway:** Always annotate parameter types. Return types can be inferred, but adding them explicitly improves readability and catches mistakes early.

---

## 2. Arrow Functions with Types

Arrow functions follow the same annotation rules. The return type goes after the parameter list, before the arrow (`=>`).

```typescript
// Arrow function with explicit types
const multiply = (a: number, b: number): number => a * b;

// Arrow function with void return
const greetUser = (name: string): void => {
  console.log(`Hello, ${name}!`);
};

// Single parameter (parentheses still needed with type annotation)
const double = (n: number): number => n * 2;

// Typing a variable as a function type, then assigning
const divide: (x: number, y: number) => number = (x, y) => x / y;
```

---

## 3. Optional Parameters (?) and Default Parameters

### Optional Parameters

Use `?` after the parameter name to make it optional. Optional parameters must come **after** required parameters.

```typescript
function greet(name: string, greeting?: string): string {
  // greeting is string | undefined
  if (greeting) {
    return `${greeting}, ${name}!`;
  }
  return `Hello, ${name}!`;
}

greet("Alice");           // "Hello, Alice!"
greet("Alice", "Hey");    // "Hey, Alice!"
```

### Default Parameters

Default parameters provide a fallback value. They do NOT need `?` because TypeScript understands they are optional by nature.

```typescript
function greetWithDefault(name: string, greeting: string = "Hello"): string {
  return `${greeting}, ${name}!`;
}

greetWithDefault("Bob");          // "Hello, Bob!"
greetWithDefault("Bob", "Hi");    // "Hi, Bob!"
```

**Key Difference:** With `?`, the type is `string | undefined` inside the function. With a default value, the type is just `string` (the default covers the undefined case).

---

## 4. Rest Parameters with Types

Rest parameters collect multiple arguments into an array. Annotate them with an array type.

```typescript
// Rest parameter collects all arguments into a number array
function sum(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0);
}

sum(1, 2, 3);       // 6
sum(10, 20, 30, 40); // 100

// Rest parameter after regular parameters
function buildSentence(prefix: string, ...words: string[]): string {
  return `${prefix}: ${words.join(" ")}`;
}

buildSentence("Quote", "To", "be", "or", "not", "to", "be");
// "Quote: To be or not to be"

// Using a tuple type with rest for fixed + variable args
function logWithLevel(level: "info" | "warn" | "error", ...messages: string[]): void {
  console.log(`[${level.toUpperCase()}]`, ...messages);
}
```

---

## 5. Function Overloads

Function overloads let you define **multiple call signatures** for a single function. This is powerful when a function behaves differently based on its input types.

**Pattern:** Write overload signatures first (no body), then write one implementation signature with a body that handles all cases.

```typescript
// Overload signatures (no body)
function format(value: string): string;
function format(value: number): string;

// Implementation signature (must be compatible with ALL overloads)
function format(value: string | number): string {
  if (typeof value === "string") {
    return value.trim().toUpperCase();
  }
  return value.toFixed(2);
}

format("hello");  // "HELLO"  - TypeScript knows this returns string
format(3.14159);  // "3.14"   - TypeScript knows this returns string
```

### A More Complex Overload Example

```typescript
// Different return types based on input
function parseInput(input: string): string[];
function parseInput(input: number): number[];
function parseInput(input: string | number): string[] | number[] {
  if (typeof input === "string") {
    return input.split(",");
  }
  return [input, input * 2, input * 3];
}

const strings = parseInput("a,b,c");  // type is string[]
const numbers = parseInput(5);         // type is number[]
```

**Why Overloads Matter:** They are heavily used in libraries and advanced patterns. The caller sees the clean overload signatures, not the messy implementation signature.

---

## 6. Callback Types and Function Type Aliases

### Callback Parameters

Functions that accept other functions as arguments should type those callbacks explicitly.

```typescript
// Typing a callback parameter inline
function processNumbers(numbers: number[], callback: (n: number) => number): number[] {
  return numbers.map(callback);
}

processNumbers([1, 2, 3], (n) => n * 2); // [2, 4, 6]
```

### Function Type Aliases

Use `type` to create reusable function type aliases. This keeps code DRY and readable.

```typescript
// Define a function type alias
type MathOperation = (a: number, b: number) => number;

// Use the alias for variables
const add: MathOperation = (a, b) => a + b;
const subtract: MathOperation = (a, b) => a - b;
const multiply: MathOperation = (a, b) => a * b;

// Use the alias for parameters
function applyOperation(x: number, y: number, operation: MathOperation): number {
  return operation(x, y);
}

applyOperation(10, 5, add);       // 15
applyOperation(10, 5, subtract);  // 5

// More complex callback type
type AsyncCallback<T> = (error: Error | null, result: T | null) => void;

function fetchData(url: string, callback: AsyncCallback<string>): void {
  // simulate async work
  callback(null, "data from " + url);
}
```

---

## 7. Object Types (Inline and Named)

### Inline Object Types

You can define object shapes directly in annotations.

```typescript
// Inline object type annotation
function printUser(user: { name: string; age: number }): void {
  console.log(`${user.name} is ${user.age} years old`);
}

printUser({ name: "Alice", age: 30 });

// Variable with inline object type
let config: { host: string; port: number; ssl: boolean } = {
  host: "localhost",
  port: 3000,
  ssl: false,
};
```

### Named Object Types (type alias and interface)

For reuse, name your object types with `type` or `interface`.

```typescript
// Using type alias
type Point = {
  x: number;
  y: number;
};

// Using interface
interface User {
  id: number;
  name: string;
  email: string;
}

function createUser(name: string, email: string): User {
  return { id: Date.now(), name, email };
}

// Extending interfaces
interface Employee extends User {
  department: string;
  salary: number;
}

// Intersection types with type aliases
type Timestamped = {
  createdAt: Date;
  updatedAt: Date;
};

type TimestampedUser = User & Timestamped;
```

---

## 8. Index Signatures

Index signatures let you describe objects whose property names are not known ahead of time but whose value types are consistent.

```typescript
// String index signature - any string key maps to a number value
interface ScoreBoard {
  [playerName: string]: number;
}

const scores: ScoreBoard = {
  Alice: 95,
  Bob: 87,
  Charlie: 92,
};

scores["Diana"] = 88; // OK
// scores["Eve"] = "high"; // Error: Type 'string' is not assignable to type 'number'

// Combining known properties with index signatures
interface Config {
  name: string; // known property
  version: number; // known property
  [key: string]: string | number; // all other keys must be string | number
}

// Number index signature (for array-like objects)
interface StringArray {
  [index: number]: string;
}

const myArray: StringArray = ["hello", "world"];

// Nested index signature - a dictionary of arrays
interface GroupedData {
  [category: string]: string[];
}

const groups: GroupedData = {
  fruits: ["apple", "banana"],
  colors: ["red", "blue"],
};
```

**Note:** When you have both a string and number index signature, the number index value type must be a subtype of the string index value type (because JavaScript converts number keys to strings).

---

## 9. The `readonly` Modifier on Properties

The `readonly` modifier prevents reassignment of a property after the object is created.

```typescript
interface ImmutableUser {
  readonly id: number;
  readonly name: string;
  email: string; // this one is still mutable
}

const user: ImmutableUser = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
};

// user.id = 2;    // Error: Cannot assign to 'id' because it is a read-only property
// user.name = "Bob"; // Error
user.email = "newalice@example.com"; // OK - email is not readonly

// readonly with type aliases
type ReadonlyPoint = {
  readonly x: number;
  readonly y: number;
};

// TypeScript also provides a built-in Readonly<T> utility type
interface MutableConfig {
  host: string;
  port: number;
}

const frozenConfig: Readonly<MutableConfig> = {
  host: "localhost",
  port: 3000,
};

// frozenConfig.host = "remote"; // Error: all properties are now readonly

// readonly arrays
const numbers: readonly number[] = [1, 2, 3];
// numbers.push(4); // Error: Property 'push' does not exist on type 'readonly number[]'
// numbers[0] = 10; // Error: Index signature in type 'readonly number[]' only permits reading
```

**Important:** `readonly` is a compile-time check only. At runtime, the property can still be mutated if you bypass TypeScript (e.g., via `any`). It is a contract for developers, not a runtime enforcement.

---

## 10. `as const` Assertions and Their Effect on Types

`as const` tells TypeScript to infer the **narrowest possible type** (literal types) and makes everything `readonly`.

```typescript
// Without as const
const colorsNormal = ["red", "green", "blue"];
// Type: string[]

// With as const
const colorsConst = ["red", "green", "blue"] as const;
// Type: readonly ["red", "green", "blue"]
// Each element is a literal type, not just 'string'

// Without as const
const config = {
  env: "production",
  port: 3000,
};
// Type: { env: string; port: number }

// With as const
const configConst = {
  env: "production",
  port: 3000,
} as const;
// Type: { readonly env: "production"; readonly port: 3000 }
// Values are literal types: "production" not string, 3000 not number

// Practical use: creating enum-like objects
const Direction = {
  Up: "UP",
  Down: "DOWN",
  Left: "LEFT",
  Right: "RIGHT",
} as const;

// Derive a union type from the values
type DirectionValue = (typeof Direction)[keyof typeof Direction];
// type DirectionValue = "UP" | "DOWN" | "LEFT" | "RIGHT"

function move(direction: DirectionValue): void {
  console.log(`Moving ${direction}`);
}

move(Direction.Up);  // OK
// move("DIAGONAL"); // Error: not assignable to type DirectionValue

// as const with function return for literal types
function getEndpoint() {
  return { url: "/api/users", method: "GET" } as const;
}
// Return type: { readonly url: "/api/users"; readonly method: "GET" }
```

**Why `as const` Matters:** It prevents widening of literal types and guarantees immutability, which is extremely useful for configuration objects, lookup tables, and deriving union types.

---

## 11. Destructuring with Types

When destructuring function parameters or variables, you annotate the **entire pattern**, not individual parts.

### Object Destructuring

```typescript
// Destructuring in function parameters
function printUser({ name, age }: { name: string; age: number }): void {
  console.log(`${name} is ${age}`);
}

printUser({ name: "Alice", age: 30 });

// With a named type (cleaner)
interface UserInfo {
  name: string;
  age: number;
  email?: string;
}

function printUserInfo({ name, age, email = "N/A" }: UserInfo): void {
  console.log(`${name}, ${age}, ${email}`);
}

// Destructuring with renaming
function processPoint({ x: horizontal, y: vertical }: { x: number; y: number }): void {
  console.log(`H: ${horizontal}, V: ${vertical}`);
}
```

### Array Destructuring

```typescript
// Array destructuring with types
const scores: [number, number, number] = [90, 85, 92];
const [first, second, third]: [number, number, number] = scores;

// Destructuring function return (tuple)
function getMinMax(numbers: number[]): [number, number] {
  return [Math.min(...numbers), Math.max(...numbers)];
}

const [min, max] = getMinMax([3, 1, 4, 1, 5]);
// min: number, max: number (inferred from the tuple return type)
```

### Nested Destructuring

```typescript
interface Company {
  name: string;
  address: {
    city: string;
    country: string;
  };
}

function printCompanyCity({ name, address: { city } }: Company): void {
  console.log(`${name} is in ${city}`);
}

printCompanyCity({
  name: "Acme Corp",
  address: { city: "New York", country: "US" },
});
```

---

## Quick Reference Table

| Concept | Syntax | Example |
|---|---|---|
| Parameter type | `param: Type` | `function add(a: number)` |
| Return type | `): ReturnType` | `function add(a: number): number` |
| Optional param | `param?: Type` | `function greet(name?: string)` |
| Default param | `param: Type = value` | `function greet(name: string = "World")` |
| Rest params | `...param: Type[]` | `function sum(...nums: number[])` |
| Function type alias | `type Name = (params) => Return` | `type Op = (a: number) => number` |
| Readonly property | `readonly prop: Type` | `readonly id: number` |
| Index signature | `[key: KeyType]: ValueType` | `[key: string]: number` |
| as const | `value as const` | `["a", "b"] as const` |
| Destructured param | `{ prop }: { prop: Type }` | `{ name }: { name: string }` |
