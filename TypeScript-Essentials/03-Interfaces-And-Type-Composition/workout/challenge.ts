// ============================================================================
// Topic 03 - Interfaces and Type Composition :: Challenges
// ============================================================================
// Complete each challenge below. Replace 'unknown', '{}', or the blanks
// with the correct types, interfaces, and implementations.
// ============================================================================


// ---------------------------------------------------------------------------
// Challenge 1: Create an interface `Animal`
// ---------------------------------------------------------------------------
// It should have:
//   - name: string
//   - sound: string
//   - legs: number
// Then create a variable `dog` of type Animal.
// ---------------------------------------------------------------------------

// TODO: Define the Animal interface

// TODO: Create a variable `dog` that satisfies the Animal interface


// ---------------------------------------------------------------------------
// Challenge 2: Create interface `Pet` that extends `Animal`
// ---------------------------------------------------------------------------
// Pet should add:
//   - owner: string
// Create a variable `myPet` of type Pet.
// ---------------------------------------------------------------------------

// TODO: Define the Pet interface extending Animal

// TODO: Create a variable `myPet` of type Pet


// ---------------------------------------------------------------------------
// Challenge 3: Multiple inheritance -- interface `Domestic`
// ---------------------------------------------------------------------------
// First, create an interface `Trainable` with:
//   - tricks: string[]
//   - learn(trick: string): void
//
// Then create interface `Domestic` that extends BOTH `Animal` and `Trainable`.
// Add a property:
//   - indoor: boolean
//
// Create a variable `houseCat` of type Domestic.
// ---------------------------------------------------------------------------

// TODO: Define the Trainable interface

// TODO: Define the Domestic interface extending both Animal and Trainable

// TODO: Create a variable `houseCat` of type Domestic


// ---------------------------------------------------------------------------
// Challenge 4: Declaration merging
// ---------------------------------------------------------------------------
// Declare an interface `Product` with:
//   - id: number
//   - name: string
//
// Then declare the SAME interface `Product` again and add:
//   - price: number
//   - inStock: boolean
//
// Create a variable `laptop` of type Product that has ALL four properties.
// (TypeScript merges both declarations into one.)
// ---------------------------------------------------------------------------

// TODO: First Product interface declaration

// TODO: Second Product interface declaration (same name!)

// TODO: Create variable `laptop` with all merged properties


// ---------------------------------------------------------------------------
// Challenge 5: Intersection types (&)
// ---------------------------------------------------------------------------
// Create two separate type aliases:
//   type ContactInfo = { email: string; phone: string }
//   type Address     = { street: string; city: string; zip: string }
//
// Then create a type `FullContact` using intersection (&) that combines both.
// Create a variable `contact` of type FullContact.
// ---------------------------------------------------------------------------

// TODO: Define ContactInfo type

// TODO: Define Address type

// TODO: Define FullContact as an intersection

// TODO: Create variable `contact` of type FullContact


// ---------------------------------------------------------------------------
// Challenge 6: Callable interface (function type)
// ---------------------------------------------------------------------------
// Create an interface `MathOperation` that describes a function taking
// two numbers and returning a number.
//
// Then create two variables of that type: `add` and `multiply`.
// ---------------------------------------------------------------------------

// TODO: Define the MathOperation interface with a call signature

// TODO: Implement `add` using the MathOperation type

// TODO: Implement `multiply` using the MathOperation type


// ---------------------------------------------------------------------------
// Challenge 7: Class implementing an interface
// ---------------------------------------------------------------------------
// Create an interface `Describable` with:
//   - name: string
//   - describe(): string
//
// Then create a class `Car` that implements `Describable`.
// The constructor should accept name and a `year` property (number).
// describe() should return "Car: <name> (<year>)"
// ---------------------------------------------------------------------------

// TODO: Define the Describable interface

// TODO: Create class Car that implements Describable


// ---------------------------------------------------------------------------
// Challenge 8: Mixin pattern using intersection
// ---------------------------------------------------------------------------
// Create these type aliases:
//   type WithId        = { id: string }
//   type WithTimestamp  = { createdAt: Date; updatedAt: Date }
//   type WithSoftDelete = { deletedAt: Date | null; isDeleted: boolean }
//
// Create a type `BaseEntity` that intersects all three.
// Then create a type `BlogPost` that intersects BaseEntity with:
//   { title: string; content: string; authorId: string }
//
// Create a variable `post` of type BlogPost.
// ---------------------------------------------------------------------------

// TODO: Define WithId

// TODO: Define WithTimestamp

// TODO: Define WithSoftDelete

// TODO: Define BaseEntity as intersection of all three

// TODO: Define BlogPost as BaseEntity & blog-specific fields

// TODO: Create variable `post` of type BlogPost


// ---------------------------------------------------------------------------
// Challenge 9: Hybrid type (function with properties)
// ---------------------------------------------------------------------------
// Create an interface `Greeter` that is:
//   - Callable: takes (name: string) and returns string
//   - Has a property `greeting: string`
//   - Has a method `setGreeting(g: string): void`
//
// Write a factory function `createGreeter()` that returns a Greeter.
// The callable part should return `${greeting}, ${name}!`
// ---------------------------------------------------------------------------

// TODO: Define the Greeter hybrid interface

// TODO: Implement createGreeter factory function


// ---------------------------------------------------------------------------
// Challenge 10: Declaration merging with type alias (DOES NOT WORK)
// ---------------------------------------------------------------------------
// Uncomment the code below and observe the error.
// Then write a comment explaining WHY it fails.
// ---------------------------------------------------------------------------

// type Score = {
//   points: number;
// };

// type Score = {
//   grade: string;
// };

// TODO: Write a comment here explaining why the above fails
// EXPLANATION:
//
