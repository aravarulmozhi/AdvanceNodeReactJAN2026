/**
 * PROBLEM: Tight Coupling for Event Handling
 * 
 * Scenario: You have a task management system where status changes
 * need to trigger multiple actions (send email, log to audit, update dashboard).
 * Without the Observer pattern, the TaskService becomes tightly coupled
 * to every single side effect, making it hard to add or remove features.
 */

// === Types ===
interface Task {
    id: string;
    title: string;
    status: string;
    assignee: string;
}

// === Individual "Handler" Classes ===
class EmailService {
    sendStatusChangeEmail(task: Task, oldStatus: string, newStatus: string): void {
        console.log(`📧 EMAIL: Task "${task.title}" changed from ${oldStatus} to ${newStatus}`);
        console.log(`   Sending to: ${task.assignee}@company.com`);
    }
}

class AuditLogger {
    logStatusChange(task: Task, oldStatus: string, newStatus: string): void {
        console.log(`📝 AUDIT LOG: [${new Date().toISOString()}] Task ${task.id}: ${oldStatus} → ${newStatus}`);
    }
}

class DashboardService {
    updateTaskMetrics(task: Task, newStatus: string): void {
        console.log(`📊 DASHBOARD: Updating metrics for status: ${newStatus}`);
    }
}

class SlackNotifier {
    postToChannel(task: Task, oldStatus: string, newStatus: string): void {
        console.log(`💬 SLACK: #tasks - "${task.title}" is now ${newStatus}`);
    }
}

class AnalyticsService {
    trackStatusChange(task: Task, oldStatus: string, newStatus: string): void {
        console.log(`📈 ANALYTICS: Tracking status change event for task ${task.id}`);
    }
}

// === TaskService - Tightly Coupled to ALL Dependencies (BAD!) ===
class TaskService {
    private tasks: Task[] = [];
    
    // ❌ PROBLEM: TaskService knows about ALL dependent services
    private emailService: EmailService;
    private auditLogger: AuditLogger;
    private dashboardService: DashboardService;
    private slackNotifier: SlackNotifier;
    private analyticsService: AnalyticsService;

    constructor() {
        // ❌ PROBLEM: Creating all dependencies manually
        this.emailService = new EmailService();
        this.auditLogger = new AuditLogger();
        this.dashboardService = new DashboardService();
        this.slackNotifier = new SlackNotifier();
        this.analyticsService = new AnalyticsService();
    }

    createTask(title: string, assignee: string): Task {
        const task: Task = {
            id: String(Date.now()),
            title,
            status: "todo",
            assignee
        };
        this.tasks.push(task);
        return task;
    }

    // ❌ PROBLEM: This method has to call EVERY dependent service manually!
    updateTaskStatus(taskId: string, newStatus: string): Task | null {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return null;

        const oldStatus = task.status;
        task.status = newStatus;

        console.log(`\n--- Status Update: ${oldStatus} → ${newStatus} ---`);

        // ❌ PROBLEM: Adding a new listener requires modifying this class
        this.emailService.sendStatusChangeEmail(task, oldStatus, newStatus);
        
        // ❌ PROBLEM: Can't conditionally enable/disable listeners
        this.auditLogger.logStatusChange(task, oldStatus, newStatus);
        
        // ❌ PROBLEM: What if dashboard is down? The whole update might fail!
        this.dashboardService.updateTaskMetrics(task, newStatus);
        
        // ❌ PROBLEM: Want to add WebSocket notifications? Edit this method again!
        this.slackNotifier.postToChannel(task, oldStatus, newStatus);
        
        // ❌ PROBLEM: Order of execution is hardcoded
        this.analyticsService.trackStatusChange(task, oldStatus, newStatus);

        return task;
    }

    // ❌ PROBLEM: Every action that needs notifications has the same issue
    completeTask(taskId: string): Task | null {
        return this.updateTaskStatus(taskId, "completed");
    }
}

// === AnotherService - Wants same notifications? Duplicate all the code! ===
class ProjectService {
    private emailService: EmailService;
    private auditLogger: AuditLogger;
    // ... ❌ PROBLEM: Same dependencies duplicated!

    constructor() {
        this.emailService = new EmailService();
        this.auditLogger = new AuditLogger();
    }

    // ❌ PROBLEM: If we want notifications here too, we duplicate ALL the calls
    archiveProject(projectId: string): void {
        console.log(`Archiving project ${projectId}`);
        // Need to manually call each service here too...
    }
}

// Run this to see the problem
console.log("=== THE PROBLEM: Tight Coupling Without Observer Pattern ===\n");

const taskService = new TaskService();

// Create a task
const task = taskService.createTask("Implement login feature", "john.doe");
console.log("Created task:", task);

// Update status - triggers ALL the coupled services
taskService.updateTaskStatus(task.id, "in-progress");
taskService.updateTaskStatus(task.id, "review");
taskService.updateTaskStatus(task.id, "completed");

console.log("\n=== PROBLEMS WITH THIS APPROACH ===\n");
console.log("❌ PROBLEM 1: TaskService is tightly coupled to 5+ different services");
console.log("❌ PROBLEM 2: Adding a new listener (WebSocket?) requires modifying TaskService");
console.log("❌ PROBLEM 3: Removing a listener requires modifying TaskService");
console.log("❌ PROBLEM 4: Can't dynamically add/remove listeners at runtime");
console.log("❌ PROBLEM 5: Can't easily test TaskService in isolation");
console.log("❌ PROBLEM 6: If one listener fails, it might break the whole operation");
console.log("❌ PROBLEM 7: Other services wanting same notifications must duplicate code");
console.log("❌ PROBLEM 8: Violates Single Responsibility - TaskService does too much");
console.log("❌ PROBLEM 9: Violates Open/Closed - Must modify class to extend behavior");

export { TaskService, ProjectService };
