/**
 * PROBLEM: Direct Data Access in Business Logic
 * 
 * Scenario: Your service layer directly accesses the database/data store.
 * This tightly couples business logic to a specific data storage implementation,
 * making it impossible to switch databases or write proper unit tests.
 */

// === Types ===
interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

// === Simulated MongoDB-like Database ===
const mongoDatabase: { users: User[] } = {
    users: [
        { id: "1", name: "John Doe", email: "john@example.com", role: "admin" },
        { id: "2", name: "Jane Smith", email: "jane@example.com", role: "user" },
        { id: "3", name: "Bob Wilson", email: "bob@example.com", role: "user" }
    ]
};

// === userService.ts - Directly accessing database (BAD!) ===
class UserService {
    // ❌ PROBLEM: MongoDB queries directly in service
    async getAllUsers(): Promise<User[]> {
        console.log("UserService: Directly querying MongoDB...");
        // Imagine this is a real MongoDB query
        return mongoDatabase.users;
    }

    // ❌ PROBLEM: Data access logic mixed with business logic
    async getUserById(id: string): Promise<User | null> {
        console.log(`UserService: MongoDB.find({ id: "${id}" })`);
        return mongoDatabase.users.find(u => u.id === id) || null;
    }

    // ❌ PROBLEM: Business validation mixed with data operations
    async createUser(userData: Omit<User, "id">): Promise<User> {
        console.log("UserService: Directly inserting into MongoDB...");
        
        // Business logic
        if (!userData.email.includes("@")) {
            throw new Error("Invalid email");
        }
        
        // Data access - tightly coupled to MongoDB structure
        const newUser: User = {
            id: String(Date.now()),
            ...userData
        };
        mongoDatabase.users.push(newUser);
        return newUser;
    }

    // ❌ PROBLEM: MongoDB-specific queries embedded in service
    async findUsersByRole(role: string): Promise<User[]> {
        console.log(`UserService: MongoDB.find({ role: "${role}" })`);
        return mongoDatabase.users.filter(u => u.role === role);
    }
}

// === orderService.ts - Same problems repeated! ===
interface Order {
    id: string;
    userId: string;
    total: number;
    status: string;
}

const orderDatabase: { orders: Order[] } = {
    orders: [
        { id: "o1", userId: "1", total: 99.99, status: "completed" },
        { id: "o2", userId: "2", total: 149.99, status: "pending" }
    ]
};

class OrderService {
    // ❌ PROBLEM: Another service with direct DB access
    async getOrdersForUser(userId: string): Promise<Order[]> {
        console.log(`OrderService: Directly querying order database...`);
        
        // ❌ PROBLEM: Can't easily switch from MongoDB to PostgreSQL
        return orderDatabase.orders.filter(o => o.userId === userId);
    }

    // ❌ PROBLEM: Query logic duplicated and scattered
    async getPendingOrders(): Promise<Order[]> {
        console.log("OrderService: MongoDB.find({ status: 'pending' })");
        return orderDatabase.orders.filter(o => o.status === "pending");
    }
}

// === reportService.ts - Cross-cutting concerns make it worse! ===
class ReportService {
    // ❌ PROBLEM: Complex queries that span multiple "databases"
    async getUserOrderReport(userId: string): Promise<any> {
        console.log("ReportService: Running complex cross-database query...");
        
        // Direct access to user database
        const user = mongoDatabase.users.find(u => u.id === userId);
        
        // Direct access to order database
        const orders = orderDatabase.orders.filter(o => o.userId === userId);
        
        // ❌ PROBLEM: What if users are in MongoDB and orders are in PostgreSQL?
        // This code would need complete rewrite!
        
        return {
            user,
            orders,
            totalSpent: orders.reduce((sum, o) => sum + o.total, 0)
        };
    }
}

// Run this to see the problem
console.log("=== THE PROBLEM: Direct Data Access Without Repository ===\n");

const userService = new UserService();
const orderService = new OrderService();
const reportService = new ReportService();

async function demonstrateProblem() {
    console.log("--- UserService Operations ---");
    await userService.getAllUsers();
    await userService.getUserById("1");
    await userService.findUsersByRole("admin");

    console.log("\n--- OrderService Operations ---");
    await orderService.getOrdersForUser("1");
    await orderService.getPendingOrders();

    console.log("\n--- ReportService Operations ---");
    await reportService.getUserOrderReport("1");

    console.log("\n❌ PROBLEM 1: Services are tightly coupled to MongoDB");
    console.log("❌ PROBLEM 2: Can't switch to PostgreSQL without rewriting ALL services");
    console.log("❌ PROBLEM 3: Can't unit test services - they need a real database");
    console.log("❌ PROBLEM 4: Query logic is duplicated across services");
    console.log("❌ PROBLEM 5: No abstraction - changes ripple through entire codebase");
    console.log("❌ PROBLEM 6: Database schema changes break business logic");
    console.log("❌ PROBLEM 7: Can't use different data sources for different environments");
}

demonstrateProblem();

export { UserService, OrderService, ReportService };
