// ============================================================
// Topic 09 — Practice NodeJS API: CHALLENGE
// ============================================================
// This challenge ties together every TypeScript concept we have
// covered so far: interfaces, generics, discriminated unions,
// utility types, type guards, enums/union types, and async
// patterns.  Complete each numbered section below.
// ============================================================

// ------------------------------------------------------------
// 1. Define interfaces for User and Product
// ------------------------------------------------------------
// User  — id (string), name (string), email (string), role (UserRole)
// Product — id (string), title (string), price (number), category (string)

// interface User { ... }
// interface Product { ... }

// ------------------------------------------------------------
// 2. Create a discriminated union ApiResponse<T>
// ------------------------------------------------------------
// Two variants:
//   success → { success: true;  data: T }
//   error   → { success: false; error: string }

// type ApiResponse<T> = ...

// ------------------------------------------------------------
// 3. Create a generic Repository<T> interface
// ------------------------------------------------------------
// Methods:
//   findAll()                → Promise<T[]>
//   findById(id: string)     → Promise<T | undefined>
//   create(item: Omit<T, "id">) → Promise<T>
//   update(id: string, item: Partial<T>) → Promise<T | undefined>
//   delete(id: string)       → Promise<boolean>

// interface Repository<T> { ... }

// ------------------------------------------------------------
// 4. Implement InMemoryRepository<T extends { id: string }>
// ------------------------------------------------------------
// Use a Map<string, T> as the internal store.
// Generate ids with crypto.randomUUID() or a simple counter.

// class InMemoryRepository<T extends { id: string }> implements Repository<T> { ... }

// ------------------------------------------------------------
// 5. Create a type-safe RouteHandler type
// ------------------------------------------------------------
// It should accept generic parameters for:
//   Params, ResBody, ReqBody, and Query
// and describe a function that receives typed req, res, next.
//
// Hint: Import types from express —
//   import { Request, Response, NextFunction } from "express";
// (If express is not installed you can stub the types yourself.)

// type RouteHandler<Params = {}, ResBody = any, ReqBody = {}, Query = {}> = ...

// ------------------------------------------------------------
// 6. Utility types for User
// ------------------------------------------------------------
// a) UpdateUser — all User fields optional EXCEPT id (which stays required).
//    Hint: combine Partial and Pick (or use Omit + Partial + intersection).
// b) PublicUser — only id, name, and role (no email).

// type UpdateUser = ...
// type PublicUser = ...

// ------------------------------------------------------------
// 7. Type guard: isApiError
// ------------------------------------------------------------
// Write a generic type guard function that narrows an
// ApiResponse<T> to the error variant.

// function isApiError<T>(response: ApiResponse<T>): response is ... { ... }

// ------------------------------------------------------------
// 8. User roles — union type + type guard
// ------------------------------------------------------------
// a) Define a union type UserRole = "admin" | "editor" | "viewer"
// b) Write a type guard isValidRole(value: string): value is UserRole

// type UserRole = ...
// function isValidRole(value: string): value is UserRole { ... }

// ------------------------------------------------------------
// 9. Generic async wrapper
// ------------------------------------------------------------
// Write a function trySafe<T> that:
//   - accepts a () => Promise<T>
//   - returns Promise<ApiResponse<T>>
//   - wraps the call in try / catch
//   - on success returns the success variant
//   - on failure returns the error variant with the error message

// async function trySafe<T>(operation: () => Promise<T>): Promise<ApiResponse<T>> { ... }

// ------------------------------------------------------------
// 10. Type-safe event map and emitter interface
// ------------------------------------------------------------
// a) Define an interface AppEvents mapping event names to payload types:
//      userCreated  → { user: User }
//      userDeleted  → { userId: string }
//      productAdded → { product: Product }
//
// b) Define a generic TypedEmitter<Events> interface with:
//      on<K extends keyof Events>(event: K, handler: (payload: Events[K]) => void): void
//      emit<K extends keyof Events>(event: K, payload: Events[K]): void

// interface AppEvents { ... }
// interface TypedEmitter<Events extends Record<string, any>> { ... }

// ============================================================
// TESTING AREA
// ============================================================
// After completing the challenges, uncomment the code below to
// verify your solutions compile and behave correctly.
// ============================================================

/*
// --- Test 1 & 2: User, Product, ApiResponse ---
const successResponse: ApiResponse<User> = {
  success: true,
  data: { id: "1", name: "Alice", email: "alice@test.com", role: "admin" },
};

const errorResponse: ApiResponse<User> = {
  success: false,
  error: "User not found",
};

// --- Test 3 & 4: Repository ---
const userRepo = new InMemoryRepository<User>();
(async () => {
  const created = await userRepo.create({ name: "Bob", email: "bob@test.com", role: "editor" });
  console.log("Created:", created);

  const all = await userRepo.findAll();
  console.log("All users:", all);

  const found = await userRepo.findById(created.id);
  console.log("Found:", found);

  const updated = await userRepo.update(created.id, { name: "Bobby" });
  console.log("Updated:", updated);

  const deleted = await userRepo.delete(created.id);
  console.log("Deleted:", deleted);
})();

// --- Test 6: Utility types ---
const updatePayload: UpdateUser = { id: "1", name: "Updated Alice" };
const publicUser: PublicUser = { id: "1", name: "Alice", role: "admin" };

// --- Test 7: isApiError ---
if (isApiError(errorResponse)) {
  console.log("Error message:", errorResponse.error);
} else {
  console.log("Success data:", errorResponse.data);
}

// --- Test 8: Role guard ---
const role: string = "admin";
if (isValidRole(role)) {
  // role is narrowed to UserRole here
  const r: UserRole = role;
  console.log("Valid role:", r);
}

// --- Test 9: trySafe ---
(async () => {
  const result = await trySafe(async () => {
    return { id: "1", name: "Alice", email: "alice@test.com", role: "admin" as UserRole };
  });
  console.log("trySafe result:", result);

  const failResult = await trySafe<User>(async () => {
    throw new Error("Something went wrong");
  });
  console.log("trySafe fail:", failResult);
})();

// --- Test 10: Event emitter types ---
// (compile-time check only — implementation is in the solution)
*/

export {};
