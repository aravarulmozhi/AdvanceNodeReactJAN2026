// ============================================================
// Topic 02 - Functions and Objects: Solutions
// ============================================================

// ------------------------------------------------------------
// Challenge 1: Basic Function with Type Annotations
// ------------------------------------------------------------
// Both parameter types and the return type are explicitly annotated.
function add(a: number, b: number): number {
  return a + b;
}

console.log("Challenge 1:", add(3, 5)); // 8

// ------------------------------------------------------------
// Challenge 2: Optional and Default Parameters
// ------------------------------------------------------------
// The `greeting` parameter has a default value of "Hello".
// Because it has a default, it is automatically optional,
// and its type inside the function body is `string` (not string | undefined).
function greet(name: string, greeting: string = "Hello"): string {
  return `${greeting}, ${name}!`;
}

console.log("Challenge 2:", greet("Alice"));         // "Hello, Alice!"
console.log("Challenge 2:", greet("Alice", "Hey"));  // "Hey, Alice!"

// ------------------------------------------------------------
// Challenge 3: Rest Parameters
// ------------------------------------------------------------
// The rest parameter `...numbers` collects all arguments into a number[].
// We use reduce to sum them, starting from 0.
function sum(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0);
}

console.log("Challenge 3:", sum(1, 2, 3));    // 6
console.log("Challenge 3:", sum(10, 20));     // 30
console.log("Challenge 3:", sum());           // 0

// ------------------------------------------------------------
// Challenge 4: Function Type Alias
// ------------------------------------------------------------
// MathOperation is a reusable type for any function that takes
// two numbers and returns a number.
type MathOperation = (a: number, b: number) => number;

const multiply: MathOperation = (a, b) => a * b;
const subtract: MathOperation = (a, b) => a - b;

console.log("Challenge 4 (multiply):", multiply(4, 5));   // 20
console.log("Challenge 4 (subtract):", subtract(10, 3));  // 7

// ------------------------------------------------------------
// Challenge 5: Function Overloads
// ------------------------------------------------------------
// Overload signatures define the public API — what callers see.
// The implementation signature must handle all overloaded cases.
function format(value: string): string;
function format(value: number): string;
function format(value: string | number): string {
  if (typeof value === "string") {
    return value.trim().toUpperCase();
  }
  return value.toFixed(2);
}

console.log("Challenge 5 (string):", format("  hello  ")); // "HELLO"
console.log("Challenge 5 (number):", format(3.14159));      // "3.14"

// ------------------------------------------------------------
// Challenge 6: Object Type with Readonly Properties
// ------------------------------------------------------------
// `readonly` prevents reassignment of id and name after creation.
// `price` remains mutable.
interface Product {
  readonly id: number;
  readonly name: string;
  price: number;
}

const testProduct: Product = { id: 1, name: "Widget", price: 9.99 };
// testProduct.id = 2;      // Error: Cannot assign to 'id' because it is a read-only property
// testProduct.name = "X";  // Error: Cannot assign to 'name' because it is a read-only property
testProduct.price = 12.99;  // OK - price is not readonly

console.log("Challenge 6:", testProduct);

// ------------------------------------------------------------
// Challenge 7: Interface with Index Signature
// ------------------------------------------------------------
// The index signature [key: string]: string means any string
// key maps to a string value.
interface Dictionary {
  [key: string]: string;
}

const myDict: Dictionary = {
  hello: "world",
  foo: "bar",
  language: "TypeScript",
};

// You can also add new entries dynamically
myDict["framework"] = "React";

console.log("Challenge 7:", myDict);

// ------------------------------------------------------------
// Challenge 8: as const Assertion
// ------------------------------------------------------------
// Without as const: type is string[] (mutable, wide type)
const colorsMutable = ["red", "green", "blue"];

// With as const: type is readonly ["red", "green", "blue"] (immutable, narrow literal types)
const colorsImmutable = ["red", "green", "blue"] as const;

// colorsMutable is string[] — you can push, pop, and reassign elements
colorsMutable.push("yellow"); // OK

// colorsImmutable is readonly ["red", "green", "blue"]
// colorsImmutable.push("yellow"); // Error: Property 'push' does not exist on type 'readonly ["red", "green", "blue"]'
// This errors because `as const` makes the array readonly and fixes the tuple length and literal types.

console.log("Challenge 8 (mutable):", colorsMutable);
console.log("Challenge 8 (immutable):", colorsImmutable);

// ------------------------------------------------------------
// Challenge 9: Callback Parameter
// ------------------------------------------------------------
// The callback parameter is typed as (n: number) => number.
// processArray applies it to each element via .map().
function processArray(
  numbers: number[],
  callback: (n: number) => number
): number[] {
  return numbers.map(callback);
}

const doubled = processArray([1, 2, 3], (n) => n * 2);
const squared = processArray([1, 2, 3], (n) => n * n);

console.log("Challenge 9 (doubled):", doubled);  // [2, 4, 6]
console.log("Challenge 9 (squared):", squared);  // [1, 4, 9]

// ------------------------------------------------------------
// Challenge 10: Destructured Object Parameter
// ------------------------------------------------------------
// The function parameter destructures a UserConfig object directly.
// The `email` property uses a default value of "not provided"
// in the destructuring pattern.
interface UserConfig {
  name: string;
  age: number;
  email?: string;
}

function createWelcome({ name, age, email = "not provided" }: UserConfig): string {
  return `Welcome ${name} (age: ${age}, email: ${email})`;
}

console.log("Challenge 10:", createWelcome({ name: "Alice", age: 30 }));
// "Welcome Alice (age: 30, email: not provided)"

console.log("Challenge 10:", createWelcome({ name: "Bob", age: 25, email: "bob@example.com" }));
// "Welcome Bob (age: 25, email: bob@example.com)"
