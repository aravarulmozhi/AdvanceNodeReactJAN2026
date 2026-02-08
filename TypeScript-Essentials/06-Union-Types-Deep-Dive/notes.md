# Topic 06 - Union Types Deep Dive

## Union Types Recap

A union type describes a value that can be one of several types. We use the vertical bar (`|`) to separate each type.

```ts
let value: string | number;
value = "hello"; // OK
value = 42;      // OK
value = true;    // Error: Type 'boolean' is not assignable to type 'string | number'
```

The challenge with union types is that TypeScript only allows operations that are valid for **every** member of the union. To work with a specific member, we must **narrow** the type.

```ts
function printLength(x: string | number) {
  // console.log(x.length); // Error: Property 'length' does not exist on type 'number'

  // We need to narrow the type first
  if (typeof x === "string") {
    console.log(x.length); // OK - x is narrowed to string
  }
}
```

---

## Type Narrowing Mechanisms

Type narrowing is the process of refining a broad type to a more specific type within a conditional block. TypeScript's control flow analysis understands several narrowing patterns.

### 1. typeof Narrowing

The `typeof` operator returns a string indicating the type of a value. TypeScript understands `typeof` checks and narrows accordingly.

Valid `typeof` return values: `"string"`, `"number"`, `"bigint"`, `"boolean"`, `"symbol"`, `"undefined"`, `"object"`, `"function"`

```ts
function processValue(value: string | number | boolean) {
  if (typeof value === "string") {
    // value is narrowed to string
    console.log(value.toUpperCase());
  } else if (typeof value === "number") {
    // value is narrowed to number
    console.log(value.toFixed(2));
  } else {
    // value is narrowed to boolean
    console.log(value ? "true" : "false");
  }
}
```

**Important caveat:** `typeof null` returns `"object"`, so `typeof` alone cannot distinguish null from objects.

```ts
function example(val: string | null) {
  if (typeof val === "object") {
    // val is still string | null here because null is also "object"
    // val.toUpperCase(); // Error!
  }
}
```

### 2. instanceof Narrowing

The `instanceof` operator checks whether a value is an instance of a constructor/class. TypeScript narrows based on `instanceof` checks.

```ts
function formatDate(input: Date | string): string {
  if (input instanceof Date) {
    // input is narrowed to Date
    return input.toISOString();
  } else {
    // input is narrowed to string
    return new Date(input).toISOString();
  }
}

console.log(formatDate(new Date()));       // "2026-02-08T..."
console.log(formatDate("2026-01-01"));     // "2026-01-01T00:00:00.000Z"
```

```ts
class Dog {
  bark() { console.log("Woof!"); }
}

class Cat {
  meow() { console.log("Meow!"); }
}

function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark();   // OK - narrowed to Dog
  } else {
    animal.meow();   // OK - narrowed to Cat
  }
}
```

### 3. in Operator Narrowing

The `in` operator checks whether an object has a property with a given name. TypeScript narrows based on this check.

```ts
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
  if ("swim" in animal) {
    // animal is narrowed to Fish
    animal.swim();
  } else {
    // animal is narrowed to Bird
    animal.fly();
  }
}
```

This is especially useful when you cannot use `instanceof` (e.g., plain objects or interfaces).

```ts
type Admin = { name: string; privileges: string[] };
type Employee = { name: string; startDate: Date };

function printInfo(person: Admin | Employee) {
  console.log(`Name: ${person.name}`); // OK - both types have 'name'

  if ("privileges" in person) {
    // person is narrowed to Admin
    console.log(`Privileges: ${person.privileges.join(", ")}`);
  }

  if ("startDate" in person) {
    // person is narrowed to Employee
    console.log(`Start Date: ${person.startDate.toDateString()}`);
  }
}
```

### 4. Truthiness Narrowing

TypeScript understands truthy/falsy checks and narrows accordingly. Falsy values include: `false`, `0`, `""`, `null`, `undefined`, `NaN`.

```ts
function printName(name: string | null | undefined) {
  if (name) {
    // name is narrowed to string (null and undefined are falsy)
    console.log(name.toUpperCase());
  } else {
    console.log("No name provided");
  }
}
```

**Caveat:** Truthiness narrowing can accidentally filter out legitimate falsy values like `0` or `""`.

```ts
function processCount(count: number | undefined) {
  if (count) {
    // count is narrowed to number BUT 0 would be excluded!
    console.log(count);
  }

  // Better approach for numbers:
  if (count !== undefined) {
    // count is narrowed to number, and 0 is included
    console.log(count);
  }
}
```

