// ============================================================
// Topic 06 - Union Types Deep Dive: Workout Solutions
// ============================================================

// ------------------------------------------------------------
// Solution 1: typeof Narrowing
// We use typeof to distinguish between string and number,
// then apply the appropriate transformation in each branch.
// ------------------------------------------------------------

function formatInput(input: string | number): string {
  if (typeof input === "string") {
    // TypeScript narrows `input` to string in this block
    return input.toUpperCase();
  } else {
    // TypeScript narrows `input` to number in this block
    return input.toFixed(2);
  }
}

// Tests
console.log(formatInput("hello"));   // "HELLO"
console.log(formatInput(3.14159));    // "3.14"


// ------------------------------------------------------------
// Solution 2: instanceof Narrowing
// We use instanceof to check whether the input is a Date
// object. If not, it must be a string, so we construct a
// Date from it before calling toISOString().
// ------------------------------------------------------------

function toISOString(input: Date | string): string {
  if (input instanceof Date) {
    // TypeScript narrows `input` to Date
    return input.toISOString();
  } else {
    // TypeScript narrows `input` to string
    return new Date(input).toISOString();
  }
}

// Tests
console.log(toISOString(new Date("2026-01-01"))); // "2026-01-01T00:00:00.000Z"
console.log(toISOString("2026-06-15"));            // "2026-06-15T00:00:00.000Z"


// ------------------------------------------------------------
// Solution 3: 'in' Operator Narrowing
// The 'in' operator checks for property existence on an
// object. Since "horsepower" only exists on MotorVehicle
// and "pedalType" only exists on Bicycle, TypeScript can
// narrow the union accordingly.
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
  if ("horsepower" in vehicle) {
    // TypeScript narrows `vehicle` to MotorVehicle
    return `MotorVehicle: ${vehicle.name} with ${vehicle.horsepower}hp running on ${vehicle.fuelType}`;
  } else {
    // TypeScript narrows `vehicle` to Bicycle
    return `Bicycle: ${vehicle.name} with ${vehicle.gears} gears and ${vehicle.pedalType} pedals`;
  }
}

// Tests
console.log(describeVehicle({ name: "Mustang", horsepower: 450, fuelType: "gasoline" }));
// "MotorVehicle: Mustang with 450hp running on gasoline"

console.log(describeVehicle({ name: "Trek", pedalType: "clipless", gears: 21 }));
// "Bicycle: Trek with 21 gears and clipless pedals"


// ------------------------------------------------------------
// Solution 4: Custom Type Guard
// A user-defined type guard returns a boolean, but its
// return type is annotated as `value is number`. This tells
// TypeScript to narrow the type in the calling scope when
// the function returns true.
// ------------------------------------------------------------

function isNumber(value: unknown): value is number {
  return typeof value === "number" && !Number.isNaN(value);
}

function doubleIfNumber(value: unknown): number | null {
  if (isNumber(value)) {
    // TypeScript narrows `value` to number thanks to the type guard
    return value * 2;
  }
  return null;
}

// Tests
console.log(isNumber(42));         // true
console.log(isNumber("hello"));    // false
console.log(isNumber(NaN));        // false (we explicitly exclude NaN)
console.log(doubleIfNumber(21));   // 42
console.log(doubleIfNumber("x"));  // null


// ------------------------------------------------------------
// Solution 5: Assertion Function
// An assertion function uses `asserts val is T` as its
// return type. If the function returns normally (without
// throwing), TypeScript treats the value as narrowed to T
// from that point forward.
// ------------------------------------------------------------

function assertNonNull<T>(val: T | null | undefined): asserts val is T {
  if (val === null || val === undefined) {
    throw new Error(
      `Expected non-null/non-undefined value, but received ${val === null ? "null" : "undefined"}`
    );
  }
}

function getLength(input: string | null): number {
  // After this call, TypeScript knows `input` is string (not null)
  assertNonNull(input);
  return input.length;
}

// Tests
console.log(getLength("hello")); // 5
try {
  getLength(null); // throws Error
} catch (e) {
  console.log((e as Error).message); // "Expected non-null/non-undefined value, but received null"
}


// ------------------------------------------------------------
// Solution 6: Discriminated Union - Shape Types
// Each interface has a `kind` property with a unique string
// literal type. This shared property is the "discriminant"
// that TypeScript uses to narrow the union.
// ------------------------------------------------------------

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


// ------------------------------------------------------------
// Solution 7: switch/case with Discriminated Union
// When we switch on shape.kind, TypeScript narrows the type
// of shape within each case block. This gives us full access
// to the specific properties of each shape variant.
// ------------------------------------------------------------

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

