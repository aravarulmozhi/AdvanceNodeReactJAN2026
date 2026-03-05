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