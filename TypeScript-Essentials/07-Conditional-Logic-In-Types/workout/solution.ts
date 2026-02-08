// ============================================================
// Topic 07 - Conditional Logic in Types: Solutions
// ============================================================
// Each solution includes detailed comments explaining
// how conditional types, distribution, and infer work.
//
// Run this file with: npx tsc --noEmit solution.ts
// All type errors marked with @ts-expect-error should remain
// as errors. All valid assignments should compile cleanly.
// ============================================================


// ------------------------------------------------------------
// Solution 1: IsString<T>
// ------------------------------------------------------------
// The simplest conditional type pattern:
//   T extends string ? true : false
//
// How it works:
// - TypeScript checks whether T is assignable to `string`.
// - If yes (e.g., string, "hello", template literal types),
//   the type resolves to the literal type `true`.
// - If no (e.g., number, boolean, object), it resolves to `false`.
//
// Note: string literal types like "hello" ARE assignable to
// string, so IsString<"hello"> => true.
// ------------------------------------------------------------

type IsString<T> = T extends string ? true : false;

// Tests:
type IsString_1 = IsString<string>;     // true
type IsString_2 = IsString<"hello">;    // true -- "hello" extends string
type IsString_3 = IsString<number>;     // false
type IsString_4 = IsString<boolean>;    // false

const isStr1: IsString_1 = true;
const isStr3: IsString_3 = false;


// ------------------------------------------------------------
// Solution 2: IsArray<T>
// ------------------------------------------------------------
// We check if T extends any[] (or equivalently Array<any>).
//
// Why `any[]` and not `unknown[]`?
// - `any[]` is more permissive. If we used `unknown[]`, then
//   readonly arrays or certain edge cases might not match.
// - `any[]` matches string[], number[], tuples, etc.
//
// Tuples like [1, 2, 3] are subtypes of arrays, so they also
// extend any[] and return true.
// ------------------------------------------------------------

type IsArray<T> = T extends any[] ? true : false;

// Tests:
type IsArray_1 = IsArray<string[]>;       // true
type IsArray_2 = IsArray<number[]>;       // true
type IsArray_3 = IsArray<[1, 2, 3]>;     // true -- tuples extend any[]
type IsArray_4 = IsArray<string>;         // false
type IsArray_5 = IsArray<{ length: 5 }>; // false -- having .length isn't enough

const isArr1: IsArray_1 = true;
const isArr4: IsArray_4 = false;


// ------------------------------------------------------------
// Solution 3: MyNonNullable<T>
// ------------------------------------------------------------
// This is a classic conditional type that filters out null
// and undefined from a union type.
//
// How it works with unions (distributive behavior):
// Given T = string | null | undefined:
//   - string    extends null | undefined ? never : string    => string
//   - null      extends null | undefined ? never : null      => never
//   - undefined extends null | undefined ? never : undefined => never
//   - Union result: string | never | never => string
//
// The key insight: `never` disappears from unions.
// So returning `never` for unwanted members effectively
// filters them out.
// ------------------------------------------------------------

type MyNonNullable<T> = T extends null | undefined ? never : T;

// Tests:
type MNN_1 = MyNonNullable<string | null>;             // string
type MNN_2 = MyNonNullable<number | undefined>;        // number
type MNN_3 = MyNonNullable<string | null | undefined>; // string
type MNN_4 = MyNonNullable<null | undefined>;          // never

const mnn1: MNN_1 = "hello";
const mnn2: MNN_2 = 42;

// @ts-expect-error -- null should be excluded
const mnn1_err: MNN_1 = null;


// ------------------------------------------------------------
// Solution 4: Flatten<T>
// ------------------------------------------------------------
// This type extracts the element type from an array, or
// returns T unchanged if it's not an array.
//
// We use `infer U` to capture the element type:
//   T extends (infer U)[]
//
// `infer U` tells TypeScript: "If T matches the pattern of
// an array, figure out what type the elements are and call
// that type U."
//
// For T = string[]:
//   string[] extends (infer U)[] ? yes, U = string => string
//
// For T = boolean[][]:
//   boolean[][] extends (infer U)[] ? yes, U = boolean[] => boolean[]
//   (Only unwraps one level -- boolean[][] is an array of boolean[])
//
// For T = string:
//   string extends (infer U)[] ? no => string
// ------------------------------------------------------------

type Flatten<T> = T extends (infer U)[] ? U : T;

// Tests:
type Flat_1 = Flatten<string[]>;     // string
type Flat_2 = Flatten<number[]>;     // number
type Flat_3 = Flatten<boolean[][]>;  // boolean[] -- only peels one layer
type Flat_4 = Flatten<string>;       // string -- not an array, returned as-is
type Flat_5 = Flatten<42>;           // 42

const flat1: Flat_1 = "hello";
const flat3: Flat_3 = [true, false];
const flat4: Flat_4 = "world";


