# Topic 04 - Generics Basics

## Table of Contents

1. [Why Generics?](#1-why-generics)
2. [The Progression: any to Function Overloads to Generics](#2-the-progression-any-to-function-overloads-to-generics)
3. [Generic Functions](#3-generic-functions)
4. [Generic Inference](#4-generic-inference)
5. [Multiple Type Parameters](#5-multiple-type-parameters)
6. [Generic Interfaces](#6-generic-interfaces)
7. [Generic Classes](#7-generic-classes)
8. [Default Type Parameters](#8-default-type-parameters)
9. [Generic Constraints with extends (CRITICAL)](#9-generic-constraints-with-extends-critical)
10. [The keyof Constraint Pattern (CRITICAL)](#10-the-keyof-constraint-pattern-critical)
11. [Generic Utility Functions Examples](#11-generic-utility-functions-examples)
12. [Key Takeaways](#12-key-takeaways)

---

## 1. Why Generics?

### The Core Problem: Reusability Without Losing Type Safety

In real-world applications, we constantly write functions and classes that need to work with
**multiple different types** while maintaining **type safety**. Without generics, we are forced
to choose between two bad options:

- **Option A: Use `any`** -- Works with every type, but you lose ALL type checking. TypeScript
  becomes JavaScript at that point. The compiler cannot catch mistakes.

- **Option B: Write duplicated code** -- Create separate functions for each type (`identityString`,
  `identityNumber`, etc.). This is type-safe but violates the DRY principle massively.

Generics solve this dilemma. They let you write **one piece of code** that works with **any type
the caller specifies**, while the compiler **tracks the actual type** through the entire operation.

Think of generics as **type-level parameters**. Just as a function accepts value parameters,
a generic function (or class, or interface) accepts **type parameters**.

```ts
// Value parameter:  function greet(name: string)   --> caller passes a value
// Type parameter:   function identity<T>(arg: T): T --> caller passes a type
```

---

## 2. The Progression: any to Function Overloads to Generics

### Step 1: Using `any` (Bad -- No Type Safety)

```ts
function identity(arg: any): any {
  return arg;
}

const result = identity("hello");
// result is typed as `any` -- TypeScript knows NOTHING about it
// result.toFixed(2)  --> No error at compile time, but CRASHES at runtime!
```

The function works, but the return type is `any`. TypeScript has completely lost track of the
fact that we passed in a string. This defeats the entire purpose of using TypeScript.

### Step 2: Function Overloads (Better -- But Tedious)

```ts
function identity(arg: string): string;
function identity(arg: number): number;
function identity(arg: boolean): boolean;
function identity(arg: any): any {
  return arg;
}

const result = identity("hello");
// result is typed as `string` -- Better!
```

This preserves type safety, but:
- You must manually write an overload for every type you want to support.
- What about custom types like `User`, `Product`, arrays, etc.? Impossible to cover them all.
- The maintenance burden grows with every new type.

### Step 3: Generics (Best -- Reusable AND Type-Safe)

```ts
function identity<T>(arg: T): T {
  return arg;
}

const result = identity("hello");
// result is typed as `string` -- TypeScript INFERRED T = string
// result.toFixed(2)  --> ERROR at compile time! string has no toFixed method

const num = identity(42);
// num is typed as `number`

const user = identity({ name: "Alice", age: 30 });
// user is typed as { name: string; age: number }
```

One function. Works with every type. Full type safety preserved. This is the power of generics.

---

## 3. Generic Functions

### Syntax

A generic function declares one or more **type parameters** inside angle brackets `<>` right
before the parameter list:

```ts
function functionName<T,U,V>(param: T): T {
  // T can be used as a type anywhere inside this function
  return param;
}
```

### The `T` Convention

`T` stands for "Type" and is the most common name for a single type parameter. Other common
conventions:

| Letter | Stands For   | Common Usage                          |
|--------|-------------|---------------------------------------|
| `T`    | Type        | Primary/first type parameter          |
| `U`    | (second)    | Second type parameter                 |
| `V`    | (third)     | Third type parameter                  |
| `K`    | Key         | Object key types                      |
| `V`    | Value       | Object value types                    |
| `E`    | Element     | Collection element types              |
| `R`    | Return      | Return types                          |

These are conventions, not rules. Use descriptive names for complex cases:

```ts
function transform<TInput, TOutput>(input: TInput, fn: (i: TInput) => TOutput): TOutput {
  return fn(input);
}
```

### More Examples

```ts
// Generic function that wraps a value in an array
function wrapInArray<T>(value: T): T[] {
  return [value];
}

const strings = wrapInArray("hello");  // string[]
const numbers = wrapInArray(42);       // number[]

// Generic function that returns the last element
function lastElement<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1];
}

const last = lastElement([1, 2, 3]);       // number | undefined
const lastStr = lastElement(["a", "b"]);   // string | undefined
```

---


## 4. Generic Inference

TypeScript can usually **infer** the type argument from the values you pass in. You do NOT
always need to explicitly specify the type in angle brackets.

### Implicit (Inferred) -- Preferred When Possible

```ts
function identity<T>(arg: T): T {
  return arg;
}

// TypeScript INFERS T = string from the argument "hello"
const a = identity("hello");       // T inferred as string


const b = identity(42);            // T inferred as number
const c = identity(true);          // T inferred as boolean
const d = identity([1, 2, 3]);     // T inferred as number[]
```

### Explicit -- When Inference Is Not Enough

Sometimes you need or want to be explicit:

```ts
// Case 1: You want a wider type than what would be inferred


const e = identity<string | number>("hello");  // T = string | number




// Case 2: Empty arrays -- TypeScript cannot infer the element type
const f = identity<string[]>([]);  // T = string[]

// Case 3: Disambiguation
function createPair<T>(a: T, b: T): [T, T] {
  return [a, b];
}

// This would error because TypeScript infers T = string from "a", then number doesn't match
// const pair = createPair("a", 1);  // ERROR

// Explicitly specifying fixes it
const pair = createPair<string | number>("a", 1);  // OK
```

### When Inference Happens

Inference uses the **arguments** you pass to determine type parameters:

```ts
function map<T, U>(arr: T[], fn: (item: T) => U): U[] {
  return arr.map(fn);
}

// T is inferred as number (from [1, 2, 3])
// U is inferred as string (from the return type of the callback)
const result = map([1, 2, 3], (n) => n.toString());
// result: string[]
```

---

## 5. Multiple Type Parameters

Functions, interfaces, and classes can have multiple type parameters:

```ts
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

const p1 = pair("hello", 42);       // [string, number]
const p2 = pair(true, [1, 2, 3]);   // [boolean, number[]]
```

### Practical Example: A Mapping Function

```ts
function mapValue<TInput, TOutput>(
  input: TInput,
  transform: (value: TInput) => TOutput
): TOutput {
  return transform(input);
}

const length = mapValue("hello", (s) => s.length);   // number
const upper = mapValue("hello", (s) => s.toUpperCase()); // string
const doubled = mapValue(5, (n) => n * 2);            // number
```

### Practical Example: Object Merge

```ts
function merge<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

const merged = merge(
  { name: "Alice" },
  { age: 30 }
);
// Type: { name: string } & { age: number }
// merged.name --> string
// merged.age  --> number
```

---

## 6. Generic Interfaces

Interfaces can accept type parameters, making them reusable blueprints:

### Basic Generic Interface

```ts
interface Box<T> {
  value: T;
}

const stringBox: Box<string> = { value: "hello" };
const numberBox: Box<number> = { value: 42 };
const userBox: Box<{ name: string }> = { value: { name: "Alice" } };
```

### Generic Interface with Methods

```ts
interface Repository<T> {
  getAll(): T[];
  getById(id: number): T | undefined;
  create(item: T): T;
  update(id: number, item: Partial<T>): T | undefined;
  delete(id: number): boolean;
}

interface User {
  id: number;
  name: string;
  email: string;
}

// A class could implement this interface
class UserRepository implements Repository<User> {
  private users: User[] = [];

  getAll(): User[] {
    return this.users;
  }

  getById(id: number): User | undefined {
    return this.users.find(u => u.id === id);
  }

  create(item: User): User {
    this.users.push(item);
    return item;
  }

  update(id: number, item: Partial<User>): User | undefined {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return undefined;
    this.users[index] = { ...this.users[index], ...item };
    return this.users[index];
  }

  delete(id: number): boolean {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return false;
    this.users.splice(index, 1);
    return true;
  }
}
```

### Generic Interface for Function Types

```ts
interface Transformer<TInput, TOutput> {
  (input: TInput): TOutput;
}

const stringify: Transformer<number, string> = (num) => num.toString();
const parse: Transformer<string, number> = (str) => parseInt(str, 10);
```

### Multiple Type Parameters in Interfaces

```ts
interface KeyValuePair<K, V> {
  key: K;
  value: V;
}

const entry1: KeyValuePair<string, number> = { key: "age", value: 30 };
const entry2: KeyValuePair<number, string> = { key: 1, value: "first" };
```

---

## 7. Generic Classes

Classes can be parameterized with type parameters, making them reusable containers and data
structures:

### Basic Generic Class: Stack

```ts
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  toArray(): T[] {
    return [...this.items];
  }
}

// Usage
const numberStack = new Stack<number>();
numberStack.push(10);
numberStack.push(20);
numberStack.push(30);
console.log(numberStack.pop());   // 30
console.log(numberStack.peek());  // 20

const stringStack = new Stack<string>();
stringStack.push("hello");
stringStack.push("world");
console.log(stringStack.peek());  // "world"
```

### Generic Queue Class

```ts
class Queue<T> {
  private items: T[] = [];

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  front(): T | undefined {
    return this.items[0];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }
}

const queue = new Queue<string>();
queue.enqueue("first");
queue.enqueue("second");
console.log(queue.dequeue());  // "first"
```

### Generic Class with Multiple Type Parameters

```ts
class DataStore<K, V> {
  private store = new Map<K, V>();

  set(key: K, value: V): void {
    this.store.set(key, value);
  }

  get(key: K): V | undefined {
    return this.store.get(key);
  }

  has(key: K): boolean {
    return this.store.has(key);
  }

  delete(key: K): boolean {
    return this.store.delete(key);
  }

  entries(): [K, V][] {
    return Array.from(this.store.entries());
  }
}

const cache = new DataStore<string, number>();
cache.set("score", 100);
console.log(cache.get("score"));  // 100
```

---

## 8. Default Type Parameters

Just like function parameters can have default values, type parameters can have **default types**.
If the caller does not specify a type argument, the default is used.

### Syntax

```ts
// T defaults to string if not specified
function createValue<T = string>(value: T): T {
  return value;
}

const a = createValue("hello");  // T inferred as string (from argument, not default)
const b = createValue(42);       // T inferred as number (from argument, not default)
const c = createValue<boolean>(true);  // T explicitly set to boolean
```

Note: When an argument is passed, inference from the argument takes priority over the default.
The default is mainly useful when **no inference** is possible (e.g., no arguments to infer from).

### Default Types in Interfaces

```ts
interface ApiResponse<TData = unknown, TError = string> {
  success: boolean;
  data?: TData;
  error?: TError;
}

// Uses both defaults: TData = unknown, TError = string
const response1: ApiResponse = {
  success: true,
  data: "anything",
};

// Specifies TData, uses default for TError
const response2: ApiResponse<{ name: string }> = {
  success: true,
  data: { name: "Alice" },
};

// Specifies both
const response3: ApiResponse<number[], { code: number; message: string }> = {
  success: false,
  error: { code: 404, message: "Not Found" },
};
```

### Default Types in Classes

```ts
class Container<T = string> {
  constructor(public value: T) {}

  getValue(): T {
    return this.value;
  }
}

const c1 = new Container("hello");  // Container<string> (inferred from arg)
const c2 = new Container(42);       // Container<number> (inferred from arg)
```

### Important Rule: Defaults Must Come Last

Just like optional function parameters, default type parameters must come after required ones:

```ts
// CORRECT: required first, defaults last
interface Result<T, E = Error> {
  value?: T;
  error?: E;
}

// ERROR: default before required is not allowed
// interface BadResult<T = string, U> { }  // Error!
```

---

## 9. Generic Constraints with `extends` (CRITICAL)

> **This section is critically important.** Generic constraints are the foundation of advanced
> TypeScript patterns including conditional types, mapped types, and complex type-level
> programming. Master this thoroughly before moving on.

### The Problem: Too Much Freedom

Without constraints, a type parameter `T` can be **anything**. This means you cannot safely
access any properties on it:

```ts
function getLength<T>(arg: T): number {
  return arg.length;  // ERROR! Property 'length' does not exist on type 'T'.
  // T could be `number`, which has no .length property
}
```

TypeScript is correct to reject this. If someone calls `getLength(42)`, there is no `.length`
property on a number.

### The Solution: Constrain T with `extends`

The `extends` keyword in a generic parameter means "T must be assignable to this type" or
more intuitively, "T must be **at least** this shape":

```ts
function getLength<T extends { length: number }>(arg: T): number {
  return arg.length;  // OK! TypeScript knows T has a .length property
}

getLength("hello");        // OK: string has .length
getLength([1, 2, 3]);     // OK: array has .length
getLength({ length: 10 }); // OK: object has .length

// getLength(42);          // ERROR! number does not have .length
// getLength(true);        // ERROR! boolean does not have .length
```

### How Constraints Work Conceptually

Think of `<T extends Constraint>` as a **contract**:
- The caller MUST pass a type that satisfies the constraint.
- Inside the function, you CAN use any property/method guaranteed by the constraint.
- The **actual type T** is still tracked -- it is NOT widened to the constraint type.

```ts
function getLength<T extends { length: number }>(arg: T): T {
  console.log(arg.length);  // Safe to access
  return arg;                // Returns the ORIGINAL type, not just { length: number }
}

const result = getLength("hello");
// result is typed as "hello" (string literal), NOT { length: number }
// This is the key insight: constraints restrict, but the actual type flows through
```

### Constraining to Specific Types

```ts
// T must be a string or number
function processId<T extends string | number>(id: T): T {
  console.log(`Processing ID: ${id}`);
  return id;
}

processId("abc");  // OK
processId(123);    // OK
// processId(true);  // ERROR: boolean is not string | number
```

### Constraining to Interfaces

```ts
interface HasId {
  id: number;
}

interface HasName {
  name: string;
}

// T must have at least an `id` property
function printId<T extends HasId>(item: T): void {
  console.log(`ID: ${item.id}`);
}

// T must have both `id` AND `name`
function printNamedItem<T extends HasId & HasName>(item: T): void {
  console.log(`${item.name} (ID: ${item.id})`);
}

printId({ id: 1, name: "Alice", email: "alice@test.com" });  // OK
printNamedItem({ id: 1, name: "Alice" });                     // OK
// printNamedItem({ id: 1 });  // ERROR: missing `name`
```

### Constraining with Generics in the Constraint (Nested Constraints)

```ts
// T must be an array of some type U
function firstElement<T extends any[]>(arr: T): T[0] {
  return arr[0];
}

const first = firstElement([1, 2, 3]);         // number
const firstStr = firstElement(["a", "b"]);     // string
// firstElement("hello");  // ERROR: string is not an array
```

### Constraining Class Type Parameters

```ts
interface Printable {
  print(): void;
}

class Printer<T extends Printable> {
  constructor(private item: T) {}

  printItem(): void {
    this.item.print();  // Safe: T is guaranteed to have print()
  }
}

class Document implements Printable {
  constructor(public title: string) {}
  print(): void {
    console.log(`Printing: ${this.title}`);
  }
}

const printer = new Printer(new Document("Report"));
printer.printItem();  // "Printing: Report"
```

### The Constraint vs. The Actual Type -- Critical Distinction

This is where many developers get confused. The constraint is a **minimum requirement**, not
the actual type:

```ts
function cloneAndLog<T extends { name: string }>(obj: T): T {
  console.log(obj.name);
  return { ...obj };  // Returns a copy of the FULL object, not just { name: string }
}

const user = cloneAndLog({ name: "Alice", age: 30, role: "admin" });
// user is typed as { name: string; age: number; role: string }
// NOT just { name: string }
// The constraint ensures .name exists, but T captures the FULL type
```

### Common Constraint Patterns Summary

```ts
// Must have a length property
<T extends { length: number }>

// Must be an object (not null/undefined/primitive)
<T extends object>

// Must be a function
<T extends (...args: any[]) => any>

// Must be a constructor
<T extends new (...args: any[]) => any>

// Must be a specific interface
<T extends SomeInterface>

// Must be string or number (union constraint)
<T extends string | number>

// Must be an array of something
<T extends any[]>

// Must extend another generic parameter
<T, U extends T>
```

---

## 10. The `keyof` Constraint Pattern (CRITICAL)

> **This pattern is used constantly in real-world TypeScript.** It allows you to write functions
> that safely access object properties by their keys.

### The `keyof` Operator Refresher

`keyof T` produces a **union of all property names** of type `T`:

```ts
interface Person {
  name: string;
  age: number;
  email: string;
}

type PersonKeys = keyof Person;  // "name" | "age" | "email"
```

### The `keyof` Constraint: `K extends keyof T`

This pattern says: "K must be one of the actual keys of T."

```ts
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const person = { name: "Alice", age: 30, email: "alice@test.com" };

const name = getProperty(person, "name");   // string
const age = getProperty(person, "age");     // number
const email = getProperty(person, "email"); // string

// getProperty(person, "phone");  // ERROR! "phone" is not in keyof person
```

### Breaking Down: Why This Is Powerful

1. **`T`** captures the full type of the object passed in.
2. **`K extends keyof T`** restricts valid keys to ONLY the actual properties of T.
3. **`T[K]`** as the return type means the return type matches the specific property type.

So `getProperty(person, "age")` returns `number`, not `string | number | string` (the union
of all property types). TypeScript narrows the return type based on which key you pass.

### Practical Examples

#### Safe Property Setter

```ts
function setProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]): void {
  obj[key] = value;
}

const user = { name: "Alice", age: 30 };

setProperty(user, "name", "Bob");     // OK: "Bob" is a string
setProperty(user, "age", 31);         // OK: 31 is a number
// setProperty(user, "name", 42);     // ERROR: 42 is not a string
// setProperty(user, "age", "thirty"); // ERROR: "thirty" is not a number
// setProperty(user, "phone", "123"); // ERROR: "phone" is not a key of user
```

#### Pick Properties

```ts
function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    result[key] = obj[key];
  });
  return result;
}

const person = { name: "Alice", age: 30, email: "alice@test.com" };

const nameAndAge = pick(person, ["name", "age"]);
// Type: Pick<{ name: string; age: number; email: string }, "name" | "age">
// Which simplifies to: { name: string; age: number }
```

#### Combining Multiple Constraints

```ts
// T must be an object, K must be a key of T, and the value at T[K] must be a string
function getStringProperty<T extends object, K extends keyof T>(
  obj: T,
  key: K
): T[K] {
  return obj[key];
}
```

### keyof with Index Signatures

```ts
interface StringMap {
  [key: string]: string;
}

type StringMapKeys = keyof StringMap;  // string | number
// Note: number is included because numeric keys are a subset of string keys in JS

function getValue<T extends StringMap, K extends keyof T>(map: T, key: K): T[K] {
  return map[key];
}
```

---

## 11. Generic Utility Functions Examples

Here are practical utility function patterns that demonstrate generics in action:

### identity -- The Simplest Generic Function

```ts
function identity<T>(value: T): T {
  return value;
}

// Use cases: passing values through middleware, type inference helpers
const str = identity("hello");  // string
const num = identity(42);       // number
```

### wrapInArray -- Value to Array

```ts
function wrapInArray<T>(value: T): T[] {
  return [value];
}

const arr1 = wrapInArray("hello");  // string[]
const arr2 = wrapInArray(42);       // number[]
const arr3 = wrapInArray({ x: 1 }); // { x: number }[]
```

### getProperty -- Safe Object Access

```ts
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const config = { host: "localhost", port: 3000, debug: true };
const host = getProperty(config, "host");   // string
const port = getProperty(config, "port");   // number
const debug = getProperty(config, "debug"); // boolean
```

### filterArray -- Type-Safe Filtering

```ts
function filterArray<T>(arr: T[], predicate: (item: T) => boolean): T[] {
  return arr.filter(predicate);
}

const numbers = filterArray([1, 2, 3, 4, 5], (n) => n > 3);        // number[]
const strings = filterArray(["a", "bb", "ccc"], (s) => s.length > 1); // string[]
```

### mapArray -- Type-Safe Mapping

```ts
function mapArray<T, U>(arr: T[], fn: (item: T, index: number) => U): U[] {
  return arr.map(fn);
}

const lengths = mapArray(["hello", "world"], (s) => s.length);  // number[]
const doubled = mapArray([1, 2, 3], (n) => n * 2);              // number[]
```

### findInArray -- Generic Search

```ts
function findInArray<T>(arr: T[], predicate: (item: T) => boolean): T | undefined {
  return arr.find(predicate);
}

const found = findInArray([1, 2, 3, 4], (n) => n > 2);  // number | undefined
```

### groupBy -- Generic Grouping

```ts
function groupBy<T>(arr: T[], keyFn: (item: T) => string): Record<string, T[]> {
  return arr.reduce((groups, item) => {
    const key = keyFn(item);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

interface Student {
  name: string;
  grade: string;
}

const students: Student[] = [
  { name: "Alice", grade: "A" },
  { name: "Bob", grade: "B" },
  { name: "Charlie", grade: "A" },
];

const byGrade = groupBy(students, (s) => s.grade);
// { A: [{ name: "Alice", ... }, { name: "Charlie", ... }], B: [{ name: "Bob", ... }] }
```

---

## 12. Key Takeaways

1. **Generics = Type Parameters.** They let you parameterize types the same way function
   parameters let you parameterize values.

2. **Prefer inference.** Let TypeScript infer type arguments from usage when possible.
   Only specify explicitly when needed.

3. **Constraints narrow what T can be.** Use `extends` to restrict type parameters while
   still preserving the actual passed-in type.

4. **`keyof` + constraints = safe property access.** The pattern `<T, K extends keyof T>`
   is fundamental to type-safe object manipulation.

5. **Default type parameters** work like default function parameter values. Required type
   parameters must come before defaulted ones.

6. **Generic interfaces and classes** make reusable data structures (Stack, Queue, Repository)
   that are fully type-safe.

7. **The constraint is a minimum, not the actual type.** When you write `<T extends HasId>`,
   the value of T is still the full type passed in, not just `HasId`.

### What Comes Next

With these fundamentals, you are prepared for:
- **Advanced Generic Constraints** -- conditional types, distributive conditionals, `infer`
- **Mapped Types** -- transforming object types property by property
- **Template Literal Types** -- string manipulation at the type level
- **Utility Types** -- `Partial`, `Required`, `Pick`, `Omit`, `Record`, etc. (all built with generics)

Master the constraint patterns in this topic. They are the single most important foundation
for everything that follows in advanced TypeScript.
