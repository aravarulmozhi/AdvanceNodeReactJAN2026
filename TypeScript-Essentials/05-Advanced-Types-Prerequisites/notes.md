# Topic 05 - Advanced Types Prerequisites

## Why This Topic Matters

This topic is the **BRIDGE** between basic TypeScript and the advanced type system. Everything you learn here -- literal types, `keyof`, indexed access types, `as const`, and template literal types -- are the **building blocks** for mapped types, conditional types, utility types, and every advanced pattern that follows.

If generics are the engine, then these concepts are the fuel. Without them, mapped types like `Partial<T>` or conditional types like `Extract<T, U>` would be impossible to understand or construct.

---

## 1. Literal Types

In TypeScript, a **literal type** is a type that represents exactly one value -- not a broad category, but a specific, concrete value.

### String Literal Types

```ts
// Instead of "any string", we narrow to exact strings
type Direction = "north" | "south" | "east" | "west";

let move: Direction = "north"; // OK
// let move2: Direction = "up"; // Error: Type '"up"' is not assignable to type 'Direction'

// String literal types are subtypes of string
let greeting: "hello" = "hello";
let anyString: string = greeting; // OK -- "hello" is assignable to string
// let back: "hello" = anyString; // Error -- string is NOT assignable to "hello"
```

### Number Literal Types

```ts
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;

let roll: DiceRoll = 3; // OK
// let roll2: DiceRoll = 7; // Error: Type '7' is not assignable to type 'DiceRoll'

type HttpSuccessCode = 200 | 201 | 204;
type HttpErrorCode = 400 | 401 | 403 | 404 | 500;
type HttpStatusCode = HttpSuccessCode | HttpErrorCode;
```

### Boolean Literal Types

```ts
type True = true;
type False = false;

// Boolean is actually just: type boolean = true | false
let flag: true = true; // OK
// let flag2: true = false; // Error
```

---

## 2. Literal Type Widening and Narrowing

TypeScript decides whether a value gets a **wide** type (e.g., `string`) or a **narrow/literal** type (e.g., `"hello"`) based on context.

### Widening: `let` gives wide types

```ts
let x = "hello";     // Type is: string (widened)
let y = 42;           // Type is: number (widened)
let z = true;         // Type is: boolean (widened)
```

### Narrowing: `const` gives literal types

```ts
const a = "hello";    // Type is: "hello" (literal, because const can never change)
const b = 42;         // Type is: 42
const c = true;       // Type is: true
```

### Why does this matter?

When you pass values to functions that expect literal types, widening can cause errors:

```ts
type Method = "GET" | "POST" | "PUT" | "DELETE";

function makeRequest(url: string, method: Method) {
  // ...
}

// Problem: let widens the type
let method = "GET"; // type is string, NOT "GET"
// makeRequest("/api", method); // Error: string is not assignable to Method

// Solution 1: use const
const method2 = "GET"; // type is "GET"
makeRequest("/api", method2); // OK

// Solution 2: use type annotation
let method3: Method = "GET";
makeRequest("/api", method3); // OK

// Solution 3: use as const (inline assertion)
let method4 = "GET" as const; // type is "GET"
makeRequest("/api", method4); // OK
```

---

## 3. The `typeof` Operator in Type Context

JavaScript has a `typeof` operator that returns a string at runtime (`"string"`, `"number"`, etc.). TypeScript adds a **type-level** `typeof` that extracts the TypeScript type of a variable.

```ts
const user = {
  name: "Alice",
  age: 30,
  isAdmin: false,
};

// typeof in TYPE context -- extracts the full type of the variable
type User = typeof user;
// Result:
// type User = {
//   name: string;
//   age: number;
//   isAdmin: boolean;
// }

// This is incredibly useful when you have a value but no explicit type
const colors = ["red", "green", "blue"] as const;
type Colors = typeof colors; // readonly ["red", "green", "blue"]
```

### Runtime typeof vs Type-level typeof

```ts
// Runtime typeof (in expressions) -- returns a string
console.log(typeof "hello");  // "string"
console.log(typeof 42);       // "number"

// Type-level typeof (in type annotations) -- returns a TypeScript type
let message = "hello";
type MessageType = typeof message; // string

// TypeScript knows which one you mean by context:
// - After a colon (:), in a type position => type-level typeof
// - Everywhere else => runtime typeof
```

---

## 4. The `keyof` Operator

`keyof` takes an **object type** and produces a **union of its keys** as string literal types.

```ts
interface Product {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
}

type ProductKeys = keyof Product;
// Result: "id" | "name" | "price" | "inStock"

// You can use this to constrain function parameters
function getProperty(product: Product, key: keyof Product) {
  return product[key];
}

const laptop: Product = { id: 1, name: "Laptop", price: 999, inStock: true };

getProperty(laptop, "name");   // OK
getProperty(laptop, "price");  // OK
// getProperty(laptop, "color"); // Error: '"color"' is not assignable to keyof Product
```

