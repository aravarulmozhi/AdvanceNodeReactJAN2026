# Topic 08 - Type Manipulation Intro

## Overview

TypeScript's type system goes far beyond simple annotations. With **mapped types**,
**template literal types**, and **built-in utility types**, you can transform and
derive new types from existing ones -- keeping your codebase DRY and type-safe.

---

## 1. Mapped Types

Mapped types let you create new types by iterating over the keys of an existing type
and transforming each property.

### Basic Syntax

```ts
type MappedType<T> = {
  [K in keyof T]: NewType;
};
```

- `keyof T` produces a union of all property names in `T`.
- `K in keyof T` iterates over each key.
- You define what the new value type should be for each key.

### Example: Identity Mapped Type

```ts
type Identity<T> = {
  [K in keyof T]: T[K];
};

interface User {
  name: string;
  age: number;
  active: boolean;
}

type UserCopy = Identity<User>;
// Result: { name: string; age: number; active: boolean }
```

This simply recreates the same type -- not useful on its own, but it is the
foundation for everything that follows.

---

## 2. Basic Mapped Type Transformations

### Making All Properties Optional

```ts
type MakeOptional<T> = {
  [K in keyof T]?: T[K];
};

interface Config {
  host: string;
  port: number;
  debug: boolean;
}

type PartialConfig = MakeOptional<Config>;
// Result: { host?: string; port?: number; debug?: boolean }
```

The `?` modifier after `]` makes every property optional.

### Making All Properties Readonly

```ts
type MakeReadonly<T> = {
  readonly [K in keyof T]: T[K];
};

type ReadonlyConfig = MakeReadonly<Config>;
// Result: { readonly host: string; readonly port: number; readonly debug: boolean }

const config: ReadonlyConfig = { host: "localhost", port: 3000, debug: true };
// config.host = "other"; // Error: Cannot assign to 'host' because it is a read-only property
```

The `readonly` modifier before `[K` prevents reassignment.

### Making All Properties a Specific Type

```ts
type AllBoolean<T> = {
  [K in keyof T]: boolean;
};

type ConfigFlags = AllBoolean<Config>;
// Result: { host: boolean; port: boolean; debug: boolean }
```

You can replace every property's type with any type you want.

### Removing Modifiers with `-`

```ts
type RemoveOptional<T> = {
  [K in keyof T]-?: T[K];
};

type RemoveReadonly<T> = {
  -readonly [K in keyof T]: T[K];
};
```

The `-?` removes optionality; `-readonly` removes the readonly modifier.

---

## 3. Key Remapping with `as`

TypeScript 4.1 introduced the `as` clause in mapped types, allowing you to
transform the keys themselves.

### Syntax

```ts
type RemappedType<T> = {
  [K in keyof T as NewKey]: T[K];
};
```

### Prefixing Keys with Getter Names

```ts
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

interface Person {
  name: string;
  age: number;
}

type PersonGetters = Getters<Person>;
// Result: { getName: () => string; getAge: () => number }
```

- `string & K` ensures `K` is treated as a string (excludes symbol/number keys).
- `Capitalize<...>` uppercases the first letter.
- The backtick template literal builds the new key name.

### Filtering Keys with `as` and `never`

When a key remaps to `never`, it is excluded from the resulting type.

```ts
type RemoveBooleanProperties<T> = {
  [K in keyof T as T[K] extends boolean ? never : K]: T[K];
};

interface Mixed {
  id: number;
  name: string;
  active: boolean;
  verified: boolean;
}

type WithoutBooleans = RemoveBooleanProperties<Mixed>;
// Result: { id: number; name: string }
```

This is powerful for selectively including or excluding properties based on
their value types.

### Filtering to Keep Only Certain Types

```ts
type OnlyStrings<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};

type StringProps = OnlyStrings<Mixed>;
// Result: { name: string }
```

---

## 4. Built-in Utility Types (and Their Internal Implementations)

TypeScript ships many utility types. Understanding how they work internally
deepens your mastery of mapped and conditional types.

### Partial<T>

Makes all properties optional.