### 5. Equality Narrowing

TypeScript narrows types when you compare values using `===`, `!==`, `==`, or `!=`.

```ts
function compare(x: string | number, y: string | boolean) {
  if (x === y) {
    // The only type in common is string, so both are narrowed to string
    console.log(x.toUpperCase());
    console.log(y.toUpperCase());
  }
}
```

Checking against specific values:

```ts
function handleStatus(status: "success" | "error" | "loading") {
  if (status === "success") {
    // status is narrowed to "success"
    console.log("Operation succeeded");
  } else if (status === "error") {
    // status is narrowed to "error"
    console.log("Operation failed");
  } else {
    // status is narrowed to "loading"
    console.log("Still loading...");
  }
}
```

Null/undefined checks with `!=`:

```ts
function getValue(x: string | null | undefined) {
  if (x != null) {
    // x is narrowed to string (both null and undefined are removed)
    console.log(x.toUpperCase());
  }
}
```

### 6. Assignment Narrowing

When you assign a value to a variable, TypeScript narrows the type based on the right side of the assignment.

```ts
let value: string | number;

value = "hello";
// value is narrowed to string here
console.log(value.toUpperCase()); // OK

value = 42;
// value is narrowed to number here
console.log(value.toFixed(2)); // OK
```

TypeScript remembers the declared type and allows reassignment to any valid union member:

```ts
let x: string | number;
x = "text";    // x is string
x = 100;       // x is number (still valid because declared type is string | number)
```

---

## User-Defined Type Guards

Sometimes TypeScript's built-in narrowing is not enough. You can define your own type guard functions using the `x is Type` return type syntax.

A type guard is a function whose return type is a **type predicate** of the form `parameterName is Type`.

```ts
// Basic type guard
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function process(input: unknown) {
  if (isString(input)) {
    // input is narrowed to string
    console.log(input.toUpperCase());
  }
}
```

```ts
// Type guard for an interface
interface Car {
  make: string;
  model: string;
  year: number;
}

interface Bicycle {
  brand: string;
  gears: number;
}

function isCar(vehicle: Car | Bicycle): vehicle is Car {
  return "make" in vehicle && "model" in vehicle;
}

function describe(vehicle: Car | Bicycle) {
  if (isCar(vehicle)) {
    // vehicle is narrowed to Car
    console.log(`${vehicle.year} ${vehicle.make} ${vehicle.model}`);
  } else {
    // vehicle is narrowed to Bicycle
    console.log(`${vehicle.brand} with ${vehicle.gears} gears`);
  }
}
```

Type guards are reusable and composable -- extract complex narrowing logic into named functions:

```ts
function isNonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

const values: (string | null | undefined)[] = ["a", null, "b", undefined, "c"];
const filtered: string[] = values.filter(isNonNullable);
// filtered is string[] -- ["a", "b", "c"]
```

---

## Assertion Functions

Assertion functions are similar to type guards, but instead of returning a boolean, they **throw an error** if the condition is not met. They use the `asserts` keyword.

```ts
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new Error(`Expected string, got ${typeof value}`);
  }
}

function process(input: unknown) {
  assertIsString(input);
  // After the assertion, input is narrowed to string
  // If input was not a string, an error was thrown above
  console.log(input.toUpperCase()); // OK
}
```

Assertion for non-null:

```ts
function assertNonNull<T>(value: T | null | undefined): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error("Value must not be null or undefined");
  }
}

function getLength(name: string | null) {
  assertNonNull(name);
  // name is narrowed to string
  return name.length; // OK
}
```

