# Topic 03 - Interfaces and Type Composition

## 1. Interfaces in Depth

An **interface** in TypeScript defines the shape (structure) of an object. It is a purely compile-time construct -- it produces no JavaScript output. Interfaces describe what properties and methods an object must have, along with their types.

### 1.1 Basic Declaration

```ts
interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
};
```

TypeScript enforces **exact structure** -- you cannot add extra properties directly in the literal assignment (excess property checking), and you cannot omit required ones.

### 1.2 Optional Properties

Use `?` after the property name to mark it as optional. The property may or may not exist on the object.

```ts
interface Config {
  host: string;
  port: number;
  ssl?: boolean;       // optional -- may be undefined
  timeout?: number;    // optional
}

// Valid: ssl and timeout are omitted
const config: Config = {
  host: "localhost",
  port: 3000,
};
```

When you access an optional property, its type is `T | undefined`, so you should handle that possibility.

### 1.3 Readonly Properties

Use the `readonly` modifier to prevent reassignment after the object is created.

```ts
interface Point {
  readonly x: number;
  readonly y: number;
}

const origin: Point = { x: 0, y: 0 };
// origin.x = 5;  // Error: Cannot assign to 'x' because it is a read-only property
```

`readonly` is a compile-time check only. It does not make the value immutable at runtime -- it prevents reassignment through the typed reference.

```ts
interface Document {
  readonly id: string;
  readonly tags: string[];  // the array reference is readonly, but contents are mutable
}

const doc: Document = { id: "abc", tags: ["ts", "js"] };
// doc.tags = ["new"];   // Error -- cannot reassign
doc.tags.push("node");   // Allowed -- mutating the array contents
```

To make the array itself immutable, use `ReadonlyArray<string>` or `readonly string[]`.

---

## 2. Extending Interfaces

### 2.1 Single Inheritance

An interface can extend another interface using the `extends` keyword. The child interface inherits all properties from the parent and can add new ones.

```ts
interface Shape {
  color: string;
}

interface Circle extends Shape {
  radius: number;
}

const circle: Circle = {
  color: "red",
  radius: 10,
};
```

### 2.2 Multiple Inheritance

Unlike classes (which support single inheritance in most OOP languages), interfaces can extend **multiple** interfaces at once.

```ts
interface Printable {
  print(): void;
}

interface Loggable {
  log(message: string): void;
}

interface Reporter extends Printable, Loggable {
  reportId: number;
}

const reporter: Reporter = {
  reportId: 42,
  print() {
    console.log("Printing report...");
  },
  log(message: string) {
    console.log(`[LOG]: ${message}`);
  },
};
```

### 2.3 Overriding Properties in Extensions

A child interface can narrow (make more specific) a property type from the parent, but it cannot widen it.

```ts
interface Base {
  value: string | number;
}

interface Derived extends Base {
  value: string;  // OK -- string is narrower than string | number
}

// interface Invalid extends Base {
//   value: boolean;  // Error -- boolean is not assignable to string | number
// }
```

---

## 3. Interface vs Type Alias

Both `interface` and `type` can describe object shapes, but they have key differences.

### 3.1 Similarities

```ts
// Interface approach
interface UserI {
  id: number;
  name: string;
}

// Type alias approach
type UserT = {
  id: number;
  name: string;
};

// Both work the same way for object shapes:
const u1: UserI = { id: 1, name: "Alice" };
const u2: UserT = { id: 2, name: "Bob" };
```

### 3.2 Key Differences

| Feature                    | `interface`               | `type`                        |
|----------------------------|---------------------------|-------------------------------|
| Declaration merging        | Yes                       | No                            |
| Extends / inheritance      | `extends` keyword         | Intersection (`&`)            |
| Primitives, unions, tuples | Cannot represent          | Can represent                 |
| Computed properties        | No                        | Yes (mapped types)            |
| `implements` (classes)     | Yes                       | Yes (with object-like types)  |
| Error messages             | Often show interface name | May expand inline             |

### 3.3 When to Use Which

**Use `interface` when:**
- Defining object shapes, especially public API contracts
- You want declaration merging (e.g., extending third-party types)
- Defining shapes that classes will `implements`

**Use `type` when:**
- You need unions, tuples, or primitive aliases
- You need mapped types or conditional types
- You want a type that is computed from other types
- You need intersection combinations that are not simple extension

### 3.4 Declaration Merging (Interface Only)

```ts
// TypeScript merges these two declarations into a single interface
interface Window {
  title: string;
}

interface Window {
  appVersion: number;
}

// Resulting interface has BOTH properties:
// interface Window {
//   title: string;
//   appVersion: number;
// }
```

**Type aliases cannot merge.** Declaring the same `type` name twice is a compile error:

