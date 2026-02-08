// ============================================================
// Topic 08 - Type Manipulation Intro: Challenges
// ============================================================
// Complete each challenge below. Replace `unknown` or `any`
// with your implementation. Do NOT use the built-in utility
// types unless the challenge explicitly says to.
// ============================================================

// Shared test interface used across challenges
interface User {
  id: number;
  name: string;
  email: string;
  active: boolean;
  verified: boolean;
  age: number;
}

// ============================================================
// Challenge 1: Stringify<T>
// Create a mapped type that converts ALL property types to string.
//
// Example:
//   Stringify<{ a: number; b: boolean }> => { a: string; b: string }
// ============================================================

type Stringify<T> = unknown; // TODO: Implement this

// Test:
type StringifiedUser = Stringify<User>;
// Expected: { id: string; name: string; email: string; active: string; verified: string; age: string }


// ============================================================
// Challenge 2: Nullable<T>
// Create a mapped type that makes every property T[K] | null.
//
// Example:
//   Nullable<{ a: number; b: string }> => { a: number | null; b: string | null }
// ============================================================

type Nullable<T> = unknown; // TODO: Implement this

// Test:
type NullableUser = Nullable<User>;
// Expected: { id: number | null; name: string | null; email: string | null; ... }


// ============================================================
// Challenge 3: MyPartial<T>
// Implement your own version of Partial<T>.
// All properties should become optional.
//
// Do NOT use the built-in Partial type.
// ============================================================

type MyPartial<T> = unknown; // TODO: Implement this

// Test:
type PartialUser = MyPartial<User>;
// Expected: { id?: number; name?: string; email?: string; active?: boolean; ... }


// ============================================================
// Challenge 4: MyReadonly<T>
// Implement your own version of Readonly<T>.
// All properties should become readonly.
//
// Do NOT use the built-in Readonly type.
// ============================================================

type MyReadonly<T> = unknown; // TODO: Implement this

// Test:
type ReadonlyUser = MyReadonly<User>;
// Expected: { readonly id: number; readonly name: string; ... }


// ============================================================
// Challenge 5: MyPick<T, K>
// Implement your own version of Pick<T, K>.
// The resulting type should only contain the properties
// whose keys are in K.
//
// Do NOT use the built-in Pick type.
//
// Hint: K must extend keyof T.
// ============================================================

type MyPick<T, K> = unknown; // TODO: Implement this (fix the generic constraint too)

// Test:
type UserPreview = MyPick<User, "id" | "name">;
// Expected: { id: number; name: string }


// ============================================================
// Challenge 6: MyOmit<T, K>
// Implement your own version of Omit<T, K>.
// The resulting type should contain all properties EXCEPT
// those whose keys are in K.
//
// Do NOT use the built-in Omit or Pick types.
//
// Hint: Use Exclude to filter keyof T, then map over the result.
// ============================================================

type MyOmit<T, K> = unknown; // TODO: Implement this (fix the generic constraint too)

// Test:
type UserWithoutEmail = MyOmit<User, "email" | "verified">;
// Expected: { id: number; name: string; active: boolean; age: number }


// ============================================================
// Challenge 7: PrefixKeys<T>
// Use key remapping with `as` to prefix all keys with "get_".
//
// Example:
//   PrefixKeys<{ name: string; age: number }>
//   => { get_name: string; get_age: number }
//
// Hint: Use a template literal type in the `as` clause.
//       Use `string & K` to ensure K is treated as a string.
// ============================================================

type PrefixKeys<T> = unknown; // TODO: Implement this

// Test:
type PrefixedUser = PrefixKeys<{ name: string; age: number }>;
// Expected: { get_name: string; get_age: number }


// ============================================================
// Challenge 8: RemoveBooleanProps<T>
// Use key remapping with `as` and `never` to filter OUT
// any properties whose value type is boolean.
//
// Example:
//   RemoveBooleanProps<{ id: number; active: boolean; name: string }>
//   => { id: number; name: string }
// ============================================================

type RemoveBooleanProps<T> = unknown; // TODO: Implement this

// Test:
type NoBooleans = RemoveBooleanProps<User>;
// Expected: { id: number; name: string; email: string; age: number }


// ============================================================
// Challenge 9: EventName (Template Literal Type)
// Create a template literal type that combines the events
// "click" | "focus" with the suffix "Handler".
//
// Expected result: "clickHandler" | "focusHandler"
// ============================================================

type EventType = "click" | "focus";

type EventName = unknown; // TODO: Implement this using a template literal type

// Test:
const handler1: EventName = "clickHandler";   // Should work
const handler2: EventName = "focusHandler";   // Should work
// const handler3: EventName = "blurHandler"; // Should error


// ============================================================
// Challenge 10: GenerateGetters<T>
// Create a mapped type that transforms an object type into
// getter methods.
//
// Example:
//   GenerateGetters<{ name: string; age: number }>
//   => { getName(): string; getAge(): number }
//
// Hints:
//   - Use key remapping with `as` and Capitalize
//   - Use `string & K` to ensure K is a string
//   - The value type should be a function returning T[K]
// ============================================================

type GenerateGetters<T> = unknown; // TODO: Implement this

// Test:
type UserGetters = GenerateGetters<{ name: string; age: number }>;
// Expected: { getName: () => string; getAge: () => number }


// ============================================================
// BONUS: Verify your types
// ============================================================
// Uncomment these lines after implementing to check your work.
// They should compile without errors if your types are correct.

// const testStringify: Stringify<{ a: number }> = { a: "hello" };
// const testNullable: Nullable<{ a: number }> = { a: null };
// const testPartial: MyPartial<{ a: number }> = {};
// const testReadonly: MyReadonly<{ a: number }> = { a: 1 };
// // testReadonly.a = 2; // Should error
// const testPick: MyPick<User, "id"> = { id: 1 };
// const testOmit: MyOmit<User, "id" | "name" | "email" | "active" | "verified"> = { age: 25 };
// const testPrefix: PrefixKeys<{ name: string }> = { get_name: "Alice" };
// const testRemoveBool: RemoveBooleanProps<{ active: boolean; name: string }> = { name: "Alice" };
// const testGetters: GenerateGetters<{ name: string }> = { getName: () => "Alice" };