// ------------------------------------------------------------
// Solution 5: Distributive Behavior with ToArray<T>
// ------------------------------------------------------------
// The key to understanding distribution:
//
// When T is a NAKED type parameter (not wrapped in anything)
// and the input is a union, TypeScript applies the conditional
// to EACH member of the union separately, then unions the results.
//
// T = string | number:
//   1. string extends any ? string[] : never  => string[]
//   2. number extends any ? number[] : never  => number[]
//   3. Result: string[] | number[]
//
// The condition `T extends any` is always true (everything
// extends any), so this effectively just wraps each union
// member in an array.
//
// IMPORTANT: The result is string[] | number[], which means
// "either a string array OR a number array" -- NOT a mixed array!
// A mixed array like [1, "a"] doesn't satisfy either type.
// ------------------------------------------------------------

type ToArray<T> = T extends any ? T[] : never;

// Tests:
type TA_1 = ToArray<string>;           // string[]
type TA_2 = ToArray<number>;           // number[]
type TA_3 = ToArray<string | number>;  // string[] | number[]

const ta1: TA_1 = ["a", "b"];
const ta3: TA_3 = [1, 2, 3];          // number[] -- valid
const ta3b: TA_3 = ["a", "b"];        // string[] -- also valid

// @ts-expect-error -- mixed array is NOT valid for string[] | number[]
const ta3_err: TA_3 = [1, "a"];


// ------------------------------------------------------------
// Solution 6: Preventing Distribution with ToArrayNonDist<T>
// ------------------------------------------------------------
// To prevent distribution, we wrap T in a tuple on BOTH sides
// of the extends clause:
//   [T] extends [any] ? T[] : never
//
// Why both sides?
// - Wrapping only the left side: [T] extends any -- still naked on right
// - Must wrap both: [T] extends [any]
//
// Now TypeScript sees a tuple type, not a naked type parameter,
// so it does NOT distribute.
//
// For T = string | number:
//   [string | number] extends [any] ? (string | number)[] : never
//   => (string | number)[]
//
// The result is (string | number)[], which means a single array
// type that can hold both strings and numbers. Mixed arrays
// like [1, "a"] are now valid.
// ------------------------------------------------------------

type ToArrayNonDist<T> = [T] extends [any] ? T[] : never;

// Tests:
type TAND_1 = ToArrayNonDist<string>;          // string[]
type TAND_2 = ToArrayNonDist<string | number>; // (string | number)[]

const tand2: TAND_2 = [1, "a", 2, "b"]; // Mixed array IS valid


// ------------------------------------------------------------
// Solution 7: TypeName<T> (Nested Conditional)
// ------------------------------------------------------------
// Nested conditional types work like chained ternaries in
// JavaScript. TypeScript evaluates each condition in order
// and returns the first match.
//
// The evaluation for TypeName<boolean>:
//   1. boolean extends string?  No.
//   2. boolean extends number?  No.
//   3. boolean extends boolean? Yes! => "boolean"
//
// Order matters here because of type compatibility:
// - `boolean` extends `object`? No (boolean is a primitive).
// - But `Function` extends `object`? Yes! So we need to check
//   function before object if we wanted a "function" branch.
//
// For this challenge, we keep it to the four requested branches
// plus a catch-all "other".
//
// Note on distribution: If T is a union like string | number,
// each member is processed independently:
//   TypeName<string | number> => "string" | "number"
// ------------------------------------------------------------

type TypeName<T> =
  T extends string ? "string" :
  T extends number ? "number" :
  T extends boolean ? "boolean" :
  T extends object ? "object" :
  "other";

// Tests:
type TN_1 = TypeName<string>;    // "string"
type TN_2 = TypeName<number>;    // "number"
type TN_3 = TypeName<boolean>;   // "boolean"
type TN_4 = TypeName<object>;    // "object"
type TN_5 = TypeName<undefined>; // "other" -- undefined is not any of the above
type TN_6 = TypeName<null>;      // "other" -- null is not any of the above

const tn1: TN_1 = "string";
const tn2: TN_2 = "number";
const tn3: TN_3 = "boolean";
const tn4: TN_4 = "object";


// ------------------------------------------------------------
// Solution 8: ExtractParamType<T>
// ------------------------------------------------------------
// We use `infer` to capture the first parameter's type.
//
// Pattern: T extends (param: infer P, ...rest: any[]) => any
//
// This reads as: "Does T look like a function with at least
// one parameter? If so, capture the first parameter's type as P."
//
// For T = (x: string) => void:
//   Matches the pattern, P = string => string
//
// For T = () => void:
//   The function has no parameters, so it does NOT match
//   the pattern (param: infer P, ...rest: any[]) => any
//   because that pattern requires at least one parameter.
//   Falls to the false branch => never
//
// For T = string:
//   Not a function at all, doesn't match => never
//
// Alternative approach that also works:
//   type ExtractParamType<T> = T extends (arg: infer P) => any ? P : never;
// But this would only match single-argument functions.
// The ...rest approach matches functions with 1+ parameters.
// ------------------------------------------------------------

