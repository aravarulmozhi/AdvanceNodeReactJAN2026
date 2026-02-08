// ============================================================
// Topic 05 - Advanced Types Prerequisites: Workout Solutions
// ============================================================
// Complete solutions with detailed explanations of each
// type-level operation.
// ============================================================

// -----------------------------------------------------------
// Solution 1: Literal Types
// We define a union of three string literal types.
// The variable can ONLY hold one of these exact values.
// -----------------------------------------------------------

type Status = "success" | "error" | "pending";

const currentStatus: Status = "success";

// Demonstrating that other strings are rejected:
// const badStatus: Status = "loading"; // Error: Type '"loading"' is not assignable to type 'Status'

// You can use literal types in function signatures too:
function handleStatus(status: Status): string {
  switch (status) {
    case "success":
      return "Operation completed.";
    case "error":
      return "Something went wrong.";
    case "pending":
      return "Still processing...";
  }
  // TypeScript knows this is exhaustive -- no default needed
}

console.log("Challenge 1:", handleStatus(currentStatus));


// -----------------------------------------------------------
// Solution 2: typeof Operator
// 'typeof' in a type position extracts the TypeScript type
// from an existing runtime value. This means we don't need
// to manually write out the type -- we derive it from the
// object itself, keeping a single source of truth.
// -----------------------------------------------------------

const serverConfig = {
  host: "localhost",
  port: 8080,
  secure: false,
  retries: 3,
};

// typeof extracts the full structural type of serverConfig:
// {
//   host: string;
//   port: number;
//   secure: boolean;
//   retries: number;
// }
type ServerConfig = typeof serverConfig;

// We can now use this derived type for other variables or parameters:
function printConfig(config: ServerConfig): void {
  console.log(`${config.host}:${config.port} (secure: ${config.secure})`);
}

console.log("Challenge 2:");
printConfig(serverConfig);


// -----------------------------------------------------------
// Solution 3: keyof Operator
// 'keyof' takes a type (here an interface) and produces a
// union of all its property names as string literal types.
// This ensures type-safe property access.
// -----------------------------------------------------------

interface Movie {
  title: string;
  director: string;
  year: number;
  rating: number;
  genre: string;
}

// keyof Movie = "title" | "director" | "year" | "rating" | "genre"
type MovieKey = keyof Movie;

// The function parameter 'key' can only be one of the valid keys.
// The return type Movie[MovieKey] is the union of all property types.
function getMovieProperty(movie: Movie, key: MovieKey): Movie[MovieKey] {
  return movie[key];
}

const inception: Movie = {
  title: "Inception",
  director: "Christopher Nolan",
  year: 2010,
  rating: 8.8,
  genre: "Sci-Fi",
};

console.log("Challenge 3:", getMovieProperty(inception, "title")); // "Inception"
console.log("Challenge 3:", getMovieProperty(inception, "year"));  // 2010
// getMovieProperty(inception, "budget"); // Error: '"budget"' is not assignable to type 'MovieKey'


// -----------------------------------------------------------
// Solution 4: Combining keyof and typeof
// When working with a plain object (not a type/interface),
// we first use 'typeof' to extract its type, then 'keyof'
// to get the union of its keys. This is a very common pattern.
// -----------------------------------------------------------

const theme = {
  primaryColor: "#3498db",
  secondaryColor: "#2ecc71",
  fontSize: 16,
  fontFamily: "Arial",
  borderRadius: 4,
};

// Step-by-step breakdown:
// typeof theme => { primaryColor: string; secondaryColor: string; fontSize: number; fontFamily: string; borderRadius: number }
// keyof typeof theme => "primaryColor" | "secondaryColor" | "fontSize" | "fontFamily" | "borderRadius"
type ThemeProp = keyof typeof theme;

// The function only accepts valid keys of the theme object
function getThemeValue(prop: ThemeProp) {
  return theme[prop];
}

console.log("Challenge 4:", getThemeValue("primaryColor")); // "#3498db"
console.log("Challenge 4:", getThemeValue("fontSize"));     // 16
// getThemeValue("margin"); // Error: '"margin"' is not assignable to type 'ThemeProp'


// -----------------------------------------------------------
// Solution 5: Indexed Access Types
// Using bracket notation on a type to look up the type of a
// specific property. This works like object property access,
// but at the type level.
// -----------------------------------------------------------

interface Customer {
  id: number;
  email: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  tags: string[];
}

