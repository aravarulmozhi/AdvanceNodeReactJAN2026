// ============================================================
// Topic 09 — Practice NodeJS API: SOLUTION
// ============================================================
// Complete, commented solutions for every challenge.
// Each section explains *why* the TypeScript feature is used.
// ============================================================

// We use a simple counter for id generation so this file can
// run without the Node "crypto" module in every environment.
let idCounter = 0;
function nextId(): string {
  return String(++idCounter);
}

// ============================================================
// 8. User roles — union type + type guard
// ============================================================
// We define UserRole first because the User interface depends on it.
//
// A union of string literals is preferred over an enum here
// because it produces no runtime JavaScript — it exists only in
// the type system.  The type guard isValidRole lets us safely
// narrow an unknown string coming from user input.

type UserRole = "admin" | "editor" | "viewer";

const VALID_ROLES: readonly UserRole[] = ["admin", "editor", "viewer"] as const;

function isValidRole(value: string): value is UserRole {
  return (VALID_ROLES as readonly string[]).includes(value);
}

// ============================================================
// 1. Define interfaces for User and Product
// ============================================================
// Plain data interfaces — every field has a concrete type.
// Both have an `id: string` field which is required by our
// generic repository constraint (T extends { id: string }).

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
}

// ============================================================
// 2. Discriminated union ApiResponse<T>
// ============================================================
// The `success` field is the *discriminant*.  When we check
// `response.success === true`, TypeScript automatically narrows
// the type so that `data` is accessible.  When it is false,
// only `error` is accessible.  This eliminates an entire class
// of bugs where the caller forgets to check for errors.

type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// Convenience constructors — keep call sites clean.
function ok<T>(data: T): ApiResponse<T> {
  return { success: true, data };
}

function fail<T = never>(error: string): ApiResponse<T> {
  return { success: false, error };
}

// ============================================================
// 3. Generic Repository<T> interface
// ============================================================
// Generics make this interface reusable for ANY entity.
//
// - Omit<T, "id"> on `create` means the caller never supplies
//   the id — the repository generates it internally.
// - Partial<T> on `update` means the caller sends only the
//   fields they want to change; everything else stays the same.
// - The return types use `| undefined` to force callers to
//   handle the "not found" case explicitly.

interface Repository<T> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | undefined>;
  create(item: Omit<T, "id">): Promise<T>;
  update(id: string, item: Partial<T>): Promise<T | undefined>;
  delete(id: string): Promise<boolean>;
}

// ============================================================
// 4. InMemoryRepository implementation
// ============================================================
// The constraint `T extends { id: string }` guarantees that
// whatever entity we store will always have a string id.  This
// lets us safely cast `{ id, ...item } as T` inside `create`.
//
// A Map<string, T> gives us O(1) lookups, inserts, and deletes
// — a perfect backing store for an in-memory implementation.

class InMemoryRepository<T extends { id: string }> implements Repository<T> {
  // Private store — external code cannot mutate it directly.
  private store: Map<string, T> = new Map();

  async findAll(): Promise<T[]> {
    // Map.values() returns an iterator; we spread it into an array.
    return Array.from(this.store.values());
  }

  async findById(id: string): Promise<T | undefined> {
    // Map.get returns T | undefined naturally — no extra work.
    return this.store.get(id);
  }

  async create(item: Omit<T, "id">): Promise<T> {
    const id = nextId();
    // We merge the generated id with the rest of the fields.
    // The `as T` cast is safe because we know `item` has every
    // field of T except `id`, and we are supplying `id` here.
    const entity = { id, ...item } as T;
    this.store.set(id, entity);
    return entity;
  }

  async update(id: string, partial: Partial<T>): Promise<T | undefined> {
    const existing = this.store.get(id);
    if (!existing) return undefined;

    // Spread existing fields, override with partial, but always
    // keep the original id so callers cannot accidentally change it.
    const updated = { ...existing, ...partial, id } as T;
    this.store.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    // Map.delete returns true if the key existed, false otherwise.
    return this.store.delete(id);
  }
}

// ============================================================
// 5. Type-safe RouteHandler type
// ============================================================
// This mirrors the Express handler signature but locks in the
// generic parameters so every handler in the codebase follows
// the same pattern.
//
// Without express installed we stub the minimal types ourselves.
// In a real project you would import from "express".

