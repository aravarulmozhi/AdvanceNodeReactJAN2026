// ============================================================
// Topic 06 - Union Types Deep Dive: Workout Challenges
// ============================================================

// ------------------------------------------------------------
// Challenge 1: typeof Narrowing
// Write a function `formatInput` that accepts string | number.
// - If it's a string, return it in uppercase.
// - If it's a number, return it formatted to 2 decimal places (as a string).
// Use typeof narrowing.
// ------------------------------------------------------------

function formatInput(input: string | number): string {
  // TODO: Implement using typeof narrowing
}

// Test:
// formatInput("hello")  => "HELLO"
// formatInput(3.14159)  => "3.14"


// ------------------------------------------------------------
// Challenge 2: instanceof Narrowing
// Write a function `toISOString` that accepts Date | string.
// - If it's a Date, call .toISOString() on it.
// - If it's a string, convert it to a Date first, then call .toISOString().
// Use instanceof narrowing.
// ------------------------------------------------------------

function toISOString(input: Date | string): string {
  // TODO: Implement using instanceof narrowing
}

// Test:
// toISOString(new Date("2026-01-01"))  => "2026-01-01T00:00:00.000Z"
// toISOString("2026-06-15")            => "2026-06-15T00:00:00.000Z"


// ------------------------------------------------------------
// Challenge 3: 'in' Operator Narrowing
// Given the two types below, write a function `describeVehicle`
// that returns a description string.
// - If it has "horsepower", describe it as a MotorVehicle.
// - If it has "pedalType", describe it as a Bicycle.
// Use the 'in' operator for narrowing.
// ------------------------------------------------------------

type MotorVehicle = {
  name: string;
  horsepower: number;
  fuelType: string;
};

type Bicycle = {
  name: string;
  pedalType: string;
  gears: number;
};

function describeVehicle(vehicle: MotorVehicle | Bicycle): string {
  // TODO: Implement using 'in' operator narrowing
  // MotorVehicle => "MotorVehicle: <name> with <horsepower>hp running on <fuelType>"
  // Bicycle      => "Bicycle: <name> with <gears> gears and <pedalType> pedals"
}

// Test:
// describeVehicle({ name: "Mustang", horsepower: 450, fuelType: "gasoline" })
//   => "MotorVehicle: Mustang with 450hp running on gasoline"
// describeVehicle({ name: "Trek", pedalType: "clipless", gears: 21 })
//   => "Bicycle: Trek with 21 gears and clipless pedals"


// ------------------------------------------------------------
// Challenge 4: Custom Type Guard
// Write a user-defined type guard function `isNumber`
// that checks whether an unknown value is a number.
// Then write a function `doubleIfNumber` that uses it.
// ------------------------------------------------------------

function isNumber(value: unknown): value is number {
  // TODO: Implement
}

function doubleIfNumber(value: unknown): number | null {
  // TODO: Use isNumber to narrow, return doubled value or null
}

// Test:
// isNumber(42)       => true
// isNumber("hello")  => false
// doubleIfNumber(21) => 42
// doubleIfNumber("x") => null


// ------------------------------------------------------------
// Challenge 5: Assertion Function
// Write an assertion function `assertNonNull` that asserts
// a value is not null or undefined. It should throw an Error
// with a descriptive message if the value is null or undefined.
// Then write a function `getLength` that uses it.
// ------------------------------------------------------------

function assertNonNull<T>(val: T | null | undefined): asserts val is T {
  // TODO: Implement - throw if null or undefined
}

function getLength(input: string | null): number {
  // TODO: Use assertNonNull, then return input.length
}

// Test:
// getLength("hello") => 5
// getLength(null)     => throws Error


// ------------------------------------------------------------
// Challenge 6: Discriminated Union - Shape Types
// Create a discriminated union for shapes using a `kind` field.
// Define interfaces for Circle, Square, and Triangle.
// - Circle: kind "circle", radius: number
// - Square: kind "square", sideLength: number
// - Triangle: kind "triangle", base: number, height: number
// Create the union type Shape = Circle | Square | Triangle
// ------------------------------------------------------------

// TODO: Define Circle interface

// TODO: Define Square interface

// TODO: Define Triangle interface

// TODO: Define Shape union type


// ------------------------------------------------------------
// Challenge 7: switch/case with Discriminated Union
// Write a function `getArea` that takes a Shape and returns
// its area using switch/case on shape.kind.
// - Circle area: Math.PI * radius^2
// - Square area: sideLength^2
// - Triangle area: 0.5 * base * height
// ------------------------------------------------------------

// function getArea(shape: Shape): number {
//   // TODO: Implement using switch/case
// }

// Test:
// getArea({ kind: "circle", radius: 5 })             => ~78.54
// getArea({ kind: "square", sideLength: 4 })          => 16
// getArea({ kind: "triangle", base: 10, height: 6 })  => 30


// ------------------------------------------------------------
// Challenge 8: Exhaustive Checking with never
// Update your getArea function (or write a new version called
// getAreaExhaustive) that includes a default case with
// exhaustive checking using the never type.
// This ensures that if a new shape is added to the union,
// the compiler will flag the missing case.
// ------------------------------------------------------------

// function getAreaExhaustive(shape: Shape): number {
//   // TODO: Implement with exhaustive never check in default
// }


// ------------------------------------------------------------
// Challenge 9: Discriminated Union - API Response
// Create a discriminated union for API responses using a
// `status` field as the discriminant:
// - Loading: status "loading"
// - Success<T>: status "success", data: T
// - ErrorResponse: status "error", error: string, code: number
//
// Then create a type ApiResponse<T> = Loading | Success<T> | ErrorResponse
//
// Write a function `handleResponse` that takes an
// ApiResponse<string[]> and:
// - If loading, returns "Loading..."
// - If success, returns the data joined by ", "
// - If error, returns "Error (<code>): <error>"
// Include exhaustive checking.
// ------------------------------------------------------------

// TODO: Define Loading interface

// TODO: Define Success<T> interface

// TODO: Define ErrorResponse interface

// TODO: Define ApiResponse<T> type

// function handleResponse(response: ApiResponse<string[]>): string {
//   // TODO: Implement with switch/case and exhaustive checking
// }

// Test:
// handleResponse({ status: "loading" })
//   => "Loading..."
// handleResponse({ status: "success", data: ["a", "b", "c"] })
//   => "a, b, c"
// handleResponse({ status: "error", error: "Not found", code: 404 })
//   => "Error (404): Not found"


// ------------------------------------------------------------
// Challenge 10: Type Guard for API Response
// Write a type guard function `isSuccessResponse` that
// checks whether an ApiResponse<T> is a Success<T>.
// Write another type guard `isErrorResponse` that checks
// for ErrorResponse.
// Then write a function `extractData` that uses
// isSuccessResponse to safely extract data or return null.
// ------------------------------------------------------------

// function isSuccessResponse<T>(response: ApiResponse<T>): response is Success<T> {
//   // TODO: Implement
// }

// function isErrorResponse<T>(response: ApiResponse<T>): response is ErrorResponse {
//   // TODO: Implement
// }

// function extractData<T>(response: ApiResponse<T>): T | null {
//   // TODO: Use isSuccessResponse, return data or null
// }

// Test:
// extractData({ status: "success", data: [1, 2, 3] })  => [1, 2, 3]
// extractData({ status: "loading" })                     => null
// extractData({ status: "error", error: "fail", code: 500 }) => null