// Tests
console.log(getArea({ kind: "circle", radius: 5 }));             // ~78.5398
console.log(getArea({ kind: "square", sideLength: 4 }));          // 16
console.log(getArea({ kind: "triangle", base: 10, height: 6 }));  // 30


// ------------------------------------------------------------
// Solution 8: Exhaustive Checking with never
// By assigning shape to a variable of type `never` in the
// default case, we create a compile-time safety net. If a
// new variant is added to the Shape union but not handled
// in the switch, TypeScript will report an error because
// the new variant cannot be assigned to `never`.
// ------------------------------------------------------------

// Helper function for exhaustive checks (reusable across the codebase)
function assertNever(value: never): never {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
}

function getAreaExhaustive(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;

    case "square":
      return shape.sideLength ** 2;

    case "triangle":
      return 0.5 * shape.base * shape.height;

    default:
      // If all cases are handled, shape is `never` here.
      // If we add a new shape variant (e.g., Pentagon) to the union
      // without adding a case for it, this line will produce a
      // compile error: "Argument of type 'Pentagon' is not
      // assignable to parameter of type 'never'."
      return assertNever(shape);
  }
}

// Tests (same results as getArea)
console.log(getAreaExhaustive({ kind: "circle", radius: 5 }));    // ~78.5398
console.log(getAreaExhaustive({ kind: "square", sideLength: 4 })); // 16
console.log(getAreaExhaustive({ kind: "triangle", base: 10, height: 6 })); // 30


// ------------------------------------------------------------
// Solution 9: Discriminated Union - API Response
// This is a very common real-world pattern. The `status`
// field acts as the discriminant. The Success type is
// generic, allowing it to carry any data payload.
// ------------------------------------------------------------

interface Loading {
  status: "loading";
}

interface Success<T> {
  status: "success";
  data: T;
}

interface ErrorResponse {
  status: "error";
  error: string;
  code: number;
}

type ApiResponse<T> = Loading | Success<T> | ErrorResponse;

function handleResponse(response: ApiResponse<string[]>): string {
  switch (response.status) {
    case "loading":
      // response is narrowed to Loading
      return "Loading...";

    case "success":
      // response is narrowed to Success<string[]>
      return response.data.join(", ");

    case "error":
      // response is narrowed to ErrorResponse
      return `Error (${response.code}): ${response.error}`;

    default:
      // Exhaustive check: if all cases are covered, response is `never`
      return assertNever(response);
  }
}

// Tests
console.log(handleResponse({ status: "loading" }));
// "Loading..."

console.log(handleResponse({ status: "success", data: ["a", "b", "c"] }));
// "a, b, c"

console.log(handleResponse({ status: "error", error: "Not found", code: 404 }));
// "Error (404): Not found"


// ------------------------------------------------------------
// Solution 10: Type Guard for API Response
// Type guards let us encapsulate narrowing logic into
// reusable functions. This is especially useful when
// narrowing logic is needed in multiple places or when
// the narrowing condition is more complex.
// ------------------------------------------------------------

function isSuccessResponse<T>(response: ApiResponse<T>): response is Success<T> {
  // We check the discriminant property directly.
  // When this returns true, TypeScript narrows the type to Success<T>.
  return response.status === "success";
}

function isErrorResponse<T>(response: ApiResponse<T>): response is ErrorResponse {
  return response.status === "error";
}

function extractData<T>(response: ApiResponse<T>): T | null {
  if (isSuccessResponse(response)) {
    // response is narrowed to Success<T>
    return response.data;
  }
  // For Loading or ErrorResponse, there is no data to extract
  return null;
}

// Tests
console.log(extractData({ status: "success", data: [1, 2, 3] }));
// [1, 2, 3]

console.log(extractData({ status: "loading" }));
// null

console.log(extractData({ status: "error", error: "fail", code: 500 }));
// null

// Bonus: Using the type guards in a more complex scenario
function processApiResponse<T>(response: ApiResponse<T>): void {
  if (isSuccessResponse(response)) {
    console.log("Success! Data:", response.data);
  } else if (isErrorResponse(response)) {
    console.log(`Error ${response.code}: ${response.error}`);
  } else {
    // response is narrowed to Loading
    console.log("Still loading, please wait...");
  }
}

processApiResponse({ status: "success", data: { name: "Alice" } });
// "Success! Data: { name: 'Alice' }"

processApiResponse({ status: "error", error: "Timeout", code: 408 });
// "Error 408: Timeout"

processApiResponse({ status: "loading" });
// "Still loading, please wait..."