// --- Minimal Express stubs (replace with real imports) -------
interface ExpressRequest<Params = {}, ResBody = any, ReqBody = {}, Query = {}> {
  params: Params;
  body: ReqBody;
  query: Query;
}

interface ExpressResponse<ResBody = any> {
  status(code: number): ExpressResponse<ResBody>;
  json(body: ResBody): void;
}

type NextFunction = (err?: any) => void;
// --- End stubs -----------------------------------------------

type RouteHandler<
  Params = {},
  ResBody = any,
  ReqBody = {},
  Query = {}
> = (
  req: ExpressRequest<Params, ResBody, ReqBody, Query>,
  res: ExpressResponse<ResBody>,
  next: NextFunction
) => void | Promise<void>;

// Example usage (compile-time check only):
const getUserHandler: RouteHandler<{ id: string }, ApiResponse<User>> = (req, res) => {
  const _id: string = req.params.id; // correctly typed as string
  void _id;
  res.json({ success: true, data: { id: "1", name: "Alice", email: "a@b.com", role: "admin" } });
};
void getUserHandler; // suppress unused warning

// ============================================================
// 6. Utility types for User
// ============================================================

// UpdateUser — every field is optional EXCEPT id.
// Strategy: take Partial<User> (all optional) and intersect it
// with Pick<User, "id"> (id required).  The intersection wins
// for "id", making it required while everything else stays
// optional.
type UpdateUser = Partial<User> & Pick<User, "id">;

// PublicUser — only the fields safe to expose publicly.
// Pick selects exactly the keys we list and discards the rest.
// This means `email` is excluded.
type PublicUser = Pick<User, "id" | "name" | "role">;

// ============================================================
// 7. Type guard — isApiError
// ============================================================
// After calling isApiError in an `if` block, TypeScript narrows
// the variable to the error variant, giving us access to `.error`
// and removing `.data` from the type.

function isApiError<T>(
  response: ApiResponse<T>
): response is { success: false; error: string } {
  return response.success === false;
}

// ============================================================
// 9. Generic async wrapper — trySafe
// ============================================================
// This is incredibly useful in real APIs.  Instead of scattering
// try/catch blocks across every handler, we wrap operations in
// trySafe and always get back a clean ApiResponse<T>.
//
// The caller can then use isApiError (or check `success`) to
// decide what to do — no uncaught exceptions, no forgotten
// error handling.

async function trySafe<T>(operation: () => Promise<T>): Promise<ApiResponse<T>> {
  try {
    const data = await operation();
    return ok(data);
  } catch (err: unknown) {
    // We defensively extract the error message.
    // `err` is `unknown`, so we must narrow it first.
    const message = err instanceof Error ? err.message : String(err);
    return fail(message);
  }
}

// ============================================================
// 10. Type-safe event map and emitter
// ============================================================

// a) The event map associates each event name with the exact
//    shape of its payload.  Adding a new event here is the ONLY
//    place a developer needs to touch — every listener and
//    emitter will be type-checked automatically.

interface AppEvents {
  userCreated: { user: User };
  userDeleted: { userId: string };
  productAdded: { product: Product };
}

// b) The generic TypedEmitter interface uses `keyof Events` to
//    constrain both the event name AND the corresponding payload.
//    If you try to emit "userCreated" with a Product payload,
//    the compiler will refuse.

interface TypedEmitter<Events extends Record<string, any>> {
  on<K extends keyof Events>(event: K, handler: (payload: Events[K]) => void): void;
  emit<K extends keyof Events>(event: K, payload: Events[K]): void;
}

// Implementation — uses a Map of handler arrays internally.
class AppEventEmitter implements TypedEmitter<AppEvents> {
  private handlers: Map<string, Function[]> = new Map();

  on<K extends keyof AppEvents>(
    event: K,
    handler: (payload: AppEvents[K]) => void
  ): void {
    const key = event as string;
    const list = this.handlers.get(key) ?? [];
    list.push(handler);
    this.handlers.set(key, list);
  }

  emit<K extends keyof AppEvents>(
    event: K,
    payload: AppEvents[K]
  ): void {
    const key = event as string;
    const list = this.handlers.get(key) ?? [];
    for (const fn of list) {
      fn(payload);
    }
  }
}

