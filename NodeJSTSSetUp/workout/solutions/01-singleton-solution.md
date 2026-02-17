# Solution 1: Singleton Pattern

---

## Complete Implementation

```typescript
// src/patterns/singleton/DatabaseConnection.ts

class DatabaseConnection {
  private static instance: DatabaseConnection;
  private connectionString: string;
  private isConnected: boolean = false;

  // Private constructor prevents direct instantiation
  private constructor() {
    this.connectionString = 'mongodb://localhost:27017/taskmanager';
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

  public disconnect(): void {
    console.log('Disconnecting from database...');
    this.isConnected = false;
  }
}

export default DatabaseConnection;
```

---

## Usage Example

```typescript
// test-singleton.ts

import DatabaseConnection from './patterns/singleton/DatabaseConnection';

// Test that both variables reference the same instance
const db1 = DatabaseConnection.getInstance();
const db2 = DatabaseConnection.getInstance();

console.log('Same instance:', db1 === db2); // true

// Use the singleton
db1.query('SELECT * FROM tasks');
db2.query('INSERT INTO tasks VALUES (...)');

console.log('Status:', db1.status()); // true
```

---

## Output

```
Creating new database instance...
Connecting to: mongodb://localhost:27017/taskmanager
Same instance: true
Executing query: SELECT * FROM tasks
Executing query: INSERT INTO tasks VALUES (...)
Status: true
```

---

## Key Points

1. **Private constructor** - Prevents `new DatabaseConnection()`
2. **Static instance** - Stores the single instance
3. **Lazy initialization** - Instance created on first `getInstance()` call
4. **Thread safety** - Not an issue in single-threaded Node.js

---

## Bonus: Logger Singleton

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
    const entry = `[${new Date().toISOString()}] ${message}`;
    this.logs.push(entry);
    console.log(entry);
  }

  public getLogs(): string[] {
    return [...this.logs];
  }
}

export default Logger;
```

---

**Challenge:** [01-singleton-challenge.md](../challenge/01-singleton-challenge.md)
