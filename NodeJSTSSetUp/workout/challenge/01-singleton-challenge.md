# Challenge 1: Singleton Pattern

> **Difficulty:** ⭐ Easy  
> **Estimated Time:** 30 minutes

---

## Objective

Create a database connection manager using the Singleton pattern.

---

## Requirements

1. Create a `DatabaseConnection` class that ensures only one instance exists
2. The instance should store a mock connection string
3. Add a method `query(sql: string)` that logs the query being executed
4. Add a method `status()` that returns connection status
5. Demonstrate that multiple imports return the same instance

---

## Acceptance Criteria

```typescript
const db1 = DatabaseConnection.getInstance();
const db2 = DatabaseConnection.getInstance();

console.log(db1 === db2); // Should print: true

db1.query('SELECT * FROM users');
// Should print: "Executing query: SELECT * FROM users"

console.log(db1.status()); // Should print: true (connected)
```

---

## File Structure

```
src/
└── patterns/
    └── singleton/
        └── DatabaseConnection.ts
```

---

## Hints

- Use a `private static instance` property
- Make the constructor private
- Create a static `getInstance()` method
- Initialize connection in the constructor

---

## Bonus Challenge

- Add connection retry logic
- Implement a `disconnect()` method
- Add connection pooling simulation

---

**Solution:** [01-singleton-solution.md](../solutions/01-singleton-solution.md)
