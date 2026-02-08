// ============================================================================
// Topic 04 - Generics Basics: Workout Solutions
// ============================================================================
// Each solution includes detailed comments explaining the generic behavior.
// ============================================================================


// ----------------------------------------------------------------------------
// Solution 1: Generic Identity Function
// ----------------------------------------------------------------------------
// The type parameter <T> captures the exact type of whatever argument is passed.
// When you call identity("hello"), TypeScript infers T = string.
// The return type T ensures the output type matches the input type exactly.
// This is more powerful than using `any` because the type relationship between
// input and output is preserved -- TypeScript TRACKS what T actually is.
// ----------------------------------------------------------------------------

function identity<T>(value: T): T {
  return value;
}

// TypeScript infers T from the argument:
const strResult = identity("hello");    // T = string, returns string
const numResult = identity(42);         // T = number, returns number
const boolResult = identity(true);      // T = boolean, returns boolean

// You can also be explicit when needed:
const explicitResult = identity<string | number>("hello");  // T = string | number

console.log("--- Challenge 1: Identity ---");
console.log(strResult, numResult, boolResult);


// ----------------------------------------------------------------------------
// Solution 2: First Element
// ----------------------------------------------------------------------------
// The type parameter <T> captures the element type of the array.
// When you pass number[], T is inferred as number.
// The return type T | undefined accounts for empty arrays.
//
// Key insight: The parameter type `T[]` tells TypeScript "this is an array
// whose elements are of type T." TypeScript then infers T from the actual
// array elements you pass in.
// ----------------------------------------------------------------------------

function firstElement<T>(arr: T[]): T | undefined {
  return arr.length > 0 ? arr[0] : undefined;
}

const first1 = firstElement([10, 20, 30]);      // T inferred as number -> number | undefined
const first2 = firstElement(["a", "b", "c"]);   // T inferred as string -> string | undefined
const first3 = firstElement([]);                 // T inferred as never  -> never | undefined = undefined

console.log("\n--- Challenge 2: First Element ---");
console.log(first1, first2, first3);


// ----------------------------------------------------------------------------
// Solution 3: Generic Pair Interface
// ----------------------------------------------------------------------------
// The interface Pair<T, U> uses TWO type parameters.
// T is the type of the `first` property, U is the type of the `second` property.
// They are independent -- each can be any type.
//
// The function makePair uses the same two type parameters. TypeScript infers
// T from the first argument and U from the second argument independently.
// The return type Pair<T, U> is explicit here for clarity, though TypeScript
// could also infer it from the return statement.
// ----------------------------------------------------------------------------

interface Pair<T, U> {
  first: T;
  second: U;
}

function makePair<T, U>(first: T, second: U): Pair<T, U> {
  return { first, second };
}

const p1: Pair<string, number> = { first: "age", second: 30 };
const p2 = makePair("hello", true);   // Pair<string, boolean> -- both inferred
const p3 = makePair(1, [2, 3]);       // Pair<number, number[]> -- both inferred

console.log("\n--- Challenge 3: Pair ---");
console.log(p1, p2, p3);


// ----------------------------------------------------------------------------
// Solution 4: Generic Stack Class
// ----------------------------------------------------------------------------
// The class Stack<T> parameterizes the element type.
// Every method that deals with elements uses T consistently.
//
// Key insight: When you call `new Stack<number>()`, T is bound to `number`
// for that specific instance. Every method on that instance then works with
// numbers. A different instance `new Stack<string>()` binds T to `string`.
//
// The private array `items: T[]` stores elements of whatever T happens to be.
// - push accepts T (not any) so only the correct type can be added.
// - pop and peek return T | undefined to handle the empty-stack case.
// ----------------------------------------------------------------------------

class Stack<T> {
  // Private array to store elements. T[] means it holds elements of type T.
  private items: T[] = [];

  // push: accepts only values of type T, ensuring type safety.
  // You cannot push a string into a Stack<number>.
  push(item: T): void {
    this.items.push(item);
  }

  // pop: removes and returns the last element.
  // Returns T | undefined because the stack might be empty.
  pop(): T | undefined {
    return this.items.pop();
  }

