// ============================================================================
// Topic 03 - Interfaces and Type Composition :: Solutions
// ============================================================================


// ---------------------------------------------------------------------------
// Challenge 1: Create an interface `Animal`
// ---------------------------------------------------------------------------
// The interface defines the shape every Animal object must have.
// All three properties are required.
// ---------------------------------------------------------------------------

interface Animal {
  name: string;
  sound: string;
  legs: number;
}

const dog: Animal = {
  name: "Buddy",
  sound: "Woof",
  legs: 4,
};

console.log("Challenge 1:", dog);


// ---------------------------------------------------------------------------
// Challenge 2: Create interface `Pet` that extends `Animal`
// ---------------------------------------------------------------------------
// `extends` means Pet inherits all properties from Animal
// and adds its own (owner). A Pet IS an Animal plus more.
// ---------------------------------------------------------------------------

interface Pet extends Animal {
  owner: string;
}

const myPet: Pet = {
  name: "Whiskers",
  sound: "Meow",
  legs: 4,
  owner: "Alice",
};

console.log("Challenge 2:", myPet);


// ---------------------------------------------------------------------------
// Challenge 3: Multiple inheritance -- interface `Domestic`
// ---------------------------------------------------------------------------
// TypeScript interfaces support extending MULTIPLE interfaces at once.
// Domestic gets everything from Animal AND Trainable, plus its own `indoor`.
// ---------------------------------------------------------------------------

interface Trainable {
  tricks: string[];
  learn(trick: string): void;
}

interface Domestic extends Animal, Trainable {
  indoor: boolean;
}

const houseCat: Domestic = {
  name: "Mittens",
  sound: "Purr",
  legs: 4,
  tricks: ["sit", "high-five"],
  learn(trick: string): void {
    this.tricks.push(trick);
    console.log(`${this.name} learned "${trick}"!`);
  },
  indoor: true,
};

console.log("Challenge 3:", houseCat.name, "knows", houseCat.tricks);
houseCat.learn("roll over");
console.log("Challenge 3 (after learning):", houseCat.tricks);


// ---------------------------------------------------------------------------
// Challenge 4: Declaration merging
// ---------------------------------------------------------------------------
// When you declare the same interface name twice, TypeScript MERGES them.
// The final Product interface contains ALL properties from both declarations.
// This is a feature unique to interfaces -- type aliases cannot do this.
// ---------------------------------------------------------------------------

interface Product {
  id: number;
  name: string;
}

interface Product {
  price: number;
  inStock: boolean;
}

// TypeScript sees Product as having all four properties:
const laptop: Product = {
  id: 1,
  name: "MacBook Pro",
  price: 2499.99,
  inStock: true,
};

console.log("Challenge 4:", laptop);


// ---------------------------------------------------------------------------
// Challenge 5: Intersection types (&)
// ---------------------------------------------------------------------------
// The & operator creates a type that has ALL properties from every
// constituent type. It's the type-level equivalent of "AND".
// Unlike `extends`, intersections work with type aliases.
// ---------------------------------------------------------------------------

type ContactInfo = {
  email: string;
  phone: string;
};

type Address = {
  street: string;
  city: string;
  zip: string;
};

type FullContact = ContactInfo & Address;

const contact: FullContact = {
  email: "bob@example.com",
  phone: "555-1234",
  street: "123 Main St",
  city: "Springfield",
  zip: "62701",
};

console.log("Challenge 5:", contact);


// ---------------------------------------------------------------------------
// Challenge 6: Callable interface (function type)
// ---------------------------------------------------------------------------
// An interface can describe a function's shape using a call signature.
// The syntax is: (param1: Type1, param2: Type2): ReturnType
// This is equivalent to: type MathOperation = (a: number, b: number) => number
// ---------------------------------------------------------------------------

interface MathOperation {
  (a: number, b: number): number;
}

const add: MathOperation = (a, b) => a + b;

const multiply: MathOperation = (a, b) => a * b;

console.log("Challenge 6 - add(3, 4):", add(3, 4));           // 7
console.log("Challenge 6 - multiply(3, 4):", multiply(3, 4)); // 12