Assertion with a condition (like Node's `assert`):

```ts
function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function divide(a: number, b: number) {
  assert(b !== 0, "Divisor must not be zero");
  return a / b;
}
```

---

## Discriminated Unions (Tagged Unions)

A discriminated union is a pattern where each member of a union has a common **literal-typed** property (the "discriminant" or "tag") that TypeScript can use to narrow the type.

### The Discriminant Property Pattern

Every member of the union shares a property with a **unique literal type** value:

```ts
interface Circle {
  kind: "circle";     // literal type "circle"
  radius: number;
}

interface Square {
  kind: "square";     // literal type "square"
  sideLength: number;
}

interface Triangle {
  kind: "triangle";   // literal type "triangle"
  base: number;
  height: number;
}

type Shape = Circle | Square | Triangle;
```

The `kind` property is the discriminant. Each variant has a unique string literal for `kind`.

### Using switch/case with Discriminated Unions

The `switch` statement is the natural way to handle discriminated unions:

```ts
function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      // shape is narrowed to Circle
      return Math.PI * shape.radius ** 2;

    case "square":
      // shape is narrowed to Square
      return shape.sideLength ** 2;

    case "triangle":
      // shape is narrowed to Triangle
      return 0.5 * shape.base * shape.height;
  }
}
```

You can also use `if/else` chains:

```ts
function describeShape(shape: Shape): string {
  if (shape.kind === "circle") {
    return `Circle with radius ${shape.radius}`;
  } else if (shape.kind === "square") {
    return `Square with side ${shape.sideLength}`;
  } else {
    return `Triangle with base ${shape.base} and height ${shape.height}`;
  }
}
```

### Full Example: Shape with kind property

```ts
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}

interface Triangle {
  kind: "triangle";
  base: number;
  height: number;
}

type Shape = Circle | Square | Triangle;

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    case "triangle":
      return 0.5 * shape.base * shape.height;
  }
}

function getPerimeter(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return 2 * Math.PI * shape.radius;
    case "square":
      return 4 * shape.sideLength;
    case "triangle":
      // Simplified: assumes equilateral for demo
      return 3 * shape.base;
  }
}

// Usage
const myCircle: Circle = { kind: "circle", radius: 5 };
const mySquare: Square = { kind: "square", sideLength: 10 };
const myTriangle: Triangle = { kind: "triangle", base: 6, height: 4 };

console.log(getArea(myCircle));     // 78.539...
console.log(getArea(mySquare));     // 100
console.log(getArea(myTriangle));   // 12
```

---

## Exhaustive Checking with never

The `never` type represents values that should never occur. If you have handled all cases in a discriminated union, the variable in the default branch should be of type `never`. If you add a new variant to the union but forget to handle it, TypeScript will give you a compile-time error.

### The Default Case Pattern

```ts
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}

interface Triangle {
  kind: "triangle";
  base: number;
  height: number;
}

type Shape = Circle | Square | Triangle;

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    case "triangle":
      return 0.5 * shape.base * shape.height;
    default:
      // If all cases are handled, shape is 'never' here
      const _exhaustiveCheck: never = shape;
      throw new Error(`Unhandled shape: ${_exhaustiveCheck}`);
  }
}
```

Now, if we add a new variant:

```ts
interface Pentagon {
  kind: "pentagon";
  sideLength: number;
}

type Shape = Circle | Square | Triangle | Pentagon;

// Now getArea will produce a compile error:
// Type 'Pentagon' is not assignable to type 'never'
// This forces us to add a case for "pentagon"
```

You can also extract this pattern into a helper function:

```ts
function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${JSON.stringify(value)}`);
}

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    case "triangle":
      return 0.5 * shape.base * shape.height;
    default:
      return assertNever(shape); // compile error if a case is missing
  }
}
```

---

## Why This Matters

Discriminated unions and exhaustive checking are **foundational patterns** in TypeScript. They appear everywhere in real-world code:

1. **State management** -- Redux actions, React useReducer, XState
2. **API responses** -- Loading | Success | Error patterns
3. **AST/compiler design** -- Each node type has a `kind` or `type` discriminant
4. **Domain modeling** -- Payment methods, user roles, notification types

This topic directly builds into the advanced "Discriminated unions and exhaustive checking" topic, where we explore:
- Nested discriminated unions
- Generic discriminated unions
- Using discriminated unions with mapped types
- Real-world patterns in libraries (Redux, tRPC, Zod)

Mastering type narrowing and discriminated unions makes your TypeScript code **type-safe at the boundaries** -- where bugs are most likely to hide.

---

## Quick Reference Table

| Narrowing Technique     | When to Use                                  | Syntax Example                  |
|-------------------------|----------------------------------------------|---------------------------------|
| typeof                  | Primitives (string, number, boolean, etc.)   | `typeof x === "string"`        |
| instanceof              | Class instances                              | `x instanceof Date`            |
| in operator             | Checking property existence on objects       | `"name" in obj`                |
| Truthiness              | Filtering out null/undefined (be careful)    | `if (x) { ... }`              |
| Equality                | Matching specific values or intersecting     | `x === "active"`              |
| Assignment              | After assigning a known value                | `x = "hello"`                 |
| User-defined type guard | Reusable, complex narrowing logic            | `function isX(v): v is X`     |
| Assertion function      | Throw-on-failure narrowing                   | `function assertX(): asserts` |
| Discriminated union     | Tagged objects with a common literal field   | `switch (obj.kind)`           |
| Exhaustive never check  | Ensure all union variants are handled        | `const _: never = value`      |
