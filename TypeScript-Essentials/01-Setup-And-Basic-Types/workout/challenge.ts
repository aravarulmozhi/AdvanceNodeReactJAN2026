// ============================================================
// Topic 01 - Setup and Basic Types: CHALLENGES
// ============================================================
// Instructions:
//   - Complete each challenge by replacing the TODO comments
//     with your own code.
//   - Do NOT change the challenge numbers or section headers.
//   - Run this file with: npx ts-node challenge.ts
//     or: npx tsx challenge.ts
// ============================================================

// ------------------------------------------------------------
// Challenge 1: Declare Variables with Correct Types
// ------------------------------------------------------------
// Declare three variables:
//   - 'name' of type string, assigned to your name
//   - 'age' of type number, assigned to your age
//   - 'isActive' of type boolean, assigned to true
// Use explicit type annotations for all three.

// TODO: Declare 'userName' as a string
// TODO: Declare 'userAge' as a number
// TODO: Declare 'isActive' as a boolean

// ------------------------------------------------------------
// Challenge 2: Create a Tuple Type
// ------------------------------------------------------------
// Create a variable called 'userInfo' that is a tuple
// holding exactly three values: [string, number, boolean]
// Example value: ["Alice", 30, true]

// TODO: Declare 'userInfo' as a tuple of [string, number, boolean]

// ------------------------------------------------------------
// Challenge 3: Create an Enum called Direction
// ------------------------------------------------------------
// Create an enum named 'Direction' with four members:
//   Up, Down, Left, Right
// Then create a variable 'myDirection' and assign it Direction.Up
// Log the value to the console.

// TODO: Create the Direction enum

// TODO: Create 'myDirection' and assign Direction.Up

// ------------------------------------------------------------
// Challenge 4: Create a Union Type
// ------------------------------------------------------------
// Create a type alias called 'StringOrNumber' that accepts
// either a string or a number.
// Then declare a variable 'myId' of type StringOrNumber
// and assign it a string value first, then reassign it to a number.

// TODO: Create type alias 'StringOrNumber'

// TODO: Declare 'myId' with type StringOrNumber and assign a string

// TODO: Reassign 'myId' to a number

// ------------------------------------------------------------
// Challenge 5: Narrow `unknown` to string
// ------------------------------------------------------------
// Write a function called 'toUpperIfString' that:
//   - Takes one parameter 'value' of type unknown
//   - Checks if 'value' is a string using typeof
//   - If it is a string, returns value.toUpperCase()
//   - Otherwise, returns "Not a string"

// TODO: Write the function 'toUpperIfString'

// Test your function (uncomment after solving):
// console.log(toUpperIfString("hello"));  // "HELLO"
// console.log(toUpperIfString(42));        // "Not a string"

// ------------------------------------------------------------
// Challenge 6: Create a Type Alias for a User Object
// ------------------------------------------------------------
// Create a type alias called 'User' with the following properties:
//   - id: number (required)
//   - name: string (required)
//   - email: string (required)
//   - age: number (optional)
//
// Then create a variable 'user1' of type User WITH age,
// and a variable 'user2' of type User WITHOUT age.

// TODO: Create the 'User' type alias

// TODO: Create 'user1' (with age)

// TODO: Create 'user2' (without age)

// ------------------------------------------------------------
// Challenge 7: Declare Typed Arrays
// ------------------------------------------------------------
// Declare a variable 'scores' that is an array of numbers,
// initialized with [95, 87, 73, 100].
// Declare a variable 'colors' that is an array of strings,
// initialized with ["red", "green", "blue"].

// TODO: Declare 'scores' as a number array

// TODO: Declare 'colors' as a string array

// ------------------------------------------------------------
// Challenge 8: Use Type Assertion
// ------------------------------------------------------------
// A variable 'mystery' is declared as unknown below.
// Use a type assertion (the 'as' keyword) to treat it as a string
// and call .length on it. Store the result in 'mysteryLength'.

const mystery: unknown = "TypeScript is awesome!";

// TODO: Use type assertion to get the length of 'mystery'
// let mysteryLength = ???

// ------------------------------------------------------------
// Challenge 9: Demonstrate Type Inference
// ------------------------------------------------------------
// Declare a variable WITHOUT a type annotation and let TypeScript
// infer the type from the assigned value.
// Declare three variables:
//   - 'inferredString' assigned to any string
//   - 'inferredNumber' assigned to any number
//   - 'inferredBoolean' assigned to any boolean
// Do NOT add type annotations -- let TypeScript infer them.

// TODO: Declare 'inferredString' (no type annotation)

// TODO: Declare 'inferredNumber' (no type annotation)

// TODO: Declare 'inferredBoolean' (no type annotation)

// ------------------------------------------------------------
// Challenge 10: Write a Function that Returns `never`
// ------------------------------------------------------------
// Write a function called 'throwError' that:
//   - Takes a parameter 'message' of type string
//   - Has an explicit return type of 'never'
//   - Throws a new Error with the given message
//
// This function should NEVER return normally -- it always throws.

// TODO: Write the 'throwError' function

// Test your function (uncomment after solving):
// throwError("Something went wrong!");  // Should throw an Error