// ============================================================
// TESTS — run this file with ts-node or tsx to verify
// ============================================================

async function runTests(): Promise<void> {
  console.log("=== Test 1 & 2: ApiResponse ===");
  const successResp: ApiResponse<User> = ok({
    id: "1",
    name: "Alice",
    email: "alice@test.com",
    role: "admin",
  });
  const errorResp: ApiResponse<User> = fail("User not found");

  console.log("Success response:", successResp);
  console.log("Error response:  ", errorResp);

  // ----------------------------------------------------------
  console.log("\n=== Test 3 & 4: Repository CRUD ===");
  const userRepo = new InMemoryRepository<User>();

  const created = await userRepo.create({
    name: "Bob",
    email: "bob@test.com",
    role: "editor",
  });
  console.log("Created:", created);

  const all = await userRepo.findAll();
  console.log("All users:", all);

  const found = await userRepo.findById(created.id);
  console.log("Found by id:", found);

  const updated = await userRepo.update(created.id, { name: "Bobby" });
  console.log("Updated:", updated);

  const deleted = await userRepo.delete(created.id);
  console.log("Deleted:", deleted);

  const afterDelete = await userRepo.findAll();
  console.log("After delete:", afterDelete);

  // ----------------------------------------------------------
  console.log("\n=== Test 6: Utility Types ===");
  const updatePayload: UpdateUser = { id: "1", name: "Updated Alice" };
  console.log("UpdateUser payload:", updatePayload);

  const publicUser: PublicUser = { id: "1", name: "Alice", role: "admin" };
  console.log("PublicUser:", publicUser);

  // ----------------------------------------------------------
  console.log("\n=== Test 7: isApiError type guard ===");
  if (isApiError(errorResp)) {
    console.log("Correctly identified error:", errorResp.error);
  }
  if (!isApiError(successResp)) {
    console.log("Correctly identified success:", successResp.data.name);
  }

  // ----------------------------------------------------------
  console.log("\n=== Test 8: UserRole type guard ===");
  const maybeRole: string = "admin";
  if (isValidRole(maybeRole)) {
    const confirmed: UserRole = maybeRole; // narrowed!
    console.log("Valid role:", confirmed);
  }

  const badRole: string = "superuser";
  if (!isValidRole(badRole)) {
    console.log(`"${badRole}" is NOT a valid role — guard works`);
  }

  // ----------------------------------------------------------
  console.log("\n=== Test 9: trySafe ===");
  const safeResult = await trySafe(async () => {
    return { id: "1", name: "Alice", email: "a@b.com", role: "admin" as UserRole };
  });
  console.log("trySafe success:", safeResult);

  const failedResult = await trySafe<User>(async () => {
    throw new Error("Database connection lost");
  });
  console.log("trySafe failure:", failedResult);

  // ----------------------------------------------------------
  console.log("\n=== Test 10: TypedEmitter ===");
  const emitter = new AppEventEmitter();

  emitter.on("userCreated", (payload) => {
    // payload is fully typed as { user: User }
    console.log(`Event: userCreated → welcome ${payload.user.name}!`);
  });

  emitter.on("productAdded", (payload) => {
    // payload is fully typed as { product: Product }
    console.log(`Event: productAdded → ${payload.product.title} ($${payload.product.price})`);
  });

  emitter.emit("userCreated", {
    user: { id: "1", name: "Alice", email: "a@b.com", role: "admin" },
  });

  emitter.emit("productAdded", {
    product: { id: "1", title: "TypeScript Handbook", price: 29.99, category: "Books" },
  });

  // The following line would cause a compile error if uncommented,
  // because the payload does not match the expected shape:
  // emitter.emit("userCreated", { product: { id: "1", title: "Oops", price: 0, category: "" } });

  console.log("\nAll tests passed!");
}

runTests();

export {
  UserRole,
  User,
  Product,
  ApiResponse,
  Repository,
  InMemoryRepository,
  RouteHandler,
  UpdateUser,
  PublicUser,
  isApiError,
  isValidRole,
  trySafe,
  AppEvents,
  TypedEmitter,
  AppEventEmitter,
};
