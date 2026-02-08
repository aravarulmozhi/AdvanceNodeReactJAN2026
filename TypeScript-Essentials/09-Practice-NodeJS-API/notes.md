# Topic 09 - Practice NodeJS API

## Tying It All Together: TypeScript + Node.js + Express

This practice session combines every TypeScript concept we have learned into a
realistic Node.js API project. We will build type-safe endpoints, repositories,
middleware, and utility patterns from scratch.

---

## 1. Setting Up Express with TypeScript

### Installation

```bash
# Runtime dependency
npm i express

# Type definitions (dev dependency — not shipped to production)
npm i -D @types/express
```

`@types/express` gives us full IntelliSense for every Express object.
Without it, `req` and `res` are `any` and we lose all safety.

### Minimal tsconfig.json for a Node API

```jsonc
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "declaration": true
  },
  "include": ["src"]
}
```

### Hello World

```ts
import express, { Request, Response } from "express";

const app = express();
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Hello, typed world!" });
});

app.listen(3000, () => console.log("Server running on port 3000"));
```

---

## 2. Typing Express Request and Response

Express ships four generic slots on `Request`:

```ts
Request<Params, ResBody, ReqBody, Query>
```

| Slot      | Purpose                                 | Default |
| --------- | --------------------------------------- | ------- |
| `Params`  | URL path parameters (`req.params`)      | `{}`    |
| `ResBody` | Shape the response body should follow   | `any`   |
| `ReqBody` | Shape of the incoming JSON body         | `any`   |
| `Query`   | Shape of `req.query` string parameters  | `{}`    |

`Response` has one generic slot:

```ts
Response<ResBody>
```

### Example — Typed Route

```ts
interface UserParams {
  id: string;
}

interface UserBody {
  name: string;
  email: string;
}

interface UserQuery {
  includeOrders?: string;
}

app.get(
  "/users/:id",
  (req: Request<UserParams, {}, {}, UserQuery>, res: Response) => {
    const userId: string = req.params.id;          // typed!
    const includeOrders = req.query.includeOrders;  // string | undefined
    res.json({ userId, includeOrders });
  }
);

app.post(
  "/users",
  (req: Request<{}, {}, UserBody>, res: Response) => {
    const { name, email } = req.body; // both strings, fully typed
    res.status(201).json({ id: "1", name, email });
  }
);
```

---

## 3. Creating Typed Route Handlers

We can define a reusable handler type so every route follows the same shape:

```ts
import { Request, Response, NextFunction } from "express";

type TypedHandler<
  Params = {},
  ResBody = any,
  ReqBody = {},
  Query = {}
> = (
  req: Request<Params, ResBody, ReqBody, Query>,
  res: Response<ResBody>,
  next: NextFunction
) => void | Promise<void>;

// Usage
const getUser: TypedHandler<{ id: string }> = (req, res) => {
  const id = req.params.id; // string — no cast needed
  res.json({ id, name: "Alice" });
};

app.get("/users/:id", getUser);
```

This keeps handler signatures consistent across the entire codebase.

---

## 4. Generic Repository Pattern

### The Interface

```ts
interface Repository<T> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | undefined>;
  create(item: Omit<T, "id">): Promise<T>;
  update(id: string, item: Partial<T>): Promise<T | undefined>;
  delete(id: string): Promise<boolean>;
}
```

- `T` is the entity type (User, Product, Order, etc.).
- `Omit<T, "id">` means callers never supply the id — we generate it.
- `Partial<T>` lets callers send only the fields they want to change.

### In-Memory Implementation

```ts
import { randomUUID } from "crypto";

class InMemoryRepository<T extends { id: string }> implements Repository<T> {
  private store: Map<string, T> = new Map();

  async findAll(): Promise<T[]> {
    return Array.from(this.store.values());
  }

  async findById(id: string): Promise<T | undefined> {
    return this.store.get(id);
  }

  async create(item: Omit<T, "id">): Promise<T> {
    const id = randomUUID();
    const entity = { id, ...item } as T;
    this.store.set(id, entity);
    return entity;
  }

  async update(id: string, partial: Partial<T>): Promise<T | undefined> {
    const existing = this.store.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...partial, id } as T;
    this.store.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.store.delete(id);
  }
}
```