// ---------------------------------------------------------------------------
// Challenge 7: Class implementing an interface
// ---------------------------------------------------------------------------
// The `implements` keyword tells TypeScript that the class promises to
// provide everything the interface requires. If the class is missing
// any property or method, TypeScript reports a compile-time error.
// Note: `implements` does NOT auto-add anything -- you must write it all.
// ---------------------------------------------------------------------------

interface Describable {
  name: string;
  describe(): string;
}

class Car implements Describable {
  name: string;
  year: number;

  constructor(name: string, year: number) {
    this.name = name;
    this.year = year;
  }

  describe(): string {
    return `Car: ${this.name} (${this.year})`;
  }
}

const myCar = new Car("Toyota Camry", 2024);
console.log("Challenge 7:", myCar.describe()); // "Car: Toyota Camry (2024)"


// ---------------------------------------------------------------------------
// Challenge 8: Mixin pattern using intersection
// ---------------------------------------------------------------------------
// The mixin pattern builds complex types by intersecting small, focused
// building blocks. Each "mixin" type adds a specific capability.
// This promotes reuse -- you can mix-and-match for different entities.
// ---------------------------------------------------------------------------

type WithId = {
  id: string;
};

type WithTimestamp = {
  createdAt: Date;
  updatedAt: Date;
};

type WithSoftDelete = {
  deletedAt: Date | null;
  isDeleted: boolean;
};

// BaseEntity combines all three foundational mixins
type BaseEntity = WithId & WithTimestamp & WithSoftDelete;

// BlogPost adds domain-specific fields on top of BaseEntity
type BlogPost = BaseEntity & {
  title: string;
  content: string;
  authorId: string;
};

const post: BlogPost = {
  id: "post-001",
  createdAt: new Date("2026-01-15"),
  updatedAt: new Date("2026-02-01"),
  deletedAt: null,
  isDeleted: false,
  title: "Understanding TypeScript Interfaces",
  content: "Interfaces are a powerful way to define contracts...",
  authorId: "user-42",
};

console.log("Challenge 8:", post.title, "by", post.authorId);


// ---------------------------------------------------------------------------
// Challenge 9: Hybrid type (function with properties)
// ---------------------------------------------------------------------------
// A hybrid type is both callable (like a function) and has properties/methods
// (like an object). This pattern is common in JS libraries (e.g., Express,
// Axios). We define it with an interface that has a call signature AND
// regular properties.
// ---------------------------------------------------------------------------

interface Greeter {
  (name: string): string;       // call signature
  greeting: string;             // property
  setGreeting(g: string): void; // method
}

function createGreeter(): Greeter {
  // Create the function that will be our hybrid object
  const greeter = function (name: string): string {
    return `${greeter.greeting}, ${name}!`;
  } as Greeter;

  // Attach properties and methods
  greeter.greeting = "Hello";
  greeter.setGreeting = function (g: string): void {
    greeter.greeting = g;
  };

  return greeter;
}

const greet = createGreeter();
console.log("Challenge 9:", greet("Alice"));           // "Hello, Alice!"
greet.setGreeting("Howdy");
console.log("Challenge 9:", greet("Bob"));             // "Howdy, Bob!"
console.log("Challenge 9 greeting:", greet.greeting);  // "Howdy"


// ---------------------------------------------------------------------------
// Challenge 10: Declaration merging with type alias (DOES NOT WORK)
// ---------------------------------------------------------------------------
// Uncomment the block below to see the error:
//
// type Score = {
//   points: number;
// };
//
// type Score = {
//   grade: string;
// };
//
// EXPLANATION:
// Type aliases do NOT support declaration merging. When you declare a
// `type` with the same name twice, TypeScript raises the error:
//   "Duplicate identifier 'Score'."
//
// This is a fundamental difference between `interface` and `type`:
//   - Interfaces with the same name MERGE their declarations automatically.
//   - Type aliases with the same name cause a compile error.
//
// If you need the combined shape, use intersection instead:
//   type ScoreA = { points: number };
//   type ScoreB = { grade: string };
//   type Score  = ScoreA & ScoreB;
//
// Or switch to an interface, which supports merging natively.
// ---------------------------------------------------------------------------

// Demonstrating the intersection alternative:
type ScorePoints = { points: number };
type ScoreGrade = { grade: string };
type Score = ScorePoints & ScoreGrade;

const examResult: Score = {
  points: 95,
  grade: "A",
};

console.log("Challenge 10:", examResult);