  // peek: returns the top element WITHOUT removing it.
  // Returns T | undefined because the stack might be empty.
  peek(): T | undefined {
    return this.items.length > 0 ? this.items[this.items.length - 1] : undefined;
  }

  // isEmpty: a simple utility -- no generic types involved here.
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  // size: returns the count of elements.
  size(): number {
    return this.items.length;
  }
}

const numStack = new Stack<number>();
numStack.push(10);
numStack.push(20);
numStack.push(30);

console.log("\n--- Challenge 4: Stack ---");
console.log("peek:", numStack.peek());      // 30
console.log("pop:", numStack.pop());        // 30
console.log("size:", numStack.size());      // 2
console.log("isEmpty:", numStack.isEmpty()); // false

const strStack = new Stack<string>();
strStack.push("a");
strStack.push("b");
console.log("string peek:", strStack.peek()); // "b"


// ----------------------------------------------------------------------------
// Solution 5: Generic Constraint -- Must Have Length
// ----------------------------------------------------------------------------
// The constraint `T extends { length: number }` means:
//   - T must be a type that has AT LEAST a `length` property of type number.
//   - strings, arrays, and objects with a length property all qualify.
//   - numbers, booleans, etc. do NOT qualify and will cause a compile error.
//
// CRITICAL INSIGHT: T is still the FULL type, not just { length: number }.
// If you pass a string, T = string (which has .length AND all other string methods).
// The constraint only restricts what can be passed; it does NOT erase the full type.
//
// This is the foundational pattern for all advanced generic constraints.
// ----------------------------------------------------------------------------

function logLength<T extends { length: number }>(arg: T): T {
  // Inside this function, we are GUARANTEED that arg has .length
  // because the constraint ensures it.
  console.log(`Length: ${arg.length}`);
  return arg;  // Return type is T, preserving the full type
}

console.log("\n--- Challenge 5: Constraint (length) ---");
const s = logLength("hello");                         // T = string, logs: Length: 5
const a = logLength([1, 2, 3]);                       // T = number[], logs: Length: 3
const o = logLength({ length: 10, name: "test" });    // T = { length: number; name: string }

// These would NOT compile (uncomment to see the errors):
// logLength(42);       // ERROR: number doesn't have .length
// logLength(true);     // ERROR: boolean doesn't have .length
// logLength(null);     // ERROR: null doesn't have .length


// ----------------------------------------------------------------------------
// Solution 6: getProperty with keyof Constraint
// ----------------------------------------------------------------------------
// This solution uses TWO type parameters that are RELATED:
//   - T: the object type
//   - K extends keyof T: K must be one of T's actual property names
//
// How it works step by step with getProperty(person, "name"):
//   1. T is inferred as { name: string; age: number; active: boolean }
//   2. keyof T becomes "name" | "age" | "active"
//   3. K is inferred as "name" (from the second argument)
//   4. "name" extends "name" | "age" | "active"? YES -- constraint satisfied
//   5. Return type T[K] = T["name"] = string
//
// If you tried getProperty(person, "phone"):
//   3. K would be "phone"
//   4. "phone" extends "name" | "age" | "active"? NO -- compile error!
//
// The return type T[K] is an "indexed access type." It looks up the type
// of property K within type T. This gives you the SPECIFIC property type,
// not a union of all property types.
// ----------------------------------------------------------------------------

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const person = { name: "Alice", age: 30, active: true };

const personName = getProperty(person, "name");      // string (T[K] = T["name"] = string)
const personAge = getProperty(person, "age");        // number (T[K] = T["age"] = number)
const personActive = getProperty(person, "active");  // boolean (T[K] = T["active"] = boolean)

console.log("\n--- Challenge 6: getProperty (keyof) ---");
console.log(personName, personAge, personActive);

// This would NOT compile:
// getProperty(person, "phone");  // ERROR: "phone" is not assignable to "name" | "age" | "active"


