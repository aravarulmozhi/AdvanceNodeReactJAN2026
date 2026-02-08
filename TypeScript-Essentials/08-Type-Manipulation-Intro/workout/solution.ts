// ============================================================
// Topic 08 - Type Manipulation Intro: Solutions
// ============================================================
// Complete solutions with detailed comments explaining
// mapped types behavior.
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
// ============================================================
// How it works:
//   - `keyof T` produces the union of all keys: "id" | "name" | "email" | ...
//   - `[K in keyof T]` iterates over each key one at a time.
//   - Instead of preserving the original type T[K], we replace it with `string`.
//   - This means every property in the resulting type has the type `string`.

type Stringify<T> = {
  [K in keyof T]: string;
};

// Test:
type StringifiedUser = Stringify<User>;
// Result: { id: string; name: string; email: string; active: string; verified: string; age: string }

const testStringify: StringifiedUser = {
  id: "1",
  name: "Alice",
  email: "alice@example.com",
  active: "true",
  verified: "yes",
  age: "30",
};


// ============================================================
// Challenge 2: Nullable<T>
// ============================================================
// How it works:
//   - We iterate over every key K in T.
//   - For each key, the value type becomes `T[K] | null`.
//   - This means every property retains its original type but can ALSO be null.
//   - The `|` creates a union type: the original type OR null.

type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

// Test:
type NullableUser = Nullable<User>;
// Result: { id: number | null; name: string | null; email: string | null; ... }

const testNullable: NullableUser = {
  id: null,           // number | null  --> null is valid
  name: "Bob",        // string | null  --> string is valid
  email: null,        // string | null  --> null is valid
  active: true,       // boolean | null --> boolean is valid
  verified: null,     // boolean | null --> null is valid
  age: 25,            // number | null  --> number is valid
};


// ============================================================
// Challenge 3: MyPartial<T>
// ============================================================
// How it works:
//   - `[K in keyof T]?:` -- the `?` after the closing bracket makes each
//     property optional.
//   - `T[K]` preserves the original value type for each property.
//   - This is exactly how TypeScript's built-in Partial<T> is implemented.
//   - An optional property means the key can be missing from the object entirely,
//     or its value can be `undefined`.

type MyPartial<T> = {
  [K in keyof T]?: T[K];
};

// Test:
type PartialUser = MyPartial<User>;
// Result: { id?: number; name?: string; email?: string; active?: boolean; ... }

const testPartial1: PartialUser = {};                        // All properties omitted -- valid!
const testPartial2: PartialUser = { name: "Charlie" };       // Only name provided -- valid!
const testPartial3: PartialUser = { id: 1, active: false };  // Subset of properties -- valid!


// ============================================================
// Challenge 4: MyReadonly<T>
// ============================================================
// How it works:
//   - `readonly` before `[K in keyof T]` applies the readonly modifier
//     to every property in the resulting type.
//   - `T[K]` preserves the original value type.
//   - After applying this type, attempts to reassign any property will
//     cause a compile-time error.
//   - This is exactly how TypeScript's built-in Readonly<T> is implemented.

type MyReadonly<T> = {
  readonly [K in keyof T]: T[K];
};

// Test:
type ReadonlyUser = MyReadonly<User>;
// Result: { readonly id: number; readonly name: string; ... }

const testReadonly: ReadonlyUser = {
  id: 1,
  name: "Diana",
  email: "diana@example.com",
  active: true,
  verified: true,
  age: 28,
};
// testReadonly.name = "Eve"; // ERROR: Cannot assign to 'name' because it is a read-only property


// ============================================================
// Challenge 5: MyPick<T, K>
// ============================================================
// How it works:
//   - The generic constraint `K extends keyof T` ensures that K can only
//     be a key (or union of keys) that actually exists in T. This provides
//     compile-time safety -- you can't pick a key that doesn't exist.
//   - `[P in K]` iterates over only the keys specified in K (not all keys in T).
//   - `T[P]` looks up the original type of that key in T.
//   - The result is a new type containing only the selected properties.

type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// Test:
type UserPreview = MyPick<User, "id" | "name">;
// Result: { id: number; name: string }

const testPick: UserPreview = {
  id: 1,
  name: "Eve",
  // email: "...",  // ERROR: 'email' does not exist in type 'UserPreview'
};


// ============================================================
// Challenge 6: MyOmit<T, K>
// ============================================================
// How it works:
//   - `K extends keyof any` means K can be any valid property key
//     (string | number | symbol). This is more permissive than `keyof T`,
//     which is intentional -- Omit allows you to "omit" keys that might
//     not even exist in T (it just ignores them).
//   - `Exclude<keyof T, K>` uses the built-in conditional type:
//       Exclude<T, U> = T extends U ? never : T
//     It distributes over each member of `keyof T` and removes any
//     that are in K. For example:
//       Exclude<"id" | "name" | "email", "email"> => "id" | "name"
//   - `[P in Exclude<keyof T, K>]` iterates over the remaining keys.
//   - `T[P]` preserves the original type for each remaining key.

type MyOmit<T, K extends keyof any> = {
  [P in Exclude<keyof T, K>]: T[P];
};

// Test:
type UserWithoutEmail = MyOmit<User, "email" | "verified">;
// Result: { id: number; name: string; active: boolean; age: number }

const testOmit: UserWithoutEmail = {
  id: 1,
  name: "Frank",
  active: true,
  age: 35,
  // email: "...",     // ERROR: 'email' does not exist in this type
  // verified: true,   // ERROR: 'verified' does not exist in this type
};


