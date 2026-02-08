// ============================================================
// Topic 01 - Setup and Basic Types: SOLUTIONS
// ============================================================
// This file contains the complete solutions for all 10
// challenges. Each solution includes an explanation comment.
// ============================================================

// ------------------------------------------------------------
// Challenge 1: Declare Variables with Correct Types
// ------------------------------------------------------------
// Solution: Use explicit type annotations with the colon syntax.
// TypeScript enforces that the assigned value matches the declared type.

const userName: string = "Alice";
const userAge: number = 30;
const isActive: boolean = true;

console.log("Challenge 1:", userName, userAge, isActive);

// ------------------------------------------------------------
// Challenge 2: Create a Tuple Type
// ------------------------------------------------------------
// Solution: A tuple is a fixed-length array where each position
// has a specific type. Declare with [Type1, Type2, Type3] syntax.
// The order and count of values must match exactly.

const userInfo: [string, number, boolean] = ["Alice", 30, true];

console.log("Challenge 2:", userInfo);
console.log("  Name:", userInfo[0]);   // TypeScript knows this is string
console.log("  Age:", userInfo[1]);    // TypeScript knows this is number
console.log("  Active:", userInfo[2]); // TypeScript knows this is boolean

// ------------------------------------------------------------
// Challenge 3: Create an Enum called Direction
// ------------------------------------------------------------
// Solution: Enums define a set of named constants. By default,
// numeric enums start at 0 and auto-increment.
// Direction.Up = 0, Direction.Down = 1, etc.

enum Direction {
  Up,
  Down,
  Left,
  Right,
}

const myDirection: Direction = Direction.Up;

console.log("Challenge 3:", myDirection);           // 0
console.log("  Direction name:", Direction[0]);     // "Up" (reverse mapping)

// ------------------------------------------------------------
// Challenge 4: Create a Union Type
// ------------------------------------------------------------
// Solution: A union type uses the pipe (|) operator to allow
// a variable to hold values of multiple types. The type alias
// gives it a reusable name.

type StringOrNumber = string | number;

let myId: StringOrNumber = "abc-123";  // Assigned a string
console.log("Challenge 4 (string):", myId);

myId = 456;  // Reassigned to a number -- valid because of the union
console.log("Challenge 4 (number):", myId);

// ------------------------------------------------------------
// Challenge 5: Narrow `unknown` to string
// ------------------------------------------------------------
// Solution: The 'unknown' type requires you to check (narrow) the
// type before you can use type-specific methods. We use typeof to
// narrow it. This is safer than 'any' because it forces the check.

function toUpperIfString(value: unknown): string {
  if (typeof value === "string") {
    // Inside this block, TypeScript knows 'value' is a string
    return value.toUpperCase();
  }
  return "Not a string";
}

console.log("Challenge 5:", toUpperIfString("hello"));  // "HELLO"
console.log("Challenge 5:", toUpperIfString(42));        // "Not a string"

// ------------------------------------------------------------
// Challenge 6: Create a Type Alias for a User Object
// ------------------------------------------------------------
// Solution: Use the 'type' keyword to define an object shape.
// The '?' after 'age' makes it an optional property -- it can
// be present or absent without causing an error.

type User = {
  id: number;
  name: string;
  email: string;
  age?: number; // The '?' means this property is optional
};

const user1: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  age: 30, // age is provided
};

const user2: User = {
  id: 2,
  name: "Bob",
  email: "bob@example.com",
  // age is omitted -- this is valid because it's optional
};

console.log("Challenge 6 (user1):", user1);
console.log("Challenge 6 (user2):", user2);

// ------------------------------------------------------------
// Challenge 7: Declare Typed Arrays
// ------------------------------------------------------------
// Solution: Use the type[] syntax to declare a typed array.
// TypeScript ensures every element in the array matches the type.

const scores: number[] = [95, 87, 73, 100];
const colors: string[] = ["red", "green", "blue"];

console.log("Challenge 7 (scores):", scores);
console.log("Challenge 7 (colors):", colors);

// Note: You could also use the generic syntax: Array<number> and Array<string>
// Both are equivalent. The type[] syntax is more common in practice.

// ------------------------------------------------------------
// Challenge 8: Use Type Assertion
// ------------------------------------------------------------
// Solution: Type assertions tell TypeScript to treat a value as
// a specific type. Use 'as Type' syntax. This does NOT change
// the value at runtime -- it only affects the compiler.
// Only use assertions when you are SURE about the actual type.

const mystery: unknown = "TypeScript is awesome!";

const mysteryLength: number = (mystery as string).length;

console.log("Challenge 8:", mysteryLength); // 22

// Alternative angle-bracket syntax (does NOT work in .tsx files):
// const mysteryLength: number = (<string>mystery).length;

// ------------------------------------------------------------
// Challenge 9: Demonstrate Type Inference
// ------------------------------------------------------------
// Solution: When you assign a value without a type annotation,
// TypeScript automatically infers the type from the value.
// Hover over these variables in VS Code to see the inferred types.

const inferredString = "I am a string";  // TypeScript infers: string
const inferredNumber = 42;               // TypeScript infers: number
const inferredBoolean = true;            // TypeScript infers: boolean

console.log("Challenge 9:", inferredString, inferredNumber, inferredBoolean);

// Why this matters: You don't need to annotate everything.
// TypeScript is smart enough to figure out obvious types.
// Rule of thumb: annotate function parameters, infer the rest.

// ------------------------------------------------------------
// Challenge 10: Write a Function that Returns `never`
// ------------------------------------------------------------
// Solution: A function that returns 'never' NEVER completes
// normally. It either throws an error or runs an infinite loop.
// The 'never' return type signals to TypeScript (and other
// developers) that this function will not return a value.

function throwError(message: string): never {
  throw new Error(message);
}

console.log("Challenge 10: About to throw...");
// Uncomment the line below to see it in action (it will crash the program):
// throwError("Something went wrong!");

// Note: Any code after a 'never' function call is unreachable.
// TypeScript will warn you about unreachable code if you write
// statements after calling throwError().
