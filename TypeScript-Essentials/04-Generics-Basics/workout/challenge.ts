// ============================================================================
// Topic 04 - Generics Basics: Workout Challenges
// ============================================================================
// Complete each challenge below. Replace every `any` with proper generic types.
// Do NOT change the test code at the bottom of each challenge.
// ============================================================================


// ----------------------------------------------------------------------------
// Challenge 1: Generic Identity Function
// ----------------------------------------------------------------------------
// Write a generic function called `identity` that takes a single argument of
// any type and returns it. The return type must match the input type exactly.
//
// Requirements:
// - The function must use a type parameter, NOT `any`.
// - Calling identity("hello") should return type `string`.
// - Calling identity(42) should return type `number`.
// ----------------------------------------------------------------------------

// Your code here:



// Test (uncomment to verify):
// const strResult = identity("hello");    // should be string
// const numResult = identity(42);         // should be number
// const boolResult = identity(true);      // should be boolean


// ----------------------------------------------------------------------------
// Challenge 2: First Element
// ----------------------------------------------------------------------------
// Write a generic function `firstElement` that accepts an array of type T
// and returns the first element. If the array is empty, return undefined.
//
// Requirements:
// - The return type should be T | undefined.
// - firstElement([1, 2, 3]) should return type number | undefined.
// - firstElement(["a", "b"]) should return type string | undefined.
// ----------------------------------------------------------------------------

// Your code here:



// Test (uncomment to verify):
// const first1 = firstElement([10, 20, 30]);      // number | undefined
// const first2 = firstElement(["a", "b", "c"]);   // string | undefined
// const first3 = firstElement([]);                 // undefined


// ----------------------------------------------------------------------------
// Challenge 3: Generic Pair Interface
// ----------------------------------------------------------------------------
// Create a generic interface `Pair<T, U>` that has two properties:
//   - first: of type T
//   - second: of type U
//
// Then create a function `makePair` that takes two arguments of potentially
// different types and returns a Pair.
// ----------------------------------------------------------------------------

// Your code here:



// Test (uncomment to verify):
// const p1: Pair<string, number> = { first: "age", second: 30 };
// const p2 = makePair("hello", true);   // Pair<string, boolean>
// const p3 = makePair(1, [2, 3]);       // Pair<number, number[]>


// ----------------------------------------------------------------------------
// Challenge 4: Generic Stack Class
// ----------------------------------------------------------------------------
// Create a generic class `Stack<T>` that implements a stack data structure.
//
// Required methods:
//   - push(item: T): void       -- adds an item to the top of the stack
//   - pop(): T | undefined      -- removes and returns the top item
//   - peek(): T | undefined     -- returns the top item without removing it
//   - isEmpty(): boolean        -- returns true if the stack has no items
//   - size(): number            -- returns the number of items in the stack
//
// Use a private array internally to store elements.
// ----------------------------------------------------------------------------

// Your code here:



// Test (uncomment to verify):
// const numStack = new Stack<number>();
// numStack.push(10);
// numStack.push(20);
// numStack.push(30);
// console.log(numStack.peek());    // 30
// console.log(numStack.pop());     // 30
// console.log(numStack.size());    // 2
// console.log(numStack.isEmpty()); // false

// const strStack = new Stack<string>();
// strStack.push("a");
// strStack.push("b");
// console.log(strStack.peek());    // "b"


// ----------------------------------------------------------------------------
// Challenge 5: Generic Constraint -- Must Have Length
// ----------------------------------------------------------------------------
// Write a generic function `logLength` that accepts an argument that MUST
// have a `.length` property of type number. The function should log the
// length and return the argument.
//
// Requirements:
// - Use `extends` to constrain the type parameter.
// - logLength("hello") should work (strings have .length).
// - logLength([1, 2, 3]) should work (arrays have .length).
// - logLength(42) should NOT compile (numbers have no .length).
// ----------------------------------------------------------------------------

// Your code here:



// Test (uncomment to verify):
// const s = logLength("hello");       // string, logs: 5
// const a = logLength([1, 2, 3]);     // number[], logs: 3
// const o = logLength({ length: 10, name: "test" }); // { length: number, name: string }
// // logLength(42);                   // ERROR: number has no .length


// ----------------------------------------------------------------------------
// Challenge 6: getProperty with keyof Constraint
// ----------------------------------------------------------------------------
// Write a generic function `getProperty` that takes:
//   - obj: an object of type T
//   - key: a key K that must be a valid key of T
//
// The function should return obj[key] with the correct specific type.
//
// Requirements:
// - Use two type parameters: T and K extends keyof T.
// - The return type should be T[K] (indexed access type).
// - getProperty({ name: "Alice", age: 30 }, "name") should return string.
// - getProperty({ name: "Alice", age: 30 }, "phone") should NOT compile.
// ----------------------------------------------------------------------------