// ----------------------------------------------------------------------------
// Solution 7: Default Type Parameter
// ----------------------------------------------------------------------------
// The `= unknown` after T provides a DEFAULT type.
// If a user writes ApiResponse (without angle brackets), T defaults to unknown.
// If a user writes ApiResponse<string>, T is string.
//
// Key insight: When there IS an argument to infer from (like in createResponse),
// inference from the argument takes priority over the default.
// The default only applies when no inference is possible and no explicit type
// is given -- most commonly when the type is used in a type annotation
// (like `const x: ApiResponse = ...`).
// ----------------------------------------------------------------------------

interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  timestamp: number;
}

function createResponse<T>(success: boolean, data: T): ApiResponse<T> {
  return {
    success,
    data,
    timestamp: Date.now(),
  };
}

// Uses the default (T = unknown) because no type argument is specified:
const res1: ApiResponse = { success: true, data: "anything", timestamp: Date.now() };

// Explicitly specifies T = string:
const res2: ApiResponse<string> = { success: true, data: "hello", timestamp: Date.now() };

// Explicitly specifies T = number[]:
const res3: ApiResponse<number[]> = { success: true, data: [1, 2, 3], timestamp: Date.now() };

// T inferred from the `data` argument as { id: number; name: string }:
const res4 = createResponse(true, { id: 1, name: "Test" });

console.log("\n--- Challenge 7: Default Type Parameter ---");
console.log(res1.success, res2.data, res3.data, res4.data);


// ----------------------------------------------------------------------------
// Solution 8: Merge Two Objects
// ----------------------------------------------------------------------------
// Both T and U are constrained to `object`. This prevents passing primitives
// like strings or numbers which cannot be meaningfully spread.
//
// The return type `T & U` is an INTERSECTION type. It means the result has
// ALL properties from T AND all properties from U.
//
// Key insight: The spread operator `{ ...obj1, ...obj2 }` at runtime copies
// all properties. The type `T & U` reflects this at the type level.
//
// Note: If both objects have a property with the same key, the second object's
// value wins at runtime (JS spread behavior). At the type level, T & U would
// require the property to satisfy BOTH types, which could be `never` if they
// conflict (e.g., { x: string } & { x: number } means x: never).
// ----------------------------------------------------------------------------

function merge<T extends object, U extends object>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

const obj1 = { name: "Alice" };
const obj2 = { age: 30, active: true };
const merged = merge(obj1, obj2);
// Type: { name: string } & { age: number; active: boolean }

console.log("\n--- Challenge 8: Merge ---");
console.log(merged.name);    // "Alice"
console.log(merged.age);     // 30
console.log(merged.active);  // true

// Primitives would NOT compile:
// merge("hello", "world");  // ERROR: string is not assignable to object
// merge(42, true);           // ERROR: number is not assignable to object


// ----------------------------------------------------------------------------
// Solution 9: Generic Dictionary Class
// ----------------------------------------------------------------------------
// Dictionary<T> uses a string key and a generic value type T.
// Internally, we use a plain object with an index signature: { [key: string]: T }
//
// Key insights:
// - The type parameter T is used for VALUES only; keys are always strings.
// - get() returns T | undefined because the key might not exist.
// - remove() returns boolean to indicate whether the key existed.
// - Using Object.prototype.hasOwnProperty.call ensures safety with inherited props.
//
// Alternative: You could use Map<string, T> internally. We use a plain object
// here to demonstrate the index signature pattern.
// ----------------------------------------------------------------------------

class Dictionary<T> {
  // Internal storage: a plain object with string keys and values of type T.
  private store: { [key: string]: T } = {};

  // set: adds or updates a key-value pair.
  set(key: string, value: T): void {
    this.store[key] = value;
  }

  // get: retrieves the value for a given key.
  // Returns T | undefined because the key might not exist in the dictionary.
  get(key: string): T | undefined {
    return this.has(key) ? this.store[key] : undefined;
  }

  // has: checks whether a key exists in the dictionary.
  // Uses hasOwnProperty to avoid picking up properties from the prototype chain.
  has(key: string): boolean {
    return Object.prototype.hasOwnProperty.call(this.store, key);
  }