```ts
// Internal implementation:
type Partial<T> = {
  [K in keyof T]?: T[K];
};

// Usage:
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>): Todo {
  return { ...todo, ...fieldsToUpdate };
}

const updated = updateTodo(
  { title: "Learn TS", description: "Study mapped types", completed: false },
  { completed: true }
);
```

### Required<T>

Makes all properties required (removes optional modifiers).

```ts
// Internal implementation:
type Required<T> = {
  [K in keyof T]-?: T[K];
};

// Usage:
interface Props {
  name?: string;
  age?: number;
}

type RequiredProps = Required<Props>;
// Result: { name: string; age: number }
```

### Readonly<T>

Makes all properties readonly.

```ts
// Internal implementation:
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

// Usage:
interface Mutable {
  x: number;
  y: number;
}

const point: Readonly<Mutable> = { x: 10, y: 20 };
// point.x = 5; // Error!
```

### Pick<T, K>

Creates a type by picking a set of properties `K` from `T`.

```ts
// Internal implementation:
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// Usage:
interface Article {
  title: string;
  body: string;
  author: string;
  createdAt: Date;
}

type ArticlePreview = Pick<Article, "title" | "author">;
// Result: { title: string; author: string }
```

### Omit<T, K>

Creates a type by removing properties `K` from `T`.

```ts
// Internal implementation:
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

// Usage:
type ArticleWithoutDates = Omit<Article, "createdAt">;
// Result: { title: string; body: string; author: string }
```

`Omit` uses `Exclude` to filter out the unwanted keys, then `Pick` to
select the remaining ones.

### Record<K, T>

Constructs a type with a set of properties `K` of type `T`.

```ts
// Internal implementation:
type Record<K extends keyof any, T> = {
  [P in K]: T;
};

// Usage:
type PageInfo = { title: string; url: string };
type Pages = "home" | "about" | "contact";

const nav: Record<Pages, PageInfo> = {
  home: { title: "Home", url: "/" },
  about: { title: "About", url: "/about" },
  contact: { title: "Contact", url: "/contact" },
};
```

`keyof any` is `string | number | symbol`, allowing any valid key type.

### Extract<T, U> and Exclude<T, U>

These work on **union types**, not object types.

```ts
// Internal implementations:
type Exclude<T, U> = T extends U ? never : T;
type Extract<T, U> = T extends U ? T : never;

// Usage:
type AllTypes = string | number | boolean | null;

type OnlyStringOrNumber = Extract<AllTypes, string | number>;
// Result: string | number

type NoNulls = Exclude<AllTypes, null>;
// Result: string | number | boolean
```

These use **distributive conditional types**: when `T` is a union, the
conditional distributes over each member individually.

### ReturnType<T>

Extracts the return type of a function type.

```ts
// Internal implementation:
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R
  ? R
  : any;

// Usage:
function createUser() {
  return { id: 1, name: "Alice", role: "admin" as const };
}

type NewUser = ReturnType<typeof createUser>;
// Result: { id: number; name: string; role: "admin" }
```

The `infer R` keyword captures the return type into `R`.

### Parameters<T>

Extracts the parameter types of a function as a tuple.

```ts
// Internal implementation:
type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any
  ? P
  : never;

// Usage:
function greet(name: string, age: number): string {
  return `Hello ${name}, you are ${age}`;
}

type GreetParams = Parameters<typeof greet>;
// Result: [name: string, age: number]
```

---

## 5. Template Literal Types

Template literal types let you build string types using template syntax.

### Basic Template Literal Types

```ts
type Handler = `${string}Handler`;
// Matches any string ending with "Handler": "clickHandler", "submitHandler", etc.

type Endpoint = `/api/${string}`;
// Matches: "/api/users", "/api/posts", etc.
```

### Combining Unions in Template Literals

When you use union types inside a template literal, TypeScript generates the
**cartesian product** of all combinations.

```ts
type Color = "red" | "blue";
type Size = "small" | "large";

type ColorSize = `${Color}-${Size}`;
// Result: "red-small" | "red-large" | "blue-small" | "blue-large"
```

This is extremely powerful for generating exhaustive string combinations.

```ts
type EventType = "click" | "focus" | "blur";
type EventHandlerName = `on${Capitalize<EventType>}`;
// Result: "onClick" | "onFocus" | "onBlur"
```

### Intrinsic String Manipulation Types