// Your code here:



// Test (uncomment to verify):
// const person = { name: "Alice", age: 30, active: true };
// const personName = getProperty(person, "name");     // string
// const personAge = getProperty(person, "age");       // number
// const personActive = getProperty(person, "active"); // boolean
// // getProperty(person, "phone");  // ERROR: "phone" is not a key of person


// ----------------------------------------------------------------------------
// Challenge 7: Default Type Parameter
// ----------------------------------------------------------------------------
// Create a generic interface `ApiResponse<T>` where:
//   - T has a default type of `unknown`
//   - It has properties: success (boolean), data (T), timestamp (number)
//
// Then create a function `createResponse` that creates an ApiResponse.
//
// Requirements:
// - ApiResponse without a type argument should use `unknown` as the data type.
// - ApiResponse<string> should type data as string.
// ----------------------------------------------------------------------------

// Your code here:



// Test (uncomment to verify):
// const res1: ApiResponse = { success: true, data: "anything", timestamp: Date.now() };
// const res2: ApiResponse<string> = { success: true, data: "hello", timestamp: Date.now() };
// const res3: ApiResponse<number[]> = { success: true, data: [1, 2, 3], timestamp: Date.now() };
// const res4 = createResponse(true, { id: 1, name: "Test" });
// // res4.data should be typed as { id: number; name: string }


// ----------------------------------------------------------------------------
// Challenge 8: Merge Two Objects
// ----------------------------------------------------------------------------
// Write a generic function `merge` that takes two objects of different types
// and returns a new object containing all properties from both.
//
// Requirements:
// - Use two type parameters: T and U, both constrained to `object`.
// - Return type should be T & U (intersection).
// - The original objects should not be mutated.
// ----------------------------------------------------------------------------

// Your code here:



// Test (uncomment to verify):
// const obj1 = { name: "Alice" };
// const obj2 = { age: 30, active: true };
// const merged = merge(obj1, obj2);
// // merged should be: { name: string } & { age: number; active: boolean }
// console.log(merged.name);    // "Alice"
// console.log(merged.age);     // 30
// console.log(merged.active);  // true


// ----------------------------------------------------------------------------
// Challenge 9: Generic Dictionary Class
// ----------------------------------------------------------------------------
// Create a generic class `Dictionary<T>` that acts as a string-keyed map.
//
// Required methods:
//   - set(key: string, value: T): void   -- adds or updates a key-value pair
//   - get(key: string): T | undefined    -- retrieves the value for a key
//   - has(key: string): boolean          -- checks if a key exists
//   - remove(key: string): boolean       -- removes a key, returns true if it existed
//   - keys(): string[]                   -- returns all keys
//   - values(): T[]                      -- returns all values
//   - size(): number                     -- returns the number of entries
//
// Use a plain object or Map internally.
// ----------------------------------------------------------------------------

// Your code here:



// Test (uncomment to verify):
// const dict = new Dictionary<number>();
// dict.set("apples", 5);
// dict.set("bananas", 3);
// dict.set("cherries", 12);
// console.log(dict.get("apples"));     // 5
// console.log(dict.has("bananas"));    // true
// console.log(dict.has("grapes"));     // false
// console.log(dict.size());            // 3
// dict.remove("bananas");
// console.log(dict.size());            // 2
// console.log(dict.keys());            // ["apples", "cherries"]
// console.log(dict.values());          // [5, 12]

// const strDict = new Dictionary<string>();
// strDict.set("greeting", "hello");
// console.log(strDict.get("greeting")); // "hello"


// ----------------------------------------------------------------------------
// Challenge 10: Generic Filter Function
// ----------------------------------------------------------------------------
// Write a generic function `filter` that:
//   - Takes an array of type T
//   - Takes a predicate function (item: T) => boolean
//   - Returns a new array of type T containing only elements where predicate is true
//
// Do NOT use Array.prototype.filter -- implement it manually with a for loop
// or forEach to practice.
//
// Requirements:
// - The returned array must have the same type as the input array's elements.
// - The predicate must be typed to receive items of type T.
// ----------------------------------------------------------------------------

// Your code here:



// Test (uncomment to verify):
// const evens = filter([1, 2, 3, 4, 5, 6], (n) => n % 2 === 0);
// console.log(evens);  // [2, 4, 6]  -- type: number[]

// const longStrings = filter(["hi", "hello", "hey", "howdy"], (s) => s.length > 3);
// console.log(longStrings);  // ["hello", "howdy"]  -- type: string[]

// interface Product { name: string; price: number; }
// const products: Product[] = [
//   { name: "Book", price: 10 },
//   { name: "Phone", price: 999 },
//   { name: "Pen", price: 2 },
// ];
// const expensive = filter(products, (p) => p.price > 50);
// console.log(expensive);  // [{ name: "Phone", price: 999 }]  -- type: Product[]
