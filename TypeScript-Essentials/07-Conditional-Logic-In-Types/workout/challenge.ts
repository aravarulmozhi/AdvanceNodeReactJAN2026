// ============================================================
// Topic 07 - Conditional Logic in Types: Challenges
// ============================================================
// Complete each challenge by replacing the `unknown` or `any`
// placeholders with the correct conditional type logic.
//
// Run this file with: npx tsc --noEmit challenge.ts
// All type errors marked with @ts-expect-error should remain
// as errors. All valid assignments should compile cleanly.
// ============================================================


// ------------------------------------------------------------
// Challenge 1: IsString<T>
// ------------------------------------------------------------
// Create a conditional type that returns the literal type `true`
// if T is a string (or string literal), and `false` otherwise.
// ------------------------------------------------------------

type IsString<T> = unknown; // <-- Replace `unknown`

// Tests:
type IsString_1 = IsString<string>;     // Expected: true
type IsString_2 = IsString<"hello">;    // Expected: true
type IsString_3 = IsString<number>;     // Expected: false
type IsString_4 = IsString<boolean>;    // Expected: false

const isStr1: IsString_1 = true;
const isStr3: IsString_3 = false;


// ------------------------------------------------------------
// Challenge 2: IsArray<T>
// ------------------------------------------------------------
// Create a conditional type that checks if T is any kind of
// array (e.g., string[], number[], unknown[]).
// Return `true` if T is an array, `false` otherwise.
// ------------------------------------------------------------

type IsArray<T> = unknown; // <-- Replace `unknown`

// Tests:
type IsArray_1 = IsArray<string[]>;       // Expected: true
type IsArray_2 = IsArray<number[]>;       // Expected: true
type IsArray_3 = IsArray<[1, 2, 3]>;     // Expected: true (tuples are arrays)
type IsArray_4 = IsArray<string>;         // Expected: false
type IsArray_5 = IsArray<{ length: 5 }>; // Expected: false

const isArr1: IsArray_1 = true;
const isArr4: IsArray_4 = false;


// ------------------------------------------------------------
// Challenge 3: MyNonNullable<T>
// ------------------------------------------------------------
// Implement your own version of TypeScript's built-in
// NonNullable<T> using conditional types.
// It should remove `null` and `undefined` from a union type.
// ------------------------------------------------------------

type MyNonNullable<T> = unknown; // <-- Replace `unknown`

// Tests:
type MNN_1 = MyNonNullable<string | null>;             // Expected: string
type MNN_2 = MyNonNullable<number | undefined>;        // Expected: number
type MNN_3 = MyNonNullable<string | null | undefined>; // Expected: string
type MNN_4 = MyNonNullable<null | undefined>;          // Expected: never

const mnn1: MNN_1 = "hello";
const mnn2: MNN_2 = 42;

// @ts-expect-error -- null should be excluded
const mnn1_err: MNN_1 = null;


// ------------------------------------------------------------
// Challenge 4: Flatten<T>
// ------------------------------------------------------------
// Create a type that extracts the element type if T is an array.
// If T is not an array, return T unchanged.
//
// Hint: You can use `T extends (infer U)[]` or
//       `T extends Array<infer U>` to extract the element type.
// ------------------------------------------------------------

type Flatten<T> = unknown; // <-- Replace `unknown`

// Tests:
type Flat_1 = Flatten<string[]>;     // Expected: string
type Flat_2 = Flatten<number[]>;     // Expected: number
type Flat_3 = Flatten<boolean[][]>;  // Expected: boolean[] (only one level)
type Flat_4 = Flatten<string>;       // Expected: string (not an array)
type Flat_5 = Flatten<42>;          // Expected: 42

const flat1: Flat_1 = "hello";
const flat3: Flat_3 = [true, false];
const flat4: Flat_4 = "world";


// ------------------------------------------------------------
// Challenge 5: Distributive Behavior
// ------------------------------------------------------------
// Create a conditional type `ToArray<T>` that wraps T in an array.
// Because of distribution, applying it to a union should give
// a union of arrays, NOT an array of the union.
//
// Then demonstrate what happens when you pass a union to it.
// ------------------------------------------------------------

type ToArray<T> = unknown; // <-- Replace `unknown`

// Tests:
type TA_1 = ToArray<string>;           // Expected: string[]
type TA_2 = ToArray<number>;           // Expected: number[]
type TA_3 = ToArray<string | number>;  // Expected: string[] | number[]
//                                        (NOT (string | number)[] !)

const ta1: TA_1 = ["a", "b"];
const ta3: TA_3 = [1, 2, 3];          // number[] is valid
const ta3b: TA_3 = ["a", "b"];        // string[] is also valid