```ts
type Point = { x: number };
// type Point = { y: number };  // Error: Duplicate identifier 'Point'
```

---

## 4. Intersection Types (`&`)

An intersection type combines multiple types into one. The resulting type has **all** properties from every constituent type.

### 4.1 Basic Intersection

```ts
type HasName = {
  name: string;
};

type HasAge = {
  age: number;
};

type Person = HasName & HasAge;

const person: Person = {
  name: "Alice",
  age: 30,
};
// person must have BOTH name AND age
```

### 4.2 Intersection with Interfaces

Intersections work with interfaces too:

```ts
interface Credentials {
  username: string;
  password: string;
}

interface Profile {
  displayName: string;
  avatar: string;
}

type AuthenticatedUser = Credentials & Profile;

const authUser: AuthenticatedUser = {
  username: "alice",
  password: "secret",
  displayName: "Alice W.",
  avatar: "https://example.com/alice.png",
};
```

### 4.3 Conflicting Properties in Intersections

If two types in an intersection have the same property with incompatible types, the property becomes `never` (impossible to satisfy):

```ts
type A = { value: string };
type B = { value: number };
type AB = A & B;

// AB has { value: string & number } which is { value: never }
// You cannot create a valid AB object
```

---

## 5. Interface for Function Shapes

Interfaces can describe the shape of a function (a **callable signature**).

### 5.1 Call Signature

```ts
interface StringFormatter {
  (input: string, uppercase: boolean): string;
}

const formatter: StringFormatter = (input, uppercase) => {
  return uppercase ? input.toUpperCase() : input.toLowerCase();
};

console.log(formatter("Hello", true));  // "HELLO"
```

### 5.2 Construct Signature

You can also describe constructor functions:

```ts
interface ClockConstructor {
  new (hour: number, minute: number): ClockInstance;
}

interface ClockInstance {
  tick(): void;
}
```

### 5.3 Equivalent Type Alias

```ts
type StringFormatter = (input: string, uppercase: boolean) => string;
```

Both the interface and type alias versions accomplish the same goal. The interface form allows you to also attach properties to the function (see Hybrid Types below).

---

## 6. Interface for Class Contracts (`implements`)

Interfaces can serve as contracts that classes must fulfill.

### 6.1 Basic implements

```ts
interface Serializable {
  serialize(): string;
}

class UserModel implements Serializable {
  constructor(public id: number, public name: string) {}

  serialize(): string {
    return JSON.stringify({ id: this.id, name: this.name });
  }
}
```

The class **must** provide implementations for all properties and methods declared in the interface. If it does not, TypeScript reports a compile error.

### 6.2 Implementing Multiple Interfaces

```ts
interface Printable {
  print(): void;
}

interface Storable {
  save(): Promise<void>;
}

class Invoice implements Printable, Storable {
  print(): void {
    console.log("Printing invoice...");
  }

  async save(): Promise<void> {
    console.log("Saving invoice...");
  }
}
```

### 6.3 Important: `implements` Does NOT Change the Type

The `implements` clause only checks that the class satisfies the interface. It does **not** add types to the class. You still need to declare the properties and methods in the class body.

```ts
interface Checkable {
  check(value: string): boolean;
}

class NameChecker implements Checkable {
  // You MUST declare check() here -- implements doesn't auto-add it
  check(value: string): boolean {
    return value.length > 0;
  }
}
```

---

## 7. Declaration Merging with Interfaces

When you declare an interface with the same name more than once in the same scope, TypeScript **merges** them into a single definition.

### 7.1 Basic Merging

```ts
interface Box {
  height: number;
  width: number;
}

interface Box {
  depth: number;
}

// Merged result:
// interface Box {
//   height: number;
//   width: number;
//   depth: number;
// }

const box: Box = {
  height: 10,
  width: 20,
  depth: 30,
};
```

### 7.2 Practical Use: Augmenting Third-Party Types

Declaration merging is commonly used to extend types from libraries:

```ts
// Augment Express Request to include a custom 'user' property
declare namespace Express {
  interface Request {
    user?: {
      id: string;
      role: string;
    };
  }
}
```

### 7.3 Merging Rules

- Non-function members must be unique or have identical types. If two declarations have the same property name with different types, TypeScript reports an error.
- Function members with the same name are treated as overloads. Later declarations have higher priority.

```ts
interface Cloner {
  clone(animal: Dog): Dog;
}

interface Cloner {
  clone(animal: Cat): Cat;
}

// Merged:
// interface Cloner {
//   clone(animal: Cat): Cat;    // from later declaration -- higher priority
//   clone(animal: Dog): Dog;
// }
```

---

## 8. Type Composition Patterns

Type composition means **building complex types from simpler ones**. This is one of the most powerful features of TypeScript's type system.