### keyof with Index Signatures

```ts
interface StringMap {
  [key: string]: unknown;
}
type StringMapKeys = keyof StringMap; // string | number
// (number because obj[0] is the same as obj["0"] in JavaScript)

interface NumberMap {
  [key: number]: unknown;
}
type NumberMapKeys = keyof NumberMap; // number
```

---

## 5. Combining `keyof` with `typeof`

This is one of the most common patterns in real-world TypeScript. When you have a **plain object** (not a type/interface), you combine `typeof` to get the type, then `keyof` to get its keys.

```ts
const statusCodes = {
  ok: 200,
  created: 201,
  badRequest: 400,
  notFound: 404,
  serverError: 500,
};

// Step 1: typeof extracts the object's type
type StatusCodesType = typeof statusCodes;
// {
//   ok: number;
//   created: number;
//   badRequest: number;
//   notFound: number;
//   serverError: number;
// }

// Step 2: keyof gets the keys
type StatusCodeName = keyof typeof statusCodes;
// "ok" | "created" | "badRequest" | "notFound" | "serverError"

// Common one-liner pattern:
function getStatusCode(name: keyof typeof statusCodes): number {
  return statusCodes[name];
}

getStatusCode("ok");       // OK, returns 200
getStatusCode("notFound"); // OK, returns 404
// getStatusCode("teapot"); // Error
```

---

## 6. Indexed Access Types

You can look up a specific property's type using **bracket notation** on a type -- just like accessing a property on an object, but at the type level.

### Basic Indexed Access: `Type['property']`

```ts
interface User {
  id: number;
  name: string;
  email: string;
  address: {
    street: string;
    city: string;
    zip: string;
  };
}

type UserId = User["id"];          // number
type UserName = User["name"];      // string
type UserAddress = User["address"]; // { street: string; city: string; zip: string }

// You can use a union to get multiple properties at once
type IdOrName = User["id" | "name"]; // number | string

// You can use keyof to get the union of ALL property types
type UserValues = User[keyof User]; // number | string | { street: string; city: string; zip: string }
```

### Nested Indexed Access: `Type['a']['b']`

```ts
// You can chain indexed access to reach nested properties
type Street = User["address"]["street"]; // string
type City = User["address"]["city"];     // string
```

### Indexed Access with `number` -- Array Element Types

```ts
const roles = ["admin", "editor", "viewer"];
type RolesArray = typeof roles;        // string[]
type Role = (typeof roles)[number];    // string

// With as const, you get literal types
const permissions = ["read", "write", "delete"] as const;
type Permission = (typeof permissions)[number]; // "read" | "write" | "delete"
```

### Indexed Access with Tuples

```ts
type Tuple = [string, number, boolean];

type First = Tuple[0];   // string
type Second = Tuple[1];  // number
type Third = Tuple[2];   // boolean
```

---

## 7. `as const` Assertions (Deep Readonly + Literal Types)

`as const` is a type assertion that tells TypeScript: "treat this entire value as deeply readonly with the most specific literal types possible."

### Without `as const`

```ts
const config = {
  api: "https://api.example.com",
  port: 3000,
  features: ["auth", "logging"],
};
// Type:
// {
//   api: string;       <-- widened to string
//   port: number;      <-- widened to number
//   features: string[] <-- widened to string[]
// }
```

### With `as const`

```ts
const config = {
  api: "https://api.example.com",
  port: 3000,
  features: ["auth", "logging"],
} as const;
// Type:
// {
//   readonly api: "https://api.example.com";        <-- literal + readonly
//   readonly port: 3000;                             <-- literal + readonly
//   readonly features: readonly ["auth", "logging"]; <-- literal tuple + readonly
// }

// Now you can extract precise literal types
type ApiUrl = typeof config.api;    // "https://api.example.com"
type Port = typeof config.port;     // 3000
type Features = (typeof config.features)[number]; // "auth" | "logging"
```

### `as const` with Arrays (Creates Tuples)

```ts
// Without as const
const colors = ["red", "green", "blue"]; // string[]

// With as const
const colorsConst = ["red", "green", "blue"] as const;
// readonly ["red", "green", "blue"]  -- a tuple of literal types

type Color = (typeof colorsConst)[number]; // "red" | "green" | "blue"
```

### Why `as const` Matters

`as const` is the key to deriving types from runtime values. Instead of defining types separately and keeping them in sync with values, you define the value once and derive the type:

```ts
// OLD approach: define type and value separately (must keep in sync)
type Status = "active" | "inactive" | "suspended";
const STATUSES: Status[] = ["active", "inactive", "suspended"];

// MODERN approach: single source of truth
const STATUSES = ["active", "inactive", "suspended"] as const;
type Status = (typeof STATUSES)[number]; // "active" | "inactive" | "suspended"
```

---

## 8. Template Literal Types (Basic Introduction)

TypeScript lets you use template literal syntax at the **type level** to construct new string literal types.

### Basic Template Literal Types

