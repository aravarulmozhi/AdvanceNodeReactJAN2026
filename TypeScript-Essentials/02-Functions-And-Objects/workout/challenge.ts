// ============================================================
// Topic 02 - Functions and Objects: Challenges
// ============================================================
// Complete each challenge below by replacing the TODO comments
// with working TypeScript code. Do NOT change the challenge
// numbers or descriptions.
// ============================================================

// ------------------------------------------------------------
// Challenge 1: Basic Function with Type Annotations
// ------------------------------------------------------------
// TODO: Write a function called `add` that takes two parameters
// of type number and returns their sum. Annotate both the
// parameter types and the return type explicitly.

// ------------------------------------------------------------
// Challenge 2: Optional and Default Parameters
// ------------------------------------------------------------
// TODO: Write a function called `greet` that takes a required
// `name` parameter (string) and an optional `greeting` parameter
// (string) with a default value of "Hello".
// It should return a string in the format: "{greeting}, {name}!"
// Example: greet("Alice") => "Hello, Alice!"
// Example: greet("Alice", "Hey") => "Hey, Alice!"

// ------------------------------------------------------------
// Challenge 3: Rest Parameters
// ------------------------------------------------------------
// TODO: Write a function called `sum` that uses rest parameters
// to accept any number of numeric arguments and returns their
// total. Use the spread syntax (...) with a proper type.
// Example: sum(1, 2, 3) => 6
// Example: sum(10, 20) => 30

// ------------------------------------------------------------
// Challenge 4: Function Type Alias
// ------------------------------------------------------------
// TODO: Create a type alias called `MathOperation` that
// describes a function taking two numbers and returning a number.
// Then create two variables using this type:
//   - `multiply` that multiplies the two numbers
//   - `subtract` that subtracts the second from the first

// ------------------------------------------------------------
// Challenge 5: Function Overloads
// ------------------------------------------------------------
// TODO: Write function overloads for a function called `format`:
//   - Overload 1: takes a string, returns a string (trims and uppercases it)
//   - Overload 2: takes a number, returns a string (formats to 2 decimal places)
// Remember: write the overload signatures first (no body),
// then write a single implementation that handles both cases.

// ------------------------------------------------------------
// Challenge 6: Object Type with Readonly Properties
// ------------------------------------------------------------
// TODO: Create a type (or interface) called `Product` with:
//   - readonly id: number
//   - readonly name: string
//   - price: number (mutable)
// Then create a Product object. Try uncommenting the lines below
// to verify that readonly works (they should cause errors).

// const testProduct: Product = { id: 1, name: "Widget", price: 9.99 };
// testProduct.id = 2;      // Should error
// testProduct.name = "X";  // Should error
// testProduct.price = 12;  // Should work

// ------------------------------------------------------------
// Challenge 7: Interface with Index Signature
// ------------------------------------------------------------
// TODO: Create an interface called `Dictionary` that allows
// any string key and has string values.
// Then create a variable of type Dictionary and add a few
// key-value pairs to it.
// Example: { hello: "world", foo: "bar" }

// ------------------------------------------------------------
// Challenge 8: as const Assertion
// ------------------------------------------------------------
// TODO: Create two arrays with the same values ["red", "green", "blue"]:
//   - `colorsMutable` without as const
//   - `colorsImmutable` with as const
// Hover over each variable (or add type annotations) to observe
// the difference in inferred types.
// Then try: colorsImmutable.push("yellow") — it should error.
// Leave that line commented out with a note explaining why.

// ------------------------------------------------------------
// Challenge 9: Callback Parameter
// ------------------------------------------------------------
// TODO: Write a function called `processArray` that takes:
//   - an array of numbers
//   - a callback function that takes a number and returns a number
// The function should return a new array with the callback
// applied to each element.
// Example: processArray([1, 2, 3], (n) => n * 2) => [2, 4, 6]

// ------------------------------------------------------------
// Challenge 10: Destructured Object Parameter
// ------------------------------------------------------------
// TODO: Create an interface called `UserConfig` with:
//   - name: string
//   - age: number
//   - email?: string (optional)
// Then write a function called `createWelcome` that takes a
// destructured UserConfig parameter and returns a welcome string.
// Use a default value of "not provided" for email in the destructuring.
// Example: createWelcome({ name: "Alice", age: 30 })
//   => "Welcome Alice (age: 30, email: not provided)"