### 8.1 Building Blocks Pattern

Start with small, focused types and compose them into larger structures:

```ts
// Small building blocks
type Timestamped = {
  createdAt: Date;
  updatedAt: Date;
};

type SoftDeletable = {
  deletedAt: Date | null;
  isDeleted: boolean;
};

type Identifiable = {
  id: string;
};

// Compose into a full entity
type BaseEntity = Identifiable & Timestamped & SoftDeletable;

// Extend further for specific entities
type UserEntity = BaseEntity & {
  name: string;
  email: string;
};

type PostEntity = BaseEntity & {
  title: string;
  content: string;
  authorId: string;
};
```

### 8.2 Pick and Omit for Reshaping

Use built-in utility types to derive new types:

```ts
interface FullUser {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

// Only pick certain fields
type PublicUser = Pick<FullUser, "id" | "name" | "email">;

// Omit sensitive fields
type SafeUser = Omit<FullUser, "password">;

// Create a "create" DTO by omitting auto-generated fields
type CreateUserDTO = Omit<FullUser, "id" | "createdAt">;
```

### 8.3 Mixin Pattern with Intersections

```ts
type WithTimestamps<T> = T & {
  createdAt: Date;
  updatedAt: Date;
};

type WithId<T> = T & {
  id: string;
};

type Product = {
  name: string;
  price: number;
};

// Apply mixins
type ProductEntity = WithId<WithTimestamps<Product>>;

// Equivalent to:
// {
//   id: string;
//   createdAt: Date;
//   updatedAt: Date;
//   name: string;
//   price: number;
// }
```

---

## 9. Extending Types with Intersection

While interfaces use `extends`, type aliases use `&` (intersection) for a similar effect.

### 9.1 Interface Extension vs Type Intersection

```ts
// Interface approach
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

// Type alias approach (equivalent)
type AnimalT = {
  name: string;
};

type DogT = AnimalT & {
  breed: string;
};
```

### 9.2 Mixing Interfaces and Type Aliases

You can freely mix them:

```ts
interface HasEmail {
  email: string;
}

type HasPhone = {
  phone: string;
};

// Interface extending a type alias
interface ContactFromInterface extends HasEmail {
  name: string;
}

// Type using intersection with an interface
type ContactFromType = HasEmail & HasPhone & {
  name: string;
};
```

### 9.3 Key Behavioral Difference

With `extends`, conflicting property types cause an **immediate error** at the declaration:

```ts
interface Parent {
  value: string;
}

// interface Child extends Parent {
//   value: number;  // Error: Type 'number' is not assignable to type 'string'
// }
```

With `&`, conflicting properties silently produce `never`:

```ts
type ParentT = { value: string };
type ChildT = ParentT & { value: number };
// ChildT["value"] is string & number = never
// No error at declaration, but impossible to use
```

---

## 10. Hybrid Types

A **hybrid type** is an object that acts as both a function (callable) and has additional properties. This pattern is common in JavaScript libraries.

### 10.1 Basic Hybrid Type

```ts
interface Counter {
  (start: number): number;   // callable signature
  interval: number;          // property
  reset(): void;             // method
}

function createCounter(): Counter {
  const counter = function (start: number): number {
    return start + counter.interval;
  } as Counter;

  counter.interval = 1;
  counter.reset = function () {
    counter.interval = 1;
  };

  return counter;
}

const myCounter = createCounter();
console.log(myCounter(10));     // 11
myCounter.interval = 5;
console.log(myCounter(10));     // 15
myCounter.reset();
console.log(myCounter(10));     // 11
```

### 10.2 Real-World Example: Axios-like API

```ts
interface HttpClient {
  (url: string, config?: RequestConfig): Promise<Response>;
  get(url: string): Promise<Response>;
  post(url: string, data: unknown): Promise<Response>;
  defaults: RequestConfig;
}
```

### 10.3 Hybrid Type with Type Alias

```ts
type Logger = {
  (message: string): void;
  level: "debug" | "info" | "warn" | "error";
  history: string[];
};
```

---

## Summary

| Concept                     | Key Takeaway                                                |
|-----------------------------|-------------------------------------------------------------|
| Interface basics            | Describe object shapes with optional and readonly support   |
| Extending interfaces        | `extends` for single and multiple inheritance               |
| Interface vs Type           | Interface for objects/contracts; type for unions/computation |
| Declaration merging         | Same-name interfaces merge; type aliases cannot merge       |
| Intersection types (`&`)    | Combine multiple types -- result must satisfy ALL types     |
| Function interfaces         | Callable signature inside an interface                      |
| Class contracts             | `implements` enforces class structure against interface      |
| Type composition            | Build complex types from small, reusable building blocks    |
| Hybrid types                | Objects that are both callable and have properties           |