// ============================================================
// Challenge 7: PrefixKeys<T>
// ============================================================
// How it works:
//   - `K in keyof T` iterates over each key of T (e.g., "name", "age").
//   - `as \`get_${string & K}\`` is a KEY REMAPPING clause. It transforms
//     the key name using a template literal type.
//   - `string & K` is an intersection that ensures K is treated as a string
//     (keyof T could theoretically include number or symbol keys; the
//     intersection filters those out).
//   - The backtick template `get_${...}` prepends "get_" to the key name.
//   - So "name" becomes "get_name", and "age" becomes "get_age".
//   - `T[K]` preserves the original value type.

type PrefixKeys<T> = {
  [K in keyof T as `get_${string & K}`]: T[K];
};

// Test:
type PrefixedUser = PrefixKeys<{ name: string; age: number }>;
// Result: { get_name: string; get_age: number }

const testPrefix: PrefixedUser = {
  get_name: "Grace",
  get_age: 40,
};


// ============================================================
// Challenge 8: RemoveBooleanProps<T>
// ============================================================
// How it works:
//   - `K in keyof T` iterates over each key.
//   - `as T[K] extends boolean ? never : K` is the key remapping clause.
//   - For each key K, we check: does the value type T[K] extend boolean?
//     - If YES (it's a boolean property), we remap the key to `never`.
//       When a key remaps to `never`, it is EXCLUDED from the result.
//     - If NO (it's not a boolean property), we keep the original key K.
//   - `T[K]` preserves the original value type for the remaining properties.
//
// Step-by-step for User:
//   id: number     --> number extends boolean? No  --> keep "id"       --> id: number
//   name: string   --> string extends boolean? No  --> keep "name"     --> name: string
//   email: string  --> string extends boolean? No  --> keep "email"    --> email: string
//   active: boolean --> boolean extends boolean? Yes --> remap to never --> EXCLUDED
//   verified: boolean --> boolean extends boolean? Yes --> remap to never --> EXCLUDED
//   age: number    --> number extends boolean? No  --> keep "age"      --> age: number

type RemoveBooleanProps<T> = {
  [K in keyof T as T[K] extends boolean ? never : K]: T[K];
};

// Test:
type NoBooleans = RemoveBooleanProps<User>;
// Result: { id: number; name: string; email: string; age: number }

const testRemoveBool: NoBooleans = {
  id: 1,
  name: "Hank",
  email: "hank@example.com",
  age: 45,
  // active: true,     // ERROR: property does not exist
  // verified: false,  // ERROR: property does not exist
};


// ============================================================
// Challenge 9: EventName (Template Literal Type)
// ============================================================
// How it works:
//   - Template literal types use backtick syntax just like JS template strings.
//   - When you embed a UNION type inside a template literal, TypeScript produces
//     the cartesian product of all combinations.
//   - EventType is "click" | "focus".
//   - `${EventType}Handler` distributes over the union:
//       `${"click"}Handler` => "clickHandler"
//       `${"focus"}Handler` => "focusHandler"
//   - The result is the union: "clickHandler" | "focusHandler"

type EventType = "click" | "focus";

type EventName = `${EventType}Handler`;

// Test:
const handler1: EventName = "clickHandler";   // Valid
const handler2: EventName = "focusHandler";   // Valid
// const handler3: EventName = "blurHandler"; // ERROR: not assignable to type EventName


// ============================================================
// Challenge 10: GenerateGetters<T>
// ============================================================
// How it works:
//   - `K in keyof T` iterates over each key of T.
//   - `as \`get${Capitalize<string & K>}\`` remaps each key:
//       "name" --> `get${Capitalize<"name">}` --> `get${"Name"}` --> "getName"
//       "age"  --> `get${Capitalize<"age">}`  --> `get${"Age"}`  --> "getAge"
//   - `Capitalize<string & K>` is an intrinsic string manipulation type that
//     uppercases the first character of the string literal type.
//   - `string & K` ensures K is treated as a string (filters out symbol/number keys).
//   - `() => T[K]` makes the value type a function that returns the original
//     property type. So getName returns string, getAge returns number.
//
// This pattern is incredibly useful for auto-generating method signatures
// from data interfaces.

type GenerateGetters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

// Test:
type UserGetters = GenerateGetters<{ name: string; age: number }>;
// Result: { getName: () => string; getAge: () => number }

const testGetters: UserGetters = {
  getName: () => "Ivy",
  getAge: () => 22,
};

console.log(testGetters.getName()); // "Ivy"
console.log(testGetters.getAge());  // 22


// ============================================================
// BONUS VERIFICATION: All tests compile without errors
// ============================================================

const verifyStringify: Stringify<{ a: number }> = { a: "hello" };
const verifyNullable: Nullable<{ a: number }> = { a: null };
const verifyPartial: MyPartial<{ a: number }> = {};
const verifyReadonly: MyReadonly<{ a: number }> = { a: 1 };
// verifyReadonly.a = 2; // ERROR: Cannot assign to 'a' because it is a read-only property
const verifyPick: MyPick<User, "id"> = { id: 1 };
const verifyOmit: MyOmit<User, "id" | "name" | "email" | "active" | "verified"> = { age: 25 };
const verifyPrefix: PrefixKeys<{ name: string }> = { get_name: "Alice" };
const verifyRemoveBool: RemoveBooleanProps<{ active: boolean; name: string }> = { name: "Alice" };
const verifyGetters: GenerateGetters<{ name: string }> = { getName: () => "Alice" };