type ExtractParamType<T> = T extends (param: infer P, ...rest: any[]) => any ? P : never;

// Tests:
type EP_1 = ExtractParamType<(x: string) => void>;    // string
type EP_2 = ExtractParamType<(n: number) => boolean>;  // number
type EP_3 = ExtractParamType<() => void>;              // never
type EP_4 = ExtractParamType<string>;                  // never

const ep1: EP_1 = "hello";
const ep2: EP_2 = 42;


// ------------------------------------------------------------
// Solution 9: GetReturnType<T>
// ------------------------------------------------------------
// Similar to ExtractParamType, but we capture the return type.
//
// Pattern: T extends (...args: any[]) => infer R
//
// (...args: any[]) matches any function signature regardless
// of the number or types of parameters.
//
// `infer R` captures whatever type appears in the return
// position.
//
// For T = () => string:
//   Matches, R = string => string
//
// For T = (x: number) => boolean:
//   Matches, R = boolean => boolean
//
// For T = () => void:
//   Matches, R = void => void
//
// For T = () => Promise<number>:
//   Matches, R = Promise<number> => Promise<number>
//   (infer captures the entire return type, not just the
//   Promise's inner type)
//
// For T = number:
//   number is not a function, doesn't match => never
//
// This is essentially how TypeScript's built-in ReturnType<T>
// utility type is implemented.
// ------------------------------------------------------------

type GetReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// Tests:
type GR_1 = GetReturnType<() => string>;              // string
type GR_2 = GetReturnType<(x: number) => boolean>;    // boolean
type GR_3 = GetReturnType<() => void>;                // void
type GR_4 = GetReturnType<() => Promise<number>>;     // Promise<number>
type GR_5 = GetReturnType<number>;                    // never

const gr1: GR_1 = "hello";
const gr2: GR_2 = true;


// ------------------------------------------------------------
// Solution 10: IsNever<T>
// ------------------------------------------------------------
// This is one of the trickiest conditional type problems!
//
// NAIVE APPROACH (BROKEN):
//   type IsNever<T> = T extends never ? true : false;
//
// Why it fails:
// - `never` is the "bottom type" -- it's an empty union.
// - When TypeScript sees a conditional type with a naked T
//   and T is a union, it distributes over each member.
// - An empty union has ZERO members, so the conditional type
//   is applied to ZERO members.
// - The result of distributing over zero members is `never`.
// - So IsNever<never> => never (NOT true!)
//
// CORRECT APPROACH:
//   type IsNever<T> = [T] extends [never] ? true : false;
//
// By wrapping T in a tuple [T], we prevent distribution.
// Now TypeScript evaluates [never] extends [never], which
// is a straightforward assignability check:
//   - [never] extends [never]? Yes! => true
//
// For non-never types:
//   - IsNever<string> => [string] extends [never]? No. => false
//   - IsNever<undefined> => [undefined] extends [never]? No. => false
//
// KEY LESSON: Whenever you need to detect `never`, you MUST
// prevent distribution by wrapping in tuples. This is a
// well-known TypeScript pattern.
// ------------------------------------------------------------

type IsNever<T> = [T] extends [never] ? true : false;

// Tests:
type IN_1 = IsNever<never>;     // true
type IN_2 = IsNever<string>;    // false
type IN_3 = IsNever<undefined>; // false
type IN_4 = IsNever<null>;      // false

const in1: IN_1 = true;
const in2: IN_2 = false;


// ============================================================
// BONUS: Summary of Key Concepts
// ============================================================
//
// 1. CONDITIONAL TYPE SYNTAX:
//    T extends U ? TrueType : FalseType
//
// 2. DISTRIBUTION:
//    - Happens automatically when T is a naked type parameter
//      and a union is passed.
//    - Each union member is processed individually.
//    - Results are collected into a new union.
//
// 3. PREVENTING DISTRIBUTION:
//    - Wrap both sides: [T] extends [U] ? X : Y
//    - This checks the union as a whole, not each member.
//
// 4. INFER KEYWORD:
//    - Declares a type variable that TypeScript fills by
//      pattern-matching.
//    - Only usable inside the `extends` clause of a
//      conditional type.
//    - The inferred variable is available in the true branch.
//
// 5. NEVER AS A FILTER:
//    - `never` disappears from unions.
//    - Return `never` for unwanted union members to filter them.
//    - Detecting `never` itself requires preventing distribution.
//
// 6. NESTED CONDITIONALS:
//    - Chain multiple extends clauses for multi-branch logic.
//    - Evaluated top-to-bottom like chained ternaries.
//    - Order matters for overlapping types.
// ============================================================
