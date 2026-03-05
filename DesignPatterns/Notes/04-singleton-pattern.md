# Chapter 4: Singleton Pattern

> **Category:** Creational Pattern

---

## What is Singleton?

The Singleton pattern ensures a class has **only one instance** and provides a **global point of access** to it.

---

## When to Use

- Database connection pools
- Logger services
- Configuration managers
- Caching systems
- Thread pools

---

## Structure

```
┌─────────────────────────────┐
│         Singleton           │
├─────────────────────────────┤
│ - static instance: Singleton│
│ - constructor()  [private]  │
├─────────────────────────────┤
│ + static getInstance()      │
│ + businessMethod()          │
└─────────────────────────────┘
```

---

## Implementation in TypeScript

```typescript
class DatabaseConnection {
  private static instance: DatabaseConnection;
  private connectionString: string;
  private isConnected: boolean = false;

  // Private constructor prevents direct instantiation
  private constructor() {
    this.connectionString = 'mongodb://localhost:27017/mydb';
    this.connect();
  }

  // Static method to get the single instance
  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      console.log('Creating new database instance...');
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  private connect(): void {
    console.log(`Connecting to: ${this.connectionString}`);
    this.isConnected = true;
  }

  public query(sql: string): void {
    if (!this.isConnected) {
      throw new Error('Database not connected');
    }
    console.log(`Executing query: ${sql}`);
  }

  public getConnectionString(): string {
    return this.connectionString;
  }

  public status(): boolean {
    return this.isConnected;
  }
}

export default DatabaseConnection;
```

---

## Usage Example

```typescript
// Both variables reference the SAME instance
const db1 = DatabaseConnection.getInstance();
const db2 = DatabaseConnection.getInstance();

console.log(db1 === db2); // true

db1.query('SELECT * FROM users');
db2.query('SELECT * FROM products');
```

---

## Real-World Example: Logger

```typescript
class Logger {
  private static instance: Logger;
  private logs: string[] = [];

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public log(message: string): void {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}`;
    this.logs.push(logEntry);
    console.log(logEntry);
  }

  public error(message: string): void {
    this.log(`ERROR: ${message}`);
  }

  public getLogs(): string[] {
    return [...this.logs];
  }
}

export default Logger;
```

---

## Pros and Cons

### ✅ Pros
- Controlled access to sole instance
- Reduced namespace pollution
- Permits refinement of operations
- Lazy initialization possible

### ❌ Cons
- Can make unit testing difficult
- Violates Single Responsibility Principle
- Can hide dependencies
- Not thread-safe by default (in some languages)

---

## Best Practices

1. **Use for truly global resources** - Don't overuse
2. **Consider dependency injection** - For better testability
3. **Be careful with state** - Shared state can cause issues
4. **Thread safety** - Consider concurrent access

---

**Previous:** [Types of Patterns](03-types-of-design-patterns.md) | **Next:** [Factory Pattern](05-factory-pattern.md)