// @ts-expect-error -- mixed array is NOT valid
const ta3_err: TA_3 = [1, "a"];


// ------------------------------------------------------------
// Challenge 6: Preventing Distribution
// ------------------------------------------------------------
// Create a type `ToArrayNonDist<T>` that wraps T in an array
// WITHOUT distributing over union members.
// When given a union, it should produce a single array type
// that can hold any member of the union.
//
// Hint: Use the [T] extends [U] tuple wrapping trick.
// ------------------------------------------------------------

type ToArrayNonDist<T> = unknown; // <-- Replace `unknown`

// Tests:
type TAND_1 = ToArrayNonDist<string>;          // Expected: string[]
type TAND_2 = ToArrayNonDist<string | number>; // Expected: (string | number)[]

const tand2: TAND_2 = [1, "a", 2, "b"]; // Mixed array IS valid here


// ------------------------------------------------------------
// Challenge 7: TypeName<T> (Nested Conditional)
// ------------------------------------------------------------
// Create a nested conditional type that maps types to their
// string name:
//   - string  => "string"
//   - number  => "number"
//   - boolean => "boolean"
//   - object  => "object"   (any non-primitive, non-function)
//   - anything else => "other"
//
// Order matters! Check more specific types before general ones.
// ------------------------------------------------------------

type TypeName<T> = unknown; // <-- Replace `unknown`

// Tests:
type TN_1 = TypeName<string>;    // Expected: "string"
type TN_2 = TypeName<number>;    // Expected: "number"
type TN_3 = TypeName<boolean>;   // Expected: "boolean"
type TN_4 = TypeName<object>;    // Expected: "object"
type TN_5 = TypeName<undefined>; // Expected: "other"
type TN_6 = TypeName<null>;      // Expected: "other"

const tn1: TN_1 = "string";
const tn2: TN_2 = "number";
const tn3: TN_3 = "boolean";
const tn4: TN_4 = "object";


// ------------------------------------------------------------
// Challenge 8: ExtractParamType<T>
// ------------------------------------------------------------
// Create a conditional type that extracts the parameter type
// of a single-argument function.
// If T is not a function, or has no parameters, return `never`.
//
// Hint: Use infer to capture the parameter type.
// Example: ExtractParamType<(x: string) => void> => string
// ------------------------------------------------------------

type ExtractParamType<T> = unknown; // <-- Replace `unknown`

// Tests:
type EP_1 = ExtractParamType<(x: string) => void>;    // Expected: string
type EP_2 = ExtractParamType<(n: number) => boolean>;  // Expected: number
type EP_3 = ExtractParamType<() => void>;              // Expected: never (note: unknown also acceptable)
type EP_4 = ExtractParamType<string>;                  // Expected: never

const ep1: EP_1 = "hello";
const ep2: EP_2 = 42;


// ------------------------------------------------------------
// Challenge 9: GetReturnType<T>
// ------------------------------------------------------------
// Create a conditional type that extracts the return type of
// a function type. If T is not a function, return `never`.
//
// This is your own version of TypeScript's built-in ReturnType<T>.
// Hint: Use infer in the return position.
// ------------------------------------------------------------

type GetReturnType<T> = unknown; // <-- Replace `unknown`

// Tests:
type GR_1 = GetReturnType<() => string>;              // Expected: string
type GR_2 = GetReturnType<(x: number) => boolean>;    // Expected: boolean
type GR_3 = GetReturnType<() => void>;                // Expected: void
type GR_4 = GetReturnType<() => Promise<number>>;     // Expected: Promise<number>
type GR_5 = GetReturnType<number>;                    // Expected: never

const gr1: GR_1 = "hello";
const gr2: GR_2 = true;


// ------------------------------------------------------------
// Challenge 10: IsNever<T>
// ------------------------------------------------------------
// Create a conditional type that detects if T is the `never` type.
// Return `true` if T is never, `false` otherwise.
//
// WARNING: This is tricky! A naive approach will NOT work because
// `never` is an empty union, and distribution over an empty union
// produces `never` (not `true` or `false`).
//
// Hint: You need to prevent distribution.
// ------------------------------------------------------------

type IsNever<T> = unknown; // <-- Replace `unknown`

// Tests:
type IN_1 = IsNever<never>;     // Expected: true
type IN_2 = IsNever<string>;    // Expected: false
type IN_3 = IsNever<undefined>; // Expected: false
type IN_4 = IsNever<null>;      // Expected: false

const in1: IN_1 = true;
const in2: IN_2 = false;