// a) Indexed access to get the nested address type
//    Customer["address"] reaches into the type and pulls out
//    the type of the 'address' property
type CustomerAddress = Customer["address"];
// Result: { street: string; city: string; state: string; zip: string }

// b) Indexed access to get the tags array type
type CustomerTags = Customer["tags"];
// Result: string[]

// c) Union index to get the type of id OR email
//    When you pass a union as the index, you get a union of the results
type IdOrEmail = Customer["id" | "email"];
// Result: number | string (because id is number and email is string)

// We can also do nested indexed access:
type CustomerZip = Customer["address"]["zip"];
// Result: string

// Verify by using these types:
const addr: CustomerAddress = {
  street: "123 Main St",
  city: "Anytown",
  state: "CA",
  zip: "12345",
};
const tags: CustomerTags = ["vip", "returning"];
const idOrEmail: IdOrEmail = 42; // number is OK
const idOrEmail2: IdOrEmail = "alice@example.com"; // string is also OK

console.log("Challenge 5:", addr.city, tags, idOrEmail, idOrEmail2);


// -----------------------------------------------------------
// Solution 6: as const Assertions
// 'as const' creates a deeply readonly structure with the
// narrowest possible literal types. No property can be
// reassigned, and all values retain their literal types
// instead of widening to string/number/boolean.
// -----------------------------------------------------------

const appConfig = {
  environment: "development",
  port: 3000,
  debug: true,
  allowedOrigins: ["http://localhost:3000", "https://myapp.com"],
  database: {
    host: "localhost",
    name: "mydb",
  },
} as const;
// The full type is now:
// {
//   readonly environment: "development";
//   readonly port: 3000;
//   readonly debug: true;
//   readonly allowedOrigins: readonly ["http://localhost:3000", "https://myapp.com"];
//   readonly database: {
//     readonly host: "localhost";
//     readonly name: "mydb";
//   };
// }

// a) Extract the type of 'environment' -- it is the literal "development", NOT string
type Environment = (typeof appConfig)["environment"];
// Result: "development"

// b) Extract the union of all allowedOrigins values
//    First we get the tuple type via typeof appConfig.allowedOrigins,
//    then index with [number] to get the union of all elements
type AllowedOrigin = (typeof appConfig)["allowedOrigins"][number];
// Result: "http://localhost:3000" | "https://myapp.com"

// c) Attempting to modify shows an error because everything is readonly:
// appConfig.environment = "production"; // Error: Cannot assign to 'environment' because it is a read-only property
// appConfig.allowedOrigins.push("http://evil.com"); // Error: Property 'push' does not exist on type 'readonly [...]'

// We can also go deep:
type DbHost = (typeof appConfig)["database"]["host"];
// Result: "localhost"

console.log("Challenge 6:");
console.log("  Environment type is the literal:", appConfig.environment);
console.log("  Allowed origins:", appConfig.allowedOrigins);


// -----------------------------------------------------------
// Solution 7: Tuple Types
// Tuples are fixed-length arrays where each position has its
// own type. They can have labels for readability, optional
// elements, and rest elements.
// -----------------------------------------------------------

// a) A tuple with: string (message), number (timestamp), then any number of boolean flags
//    The ...boolean[] is a rest element allowing variable-length booleans at the end
type LogEntry = [string, number, ...boolean[]];

// b) A labeled tuple with x, y, and optional z
//    Labels don't affect runtime behavior but improve IDE tooltips
type Coordinate = [x: number, y: number, z?: number];

// Values:
const entry: LogEntry = ["Server started", Date.now(), true, false, true];
// Also valid with zero boolean flags:
const entry2: LogEntry = ["Error occurred", Date.now()];

const point2D: Coordinate = [10, 20];
const point3D: Coordinate = [10, 20, 30];

console.log("Challenge 7:");
console.log("  Log entry:", entry);
console.log("  2D point:", point2D);
console.log("  3D point:", point3D);


// -----------------------------------------------------------
// Solution 8: Indexed Access with number
// When you index an array type with 'number', TypeScript
// gives you the type of the array's elements.
// With 'as const', this gives you a union of literal types.
// -----------------------------------------------------------

type Fruits = string[];

const vegetables = ["carrot", "broccoli", "spinach"] as const;

// Fruits[number] extracts the element type from the array type.
// Since Fruits is string[], Fruits[number] is just string.
type Fruit = Fruits[number];
// Result: string

// For the as const array, typeof vegetables is:
//   readonly ["carrot", "broccoli", "spinach"]
// Indexing with [number] gives us the union of all element literal types.
type Vegetable = (typeof vegetables)[number];
// Result: "carrot" | "broccoli" | "spinach"