### Consuming the Repository

```ts
interface User {
  id: string;
  name: string;
  email: string;
}

const userRepo = new InMemoryRepository<User>();

// All methods are now fully typed for User
await userRepo.create({ name: "Alice", email: "alice@example.com" });
const users = await userRepo.findAll(); // User[]
```

---

## 5. Type-Safe Middleware

Middleware in Express is just a function with `(req, res, next)`.
We can type it to enforce what it adds to the request:

```ts
// Extend the Express Request via declaration merging
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      role?: "admin" | "user" | "guest";
    }
  }
}

// Auth middleware — attaches userId and role to req
const authMiddleware: TypedHandler = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  // In production you would verify the JWT here
  req.userId = "user-123";
  req.role = "admin";
  next();
};

// Downstream handler can now trust req.userId exists
app.get("/profile", authMiddleware, (req: Request, res: Response) => {
  res.json({ userId: req.userId, role: req.role });
});
```

### Role-Guard Factory (Generic Middleware)

```ts
type Role = "admin" | "user" | "guest";

function requireRole(...allowed: Role[]): TypedHandler {
  return (req, res, next) => {
    if (!req.role || !allowed.includes(req.role)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    next();
  };
}

app.delete("/users/:id", authMiddleware, requireRole("admin"), deleteUser);
```

---

## 6. Error Handling with Discriminated Unions

Instead of throwing strings or bare objects, define a union whose `kind`
field tells the compiler exactly which branch we are in:

```ts
type AppError =
  | { kind: "NOT_FOUND"; resource: string; id: string }
  | { kind: "VALIDATION"; message: string; field: string }
  | { kind: "UNAUTHORIZED"; reason: string }
  | { kind: "INTERNAL"; message: string };

function toHttpStatus(error: AppError): number {
  switch (error.kind) {
    case "NOT_FOUND":
      return 404;
    case "VALIDATION":
      return 400;
    case "UNAUTHORIZED":
      return 401;
    case "INTERNAL":
      return 500;
  }
}

function formatError(error: AppError): string {
  switch (error.kind) {
    case "NOT_FOUND":
      return `${error.resource} with id ${error.id} not found`;
    case "VALIDATION":
      return `Validation failed on field "${error.field}": ${error.message}`;
    case "UNAUTHORIZED":
      return `Unauthorized: ${error.reason}`;
    case "INTERNAL":
      return `Internal server error: ${error.message}`;
  }
}
```

The compiler ensures every `switch` is exhaustive — if we add a new error kind
and forget to handle it, we get a compile-time error.

---

## 7. Environment Variables with Types

`process.env` values are always `string | undefined`. We can lock them down:

### Option A — Declaration Merging

```ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      DATABASE_URL: string;
      JWT_SECRET: string;
      NODE_ENV: "development" | "production" | "test";
    }
  }
}

// Now process.env.PORT is string (not string | undefined)
const port = parseInt(process.env.PORT, 10);
```

### Option B — Validation Function (Safer)

```ts
interface EnvConfig {
  port: number;
  databaseUrl: string;
  jwtSecret: string;
  nodeEnv: "development" | "production" | "test";
}

function loadEnv(): EnvConfig {
  const port = Number(process.env.PORT);
  if (isNaN(port)) throw new Error("PORT must be a number");

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is required");

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) throw new Error("JWT_SECRET is required");

  const nodeEnv = process.env.NODE_ENV ?? "development";
  if (!["development", "production", "test"].includes(nodeEnv)) {
    throw new Error("NODE_ENV must be development, production, or test");
  }

  return {
    port,
    databaseUrl,
    jwtSecret,
    nodeEnv: nodeEnv as EnvConfig["nodeEnv"],
  };
}

// Use throughout the app — fully typed, validated once at startup
const config: EnvConfig = loadEnv();
```

---

## 8. Practical Patterns — Combining Everything

### 8a. Generic API Response Wrapper