  // remove: deletes a key-value pair. Returns true if the key existed, false otherwise.
  remove(key: string): boolean {
    if (this.has(key)) {
      delete this.store[key];
      return true;
    }
    return false;
  }

  // keys: returns an array of all keys currently in the dictionary.
  keys(): string[] {
    return Object.keys(this.store);
  }

  // values: returns an array of all values, typed as T[].
  values(): T[] {
    return Object.values(this.store);
  }

  // size: returns the number of key-value pairs.
  size(): number {
    return Object.keys(this.store).length;
  }
}

console.log("\n--- Challenge 9: Dictionary ---");

const dict = new Dictionary<number>();
dict.set("apples", 5);
dict.set("bananas", 3);
dict.set("cherries", 12);
console.log("get apples:", dict.get("apples"));       // 5
console.log("has bananas:", dict.has("bananas"));      // true
console.log("has grapes:", dict.has("grapes"));        // false
console.log("size:", dict.size());                     // 3
dict.remove("bananas");
console.log("size after remove:", dict.size());        // 2
console.log("keys:", dict.keys());                     // ["apples", "cherries"]
console.log("values:", dict.values());                 // [5, 12]

const strDict = new Dictionary<string>();
strDict.set("greeting", "hello");
console.log("get greeting:", strDict.get("greeting")); // "hello"


// ----------------------------------------------------------------------------
// Solution 10: Generic Filter Function
// ----------------------------------------------------------------------------
// This manually implements array filtering using a for loop.
//
// The type parameter <T> captures the element type of the input array.
// The predicate is typed as `(item: T) => boolean` -- it receives an element
// of type T and returns true/false.
// The return type T[] ensures the output array has the same element type.
//
// Key insight: By making the predicate accept `(item: T)` instead of `(item: any)`,
// TypeScript provides full IntelliSense and type checking INSIDE the callback.
// When you call filter(products, (p) => p.price > 50), TypeScript knows that
// `p` is a Product, so `p.price` is valid and `p.nonExistent` would be an error.
// ----------------------------------------------------------------------------

function filter<T>(arr: T[], predicate: (item: T) => boolean): T[] {
  const result: T[] = [];

  // Manual iteration instead of Array.prototype.filter
  for (let i = 0; i < arr.length; i++) {
    // The predicate receives an item of type T, so full type checking applies
    if (predicate(arr[i])) {
      result.push(arr[i]);
    }
  }

  return result;
}

console.log("\n--- Challenge 10: Filter ---");

const evens = filter([1, 2, 3, 4, 5, 6], (n) => n % 2 === 0);
console.log("evens:", evens);  // [2, 4, 6]  -- type: number[]

const longStrings = filter(["hi", "hello", "hey", "howdy"], (s) => s.length > 3);
console.log("long strings:", longStrings);  // ["hello", "howdy"]  -- type: string[]

interface Product {
  name: string;
  price: number;
}

const products: Product[] = [
  { name: "Book", price: 10 },
  { name: "Phone", price: 999 },
  { name: "Pen", price: 2 },
];

const expensive = filter(products, (p) => p.price > 50);
console.log("expensive:", expensive);  // [{ name: "Phone", price: 999 }]  -- type: Product[]


// ============================================================================
// Summary of Generic Patterns Used in These Solutions
// ============================================================================
//
// 1. Basic generic function:          <T>(arg: T): T
// 2. Generic with array type:         <T>(arr: T[]): T | undefined
// 3. Multiple type parameters:        <T, U>(a: T, b: U): Pair<T, U>
// 4. Generic class:                   class Stack<T> { ... }
// 5. Constraint with extends:         <T extends { length: number }>
// 6. keyof constraint:                <T, K extends keyof T>
// 7. Default type parameter:          <T = unknown>
// 8. Object constraint + intersection: <T extends object, U extends object>: T & U
// 9. Generic class with string keys:  class Dictionary<T> { ... }
// 10. Generic with callback:          <T>(arr: T[], fn: (item: T) => boolean): T[]
//
// These 10 patterns cover the fundamental building blocks of TypeScript generics.
// All advanced generic patterns (conditional types, mapped types, infer, etc.)
// build directly on these foundations.
// ============================================================================