// This is one of the most important patterns: deriving a union type
// from a const array so you have a single source of truth.
const myFruit: Fruit = "apple";       // any string works
const myVeg: Vegetable = "carrot";    // only "carrot" | "broccoli" | "spinach"
// const badVeg: Vegetable = "potato"; // Error!

console.log("Challenge 8:", myFruit, myVeg);


// -----------------------------------------------------------
// Solution 9: Template Literal Types
// Template literal types use backtick syntax at the type level
// to construct new string literal types from existing ones.
// -----------------------------------------------------------

// a) CSSUnit: a number followed by "px", "em", or "rem"
//    ${number} matches any numeric literal in the string
type CSSUnit = `${number}px` | `${number}em` | `${number}rem`;

const width: CSSUnit = "100px";     // OK
const margin: CSSUnit = "1.5rem";   // OK
const padding: CSSUnit = "2em";     // OK
// const bad: CSSUnit = "10vh";     // Error: not assignable to CSSUnit

// b) ApiEndpoint: any string starting with "/api/"
type ApiEndpoint = `/api/${string}`;

const usersEndpoint: ApiEndpoint = "/api/users";       // OK
const productsEndpoint: ApiEndpoint = "/api/products";  // OK
// const badEndpoint: ApiEndpoint = "/v2/users";         // Error

// c) EventHandler using cartesian product of two unions
//    TypeScript automatically expands all combinations
type Action = "click" | "hover" | "focus";
type Target = "button" | "input";
type EventHandler = `${Action}:${Target}`;
// Result: "click:button" | "click:input" | "hover:button" | "hover:input" | "focus:button" | "focus:input"

const handler1: EventHandler = "click:button";  // OK
const handler2: EventHandler = "hover:input";   // OK
// const handler3: EventHandler = "drag:button"; // Error: "drag" is not in Action

console.log("Challenge 9:", width, usersEndpoint, handler1);


// -----------------------------------------------------------
// Solution 10: Generic Function with keyof and Indexed Access
// This is the canonical pattern that everything in this topic
// builds toward. The function uses:
// - Generics (T and K) from Topic 04
// - keyof T to constrain K to valid keys
// - T[K] as the return type for precise type inference
//
// This is exactly how TypeScript's built-in utility types work.
// -----------------------------------------------------------

const sampleProduct = {
  id: 101,
  name: "Keyboard",
  price: 79.99,
  inStock: true,
};

// The generic function 'pluck':
// - T is inferred from the object you pass in
// - K is constrained to keyof T (only valid property names)
// - The return type T[K] means TypeScript knows the EXACT type
//   of the returned value based on which key you pass
function pluck<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// TypeScript infers the return types precisely:
const productName = pluck(sampleProduct, "name");      // type: string
const productPrice = pluck(sampleProduct, "price");    // type: number
const productStock = pluck(sampleProduct, "inStock");  // type: boolean
const productId = pluck(sampleProduct, "id");          // type: number

// Invalid keys are caught at compile time:
// const bad = pluck(sampleProduct, "color"); // Error: '"color"' is not assignable to keyof typeof sampleProduct

console.log("Challenge 10:");
console.log("  Name:", productName);          // "Keyboard"
console.log("  Price:", productPrice);        // 79.99
console.log("  In stock:", productStock);     // true
console.log("  ID:", productId);              // 101

// Bonus: pluck works with ANY object -- the generics adapt:
const user = { firstName: "Alice", age: 30, active: true };
const userName = pluck(user, "firstName");  // type: string
const userAge = pluck(user, "age");         // type: number
console.log("  User:", userName, userAge);   // "Alice" 30


// ============================================================
// Summary
// ============================================================
// This topic covered the essential type-level operations:
//
// 1. Literal types: "success" | "error" | "pending" -- exact values as types
// 2. typeof: Extract a TypeScript type from a runtime value
// 3. keyof: Get a union of all keys from an object type
// 4. keyof typeof: Get keys from a plain object (combine both)
// 5. Indexed access T["prop"]: Look up the type of a property
// 6. as const: Deep readonly + literal types from a value
// 7. Tuples: Fixed-length arrays with per-position types
// 8. T[number]: Extract element type from array/tuple types
// 9. Template literal types: Construct string types with templates
// 10. Generic + keyof + T[K]: The pattern that powers utility types
//
// These are the BUILDING BLOCKS for mapped types, conditional
// types, and every advanced pattern in the topics that follow.
// ============================================================