```ts
type Greeting = `hello ${string}`;
// Matches any string that starts with "hello "

let g1: Greeting = "hello world";   // OK
let g2: Greeting = "hello Alice";   // OK
// let g3: Greeting = "hi world";   // Error

type EventName = `on${string}`;
// Matches: "onClick", "onHover", "onSubmit", etc.
```

### Combining String Literal Unions

```ts
type Color = "red" | "blue";
type Size = "small" | "large";

type ColorSize = `${Color}-${Size}`;
// "red-small" | "red-large" | "blue-small" | "blue-large"
// TypeScript automatically creates the cartesian product!
```

### Practical Example: CSS-like Properties

```ts
type CSSProperty = "margin" | "padding";
type Direction = "top" | "right" | "bottom" | "left";

type CSSDirectionalProperty = `${CSSProperty}-${Direction}`;
// "margin-top" | "margin-right" | "margin-bottom" | "margin-left"
// | "padding-top" | "padding-right" | "padding-bottom" | "padding-left"
```

Template literal types become extremely powerful when combined with conditional types and mapped types (covered in later topics).

---

## 9. Tuple Types and Labeled Tuples

### Basic Tuple Types

A tuple is a fixed-length array where each position has a specific type:

```ts
// A tuple with exactly 3 elements
type Point3D = [number, number, number];

const origin: Point3D = [0, 0, 0];     // OK
// const bad: Point3D = [0, 0];         // Error: missing element
// const bad2: Point3D = [0, 0, 0, 0];  // Error: extra element
```

### Labeled Tuples (TypeScript 4.0+)

Labels improve readability but do not affect behavior:

```ts
type UserRecord = [id: number, name: string, isActive: boolean];

const user: UserRecord = [1, "Alice", true];
// When you hover over user[0], the editor shows "id: number" instead of just "number"
```

### Optional Tuple Elements

```ts
type FlexPoint = [x: number, y: number, z?: number];

const point2D: FlexPoint = [10, 20];      // OK
const point3D: FlexPoint = [10, 20, 30];  // OK
```

### Rest Elements in Tuples

```ts
// A tuple that starts with a string, then has any number of numbers
type StringThenNumbers = [string, ...number[]];

const a: StringThenNumbers = ["hello"];            // OK
const b: StringThenNumbers = ["hello", 1, 2, 3];  // OK

// Leading rest element
type NumbersThenString = [...number[], string];
const c: NumbersThenString = ["end"];              // OK
const d: NumbersThenString = [1, 2, 3, "end"];    // OK

// Middle rest element
type Sandwich = [string, ...number[], boolean];
const e: Sandwich = ["start", 1, 2, 3, true];    // OK
```

### Tuples vs Arrays

```ts
// Array: any length, all same type
type NumberArray = number[];

// Tuple: fixed length (unless rest), each position typed
type Pair = [number, string];
```

---

## 10. How These Concepts Connect to Advanced Topics

Here is how every concept in this topic feeds directly into what comes next:

| Prerequisite | Enables |
|---|---|
| **Literal types** | Discriminated unions, conditional type matching |
| **`keyof`** | Mapped types iterate over `keyof T` |
| **Indexed access `T[K]`** | Mapped types transform `T[K]` for each key |
| **`typeof`** | Deriving types from runtime values for mapped/conditional types |
| **`as const`** | Creating literal types from values for precise type inference |
| **Template literal types** | Advanced string manipulation at the type level |
| **Tuples** | Variadic tuple types, function parameter manipulation |

### Preview: How These Build Mapped Types

```ts
// A mapped type iterates keyof T and transforms T[K]:
type MyPartial<T> = {
  [K in keyof T]?: T[K];
  //  ^^ keyof    ^^ indexed access
};

// Without understanding keyof and T[K], this syntax is incomprehensible.
// With this topic under your belt, it reads naturally:
// "For each key K in the keys of T, make T[K] optional"
```

### Preview: How These Build Conditional Types

```ts
// Conditional types use literal types for matching:
type IsString<T> = T extends string ? true : false;
//                          ^^^^^^ literal types: true and false

type A = IsString<"hello">; // true -- "hello" extends string
type B = IsString<42>;      // false
```

---

## Key Takeaways

1. **Literal types** narrow `string`, `number`, and `boolean` to exact values.
2. **`const` declarations** and **`as const` assertions** preserve literal types instead of widening.
3. **`typeof`** in a type position extracts the TypeScript type of a variable.
4. **`keyof`** produces a union of an object type's keys as string literals.
5. **`keyof typeof obj`** is the standard pattern for getting keys from a plain object.
6. **Indexed access types** (`T["prop"]`, `T[number]`) look up property types from object/array types.
7. **`as const`** makes everything deeply readonly with the narrowest possible literal types.
8. **Template literal types** construct new string types using template syntax.
9. **Tuple types** are fixed-length arrays with per-position types.
10. **All of these are prerequisites** -- they are the atoms from which advanced types are built.