TypeScript provides four built-in types for transforming string literal types:

```ts
type Upper = Uppercase<"hello">;       // "HELLO"
type Lower = Lowercase<"HELLO">;       // "hello"
type Cap = Capitalize<"hello">;        // "Hello"
type Uncap = Uncapitalize<"Hello">;    // "hello"
```

These work with literal string types and unions:

```ts
type Events = "click" | "scroll" | "mousemove";

type UpperEvents = Uppercase<Events>;
// "CLICK" | "SCROLL" | "MOUSEMOVE"

type CapitalizedEvents = Capitalize<Events>;
// "Click" | "Scroll" | "Mousemove"
```

### Practical Example: CSS Property to JS Property

```ts
type CSSProp = "background-color" | "font-size" | "border-radius";

// A more advanced pattern (simplified for illustration):
// In practice you would use recursive conditional types to handle hyphens,
// but template literals are the foundation.
type JsProp = `${string}Color` | `${string}Size` | `${string}Radius`;
```

---

## 6. Combining Mapped Types + Conditional Types + Template Literals

The real power emerges when you combine all three features:

### Example: Auto-Generate Event Emitter Interface

```ts
interface ModelEvents {
  change: { field: string; value: unknown };
  save: { id: number };
  delete: { id: number };
}

type EventEmitter<T> = {
  [K in keyof T as `on${Capitalize<string & K>}`]: (payload: T[K]) => void;
};

type ModelEmitter = EventEmitter<ModelEvents>;
// Result:
// {
//   onChange: (payload: { field: string; value: unknown }) => void;
//   onSave: (payload: { id: number }) => void;
//   onDelete: (payload: { id: number }) => void;
// }
```

### Example: Getters and Setters from an Interface

```ts
interface State {
  name: string;
  age: number;
  active: boolean;
}

type GettersAndSetters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
} & {
  [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void;
};

type StateMethods = GettersAndSetters<State>;
// Result:
// {
//   getName: () => string;
//   getAge: () => number;
//   getActive: () => boolean;
//   setName: (value: string) => void;
//   setAge: (value: number) => void;
//   setActive: (value: boolean) => void;
// }
```

### Example: Conditional Mapped Type

```ts
type ConditionallyReadonly<T, ReadonlyKeys extends keyof T> = {
  readonly [K in Extract<keyof T, ReadonlyKeys>]: T[K];
} & {
  [K in Exclude<keyof T, ReadonlyKeys>]: T[K];
};

interface Document {
  id: number;
  title: string;
  content: string;
}

type ProtectedDoc = ConditionallyReadonly<Document, "id">;
// Result: { readonly id: number } & { title: string; content: string }
```

### Example: Deep Partial

```ts
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

interface NestedConfig {
  server: {
    host: string;
    port: number;
    ssl: {
      enabled: boolean;
      cert: string;
    };
  };
  logging: {
    level: string;
  };
}

type PartialNestedConfig = DeepPartial<NestedConfig>;
// Every property at every depth is now optional
```

---

## 7. Summary

| Feature              | Purpose                                      |
|----------------------|----------------------------------------------|
| Mapped Types         | Transform every property of an existing type  |
| `?` / `readonly`     | Add or remove property modifiers              |
| `-?` / `-readonly`   | Remove modifiers                              |
| `as` clause          | Remap key names or filter keys out            |
| `never` in `as`      | Exclude specific keys from the mapped type    |
| Template Literals    | Build string types from unions and literals   |
| `Capitalize` etc.    | Transform string literal types                |
| Conditional Types    | Branch type logic with `extends` and `infer`  |
| Utility Types        | Built-in shortcuts for common transformations |

### Key Takeaways

1. **Mapped types** iterate over keys with `[K in keyof T]` and produce new types.
2. **Key remapping** (`as`) lets you rename or filter keys during mapping.
3. **Template literal types** combine string unions into exhaustive combinations.
4. **Utility types** like `Partial`, `Pick`, `Omit`, and `Record` are mapped types under the hood.
5. **Conditional types** with `infer` extract types from structures (functions, promises, arrays).
6. Combining all three unlocks patterns like auto-generating getters/setters, event emitters, and deeply nested transformations.
