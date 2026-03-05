# Problem: Singleton Pattern - Multiple Database Connections

## Project Setup

### Step 1: Initialize Node.js Project
```bash
mkdir singleton-problem && cd singleton-problem
npm init -y
npm install --save-dev typescript ts-node @types/node
```

### Step 2: Create tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### Step 3: Create Project Structure
```
singleton-problem/
├── src/
│   └── problem.ts
├── package.json
└── tsconfig.json
```

### Step 4: Running the Code
```bash
# Option 1: Using ts-node (for development)
npx ts-node src/problem.ts

# Option 2: Compile and run
npm run build
node dist/problem.js
```

Update your package.json scripts:
```json
{
  "scripts": {
    "build": "tsc",
    "start": "ts-node src/problem.ts",
    "dev": "watch-ts-node src/problem.ts"
  }
}
```

---

## The Problem

Save this code in `src/problem.ts`:

```typescript
# Problem: Singleton Pattern - Multiple Database Connections

## Node.js Project Setup

### Quick Start
```bash
mkdir singleton-problem && cd singleton-problem
npm init -y
npm install --save-dev typescript ts-node @types/node
```

### Create tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
  }
}
```

### Add to package.json scripts
```json
{
  "scripts": {
    "build": "tsc",
    "start": "ts-node src/problem.ts",
    "dev": "ts-node src/problem.ts"
  }
}
```

### Run Code
```bash
cp -r src/ && npm start
```

---

## The Problem

Save this code in `src/problem.ts` and run `npm start`:

```typescript
/**
 * PROBLEM: Multiple Database Connections
 * 
 * Scenario: You have multiple modules in your Node.js app,
 * each creating its own database connection.
 * This wastes resources and can cause connection pool exhaustion.
 */

// === userService.ts ===
class DatabaseConnection {
    private host: string;
    private connectionId: number;

    constructor(host: string) {
        this.host = host;
        this.connectionId = Math.random();
        console.log(`Creating NEW database connection: ${this.connectionId}`);
        // Imagine: Actual database connection happening here
        // This is EXPENSIVE!
    }

    query(sql: string): void {
        console.log(`[Connection ${this.connectionId}] Executing: ${sql}`);
    }
}

// In userService.ts
const userDb = new DatabaseConnection("localhost");

function getUsers() {
    userDb.query("SELECT * FROM users");
}

// In orderService.ts - ANOTHER connection!
const orderDb = new DatabaseConnection("localhost");

function getOrders() {
    orderDb.query("SELECT * FROM orders");
}

// In productService.ts - YET ANOTHER connection!
const productDb = new DatabaseConnection("localhost");

function getProducts() {
    productDb.query("SELECT * FROM products");
}

// Run this to see the problem
console.log("=== THE PROBLEM: Multiple Connections ===");
getUsers();
getOrders();
getProducts();

console.log("\n❌ PROBLEM: We created 3 separate connections!");
console.log("❌ Each connection wastes memory and resources");
console.log("❌ In production, you might exhaust connection pool");

export { getUsers, getOrders, getProducts };