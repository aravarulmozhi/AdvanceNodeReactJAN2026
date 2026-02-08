// ============================================================
// Topic 05 - Advanced Types Prerequisites: Workout Challenges
// ============================================================
// These challenges cover the BUILDING BLOCKS for advanced types:
// literal types, keyof, typeof, indexed access, as const,
// template literal types, and tuples.
// ============================================================

// -----------------------------------------------------------
// Challenge 1: Literal Types
// Create a type called 'Status' that only allows the
// string values "success", "error", or "pending".
// Then declare a variable of that type.
// -----------------------------------------------------------

// Your code here:
// type Status = ???
// const currentStatus: Status = ???;



// -----------------------------------------------------------
// Challenge 2: typeof Operator
// Given the object below, use 'typeof' to extract its type
// into a type alias called 'ServerConfig'.
// Do NOT manually write the type -- derive it from the object.
// -----------------------------------------------------------

const serverConfig = {
  host: "localhost",
  port: 8080,
  secure: false,
  retries: 3,
};

// Your code here:
// type ServerConfig = ???



// -----------------------------------------------------------
// Challenge 3: keyof Operator
// Given the interface below, create a type 'MovieKey' that
// is a union of all its keys using keyof.
// Then write a function 'getMovieProperty' that takes a
// Movie and a MovieKey and returns the property value.
// -----------------------------------------------------------

interface Movie {
  title: string;
  director: string;
  year: number;
  rating: number;
  genre: string;
}

// Your code here:
// type MovieKey = ???
// function getMovieProperty(movie: Movie, key: ???) { ??? }



// -----------------------------------------------------------
// Challenge 4: Combining keyof and typeof
// Given the plain object below (not an interface),
// create a type 'ThemeProp' that is a union of all its keys.
// Use keyof and typeof together.
// Then create a function 'getThemeValue' that accepts only
// valid keys of the theme object.
// -----------------------------------------------------------

const theme = {
  primaryColor: "#3498db",
  secondaryColor: "#2ecc71",
  fontSize: 16,
  fontFamily: "Arial",
  borderRadius: 4,
};

// Your code here:
// type ThemeProp = ???
// function getThemeValue(prop: ???) { ??? }



// -----------------------------------------------------------
// Challenge 5: Indexed Access Types
// Given the interface below, use indexed access types to:
// a) Extract the type of the 'address' property
// b) Extract the type of the 'tags' property
// c) Extract the type of 'id' OR 'email' as a union
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

// Your code here:
// type CustomerAddress = ???
// type CustomerTags = ???
// type IdOrEmail = ???



// -----------------------------------------------------------
// Challenge 6: as const Assertions
// Create a config object using 'as const' and then:
// a) Extract the type of the 'environment' field (should be
//    a literal type, NOT just string)
// b) Extract the union of all 'allowedOrigins' values
// c) Try to modify a property and observe the error
// -----------------------------------------------------------

// Your code here:
// const appConfig = { ??? } as const;
//
// type Environment = ???
// type AllowedOrigin = ???
//
// Uncomment to test readonly:
// appConfig.environment = "production";



// -----------------------------------------------------------
// Challenge 7: Tuple Types
// a) Create a tuple type 'LogEntry' that is:
//    [string, number, ...boolean[]]
//    (a message, a timestamp, then any number of boolean flags)
// b) Create a labeled tuple 'Coordinate' with labels
//    x, y, and optional z.
// c) Create a value of each type.
// -----------------------------------------------------------

// Your code here:
// type LogEntry = ???
// type Coordinate = ???
//
// const entry: LogEntry = ???
// const point: Coordinate = ???



// -----------------------------------------------------------
// Challenge 8: Indexed Access with number
// Given the array type below, use indexed access with
// 'number' to extract the element type.
// Do the same for the 'as const' version.
// -----------------------------------------------------------

type Fruits = string[];

const vegetables = ["carrot", "broccoli", "spinach"] as const;

// Your code here:
// type Fruit = ???
// type Vegetable = ???



// -----------------------------------------------------------
// Challenge 9: Template Literal Types
// a) Create a type 'CSSUnit' that is a template literal
//    combining a number with "px" | "em" | "rem"
//    e.g. `${number}px` | `${number}em` | `${number}rem`
// b) Create a type 'ApiEndpoint' that is `/api/${string}`
// c) Create a type 'EventHandler' from combining:
//    Action = "click" | "hover" | "focus"
//    Target = "button" | "input"
//    Result: "click:button" | "click:input" | "hover:button" | etc.
// -----------------------------------------------------------

// Your code here:
// type CSSUnit = ???
// type ApiEndpoint = ???
//
// type Action = ???
// type Target = ???
// type EventHandler = ???



// -----------------------------------------------------------
// Challenge 10: Generic Function with keyof and Indexed Access
// Create a generic function called 'pluck' that:
// - Takes an object of type T
// - Takes a key of type K (constrained to keyof T)
// - Returns the value of type T[K]
//
// Then test it with the sampleProduct below.
// The return type should be correctly inferred.
// -----------------------------------------------------------

const sampleProduct = {
  id: 101,
  name: "Keyboard",
  price: 79.99,
  inStock: true,
};

// Your code here:
// function pluck<T, K extends keyof T>(obj: T, key: K): T[K] { ??? }
//
// const productName = pluck(sampleProduct, "name");     // should be string
// const productPrice = pluck(sampleProduct, "price");   // should be number
// const productStock = pluck(sampleProduct, "inStock"); // should be boolean