```ts
type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// Type guard
function isApiError<T>(response: ApiResponse<T>): response is { success: false; error: string } {
  return response.success === false;
}

// Helper constructors
function ok<T>(data: T): ApiResponse<T> {
  return { success: true, data };
}

function fail<T = never>(error: string): ApiResponse<T> {
  return { success: false, error };
}

// Usage in a handler
app.get("/users/:id", async (req, res) => {
  const user = await userRepo.findById(req.params.id);

  if (!user) {
    res.status(404).json(fail("User not found"));
    return;
  }

  res.json(ok(user));
});
```

Every consumer of this API knows the response is always
`{ success, data }` or `{ success, error }` — no guessing.

### 8b. Type-Safe Event Emitter Pattern

```ts
// 1. Define the map of event names → payload types
interface AppEvents {
  userCreated: { user: User };
  userDeleted: { userId: string };
  orderPlaced: { orderId: string; total: number };
}

// 2. Generic emitter interface
interface TypedEmitter<Events extends Record<string, any>> {
  on<K extends keyof Events>(event: K, handler: (payload: Events[K]) => void): void;
  emit<K extends keyof Events>(event: K, payload: Events[K]): void;
}

// 3. Implementation
class AppEventEmitter implements TypedEmitter<AppEvents> {
  private handlers: Map<string, Function[]> = new Map();

  on<K extends keyof AppEvents>(event: K, handler: (payload: AppEvents[K]) => void): void {
    const list = this.handlers.get(event as string) ?? [];
    list.push(handler);
    this.handlers.set(event as string, list);
  }

  emit<K extends keyof AppEvents>(event: K, payload: AppEvents[K]): void {
    const list = this.handlers.get(event as string) ?? [];
    list.forEach((fn) => fn(payload));
  }
}

// 4. Usage — fully type-checked
const emitter = new AppEventEmitter();

emitter.on("userCreated", (payload) => {
  // payload is { user: User } — the compiler knows
  console.log(`Welcome, ${payload.user.name}!`);
});

emitter.emit("userCreated", { user: { id: "1", name: "Alice", email: "a@b.com" } });
// emitter.emit("userCreated", { wrong: true }); // compile error
```

### 8c. Builder Pattern with Generics

A builder that accumulates a configuration object one field at a time,
with full type safety at every step:

```ts
class QueryBuilder<T extends Record<string, any>> {
  private filters: Partial<T> = {};
  private sortField?: keyof T;
  private sortOrder: "asc" | "desc" = "asc";
  private limitValue?: number;

  where<K extends keyof T>(field: K, value: T[K]): this {
    this.filters[field] = value;
    return this;
  }

  sort(field: keyof T, order: "asc" | "desc" = "asc"): this {
    this.sortField = field;
    this.sortOrder = order;
    return this;
  }

  limit(n: number): this {
    this.limitValue = n;
    return this;
  }

  build(): { filters: Partial<T>; sort?: { field: keyof T; order: "asc" | "desc" }; limit?: number } {
    return {
      filters: this.filters,
      sort: this.sortField ? { field: this.sortField, order: this.sortOrder } : undefined,
      limit: this.limitValue,
    };
  }
}

// Usage
interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
}

const query = new QueryBuilder<Product>()
  .where("category", "electronics")   // value must be string
  .where("price", 99)                 // value must be number
  .sort("price", "desc")
  .limit(10)
  .build();

// query.filters.category is string | undefined
// query.sort.field is keyof Product
```

---

## Quick Reference — Key Takeaways

| Concept                    | TypeScript Feature Used                          |
| -------------------------- | ------------------------------------------------ |
| Typed routes               | Generics on Request / Response                   |
| Repository pattern         | Generic interface + constrained class             |
| Middleware                  | Declaration merging, union types                  |
| Error handling             | Discriminated unions, exhaustive switch           |
| Env variables              | Declaration merging OR validation function        |
| API response wrapper       | Discriminated union + type guard                  |
| Event emitter              | Mapped types, `keyof`, constrained generics       |
| Builder pattern            | Method chaining with `this`, `keyof` constraints  |

Everything in this session reinforces the same core ideas: **generics give us
reusability**, **unions give us safety**, and **type guards let us narrow at
runtime**. When combined, they produce APIs that are nearly impossible to
misuse.
