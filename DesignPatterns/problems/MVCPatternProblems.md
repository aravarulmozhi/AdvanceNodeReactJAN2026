/**
 * PROBLEM: Mixed Concerns - No Separation Between Data, Logic, and Presentation
 * 
 * Scenario: You have a task management API where everything is crammed
 * into route handlers. Business logic, data access, and response formatting
 * are all mixed together. This makes the code hard to test, maintain, and scale.
 */

// === Types ===
interface Task {
    id: string;
    title: string;
    description: string;
    status: string;
    createdAt: Date;
}

// === Simulated Database ===
const tasks: Task[] = [];
let nextId = 1;

// === ALL-IN-ONE Route Handler (The Messy Way) ===

// ❌ PROBLEM: Everything in one place!
function handleCreateTask(req: any, res: any): void {
    console.log("=== handleCreateTask - The Messy Way ===");
    
    // Validation logic mixed in route handler
    if (!req.body.title) {
        res.status(400).json({ error: "Title is required" });
        return;
    }

    if (req.body.title.length < 3) {
        res.status(400).json({ error: "Title must be at least 3 characters" });
        return;
    }

    // Business logic mixed in
    const newTask: Task = {
        id: String(nextId++),
        title: req.body.title,
        description: req.body.description || "",
        status: "todo",
        createdAt: new Date()
    };

    // Data access directly in handler
    tasks.push(newTask);

    // Response formatting mixed with everything else
    res.status(201).json({
        success: true,
        message: "Task created",
        data: {
            id: newTask.id,
            title: newTask.title,
            description: newTask.description,
            status: newTask.status,
            created: newTask.createdAt.toISOString()
        }
    });
}

// ❌ PROBLEM: Another messy handler with duplicated patterns
function handleGetAllTasks(req: any, res: any): void {
    console.log("=== handleGetAllTasks - The Messy Way ===");
    
    // Filtering logic mixed in
    let filteredTasks = [...tasks];
    
    if (req.query.status) {
        filteredTasks = filteredTasks.filter(t => t.status === req.query.status);
    }

    // Response formatting duplicated
    res.status(200).json({
        success: true,
        count: filteredTasks.length,
        data: filteredTasks.map(t => ({
            id: t.id,
            title: t.title,
            description: t.description,
            status: t.status,
            created: t.createdAt.toISOString()
        }))
    });
}

// ❌ PROBLEM: Update handler with same issues
function handleUpdateTask(req: any, res: any): void {
    console.log("=== handleUpdateTask - The Messy Way ===");
    
    const taskId = req.params.id;
    
    // Data access in handler
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
        res.status(404).json({ error: "Task not found" });
        return;
    }

    // Validation duplicated
    if (req.body.title && req.body.title.length < 3) {
        res.status(400).json({ error: "Title must be at least 3 characters" });
        return;
    }

    // Business logic mixed in
    const validStatuses = ["todo", "in-progress", "completed"];
    if (req.body.status && !validStatuses.includes(req.body.status)) {
        res.status(400).json({ error: "Invalid status" });
        return;
    }

    // Direct data manipulation
    tasks[taskIndex] = {
        ...tasks[taskIndex],
        ...req.body
    };

    // Response formatting duplicated AGAIN
    res.status(200).json({
        success: true,
        data: {
            id: tasks[taskIndex].id,
            title: tasks[taskIndex].title,
            description: tasks[taskIndex].description,
            status: tasks[taskIndex].status,
            created: tasks[taskIndex].createdAt.toISOString()
        }
    });
}

// ❌ PROBLEM: Delete handler - same mess
function handleDeleteTask(req: any, res: any): void {
    console.log("=== handleDeleteTask - The Messy Way ===");
    
    const taskId = req.params.id;
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
        res.status(404).json({ error: "Task not found" });
        return;
    }

    tasks.splice(taskIndex, 1);
    
    res.status(200).json({
        success: true,
        message: "Task deleted"
    });
}

// Run this to see the problem
console.log("=== THE PROBLEM: No MVC Separation ===\n");

// Simulating Express-like request/response objects
const mockReq = {
    body: { title: "My Task", description: "Do something" },
    params: { id: "1" },
    query: {}
};

const mockRes = {
    statusCode: 200,
    status(code: number) { 
        this.statusCode = code; 
        return this; 
    },
    json(data: any) { 
        console.log(`Response (${this.statusCode}):`, JSON.stringify(data, null, 2)); 
    }
};

handleCreateTask(mockReq, mockRes);

console.log("\n❌ PROBLEM 1: Validation logic duplicated in every handler");
console.log("❌ PROBLEM 2: Business logic scattered across route handlers");
console.log("❌ PROBLEM 3: Data access code mixed with HTTP handling");
console.log("❌ PROBLEM 4: Response formatting repeated everywhere");
console.log("❌ PROBLEM 5: Can't unit test business logic without HTTP mocking");
console.log("❌ PROBLEM 6: Changes to data structure require updating multiple handlers");
console.log("❌ PROBLEM 7: No reusability - can't use the same logic elsewhere");

export { handleCreateTask, handleGetAllTasks, handleUpdateTask, handleDeleteTask };
