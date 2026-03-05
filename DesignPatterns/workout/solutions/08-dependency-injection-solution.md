# Solution 8: Dependency Injection Pattern

---

## Node.js Project Setup

### Quick Start
```bash
mkdir dependency-injection-solution && cd dependency-injection-solution
npm init -y
npm install --save-dev typescript ts-node @types/node
```

### tsconfig.json
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

### package.json Scripts
```json
{
  "scripts": {
    "build": "tsc",
    "start": "ts-node src/index.ts",
    "dev": "ts-node src/index.ts"
  }
}
```

### Directory Structure
```
src/
├── services/
│   ├── EmailService.ts
│   ├── DatabaseService.ts
│   └── NotificationService.ts
├── container/
│   └── Container.ts
└── index.ts
```

### Run Solution
```bash
npm start
```

---

## DI Container

```typescript
// src/patterns/di/DIContainer.ts

class DIContainer {
  private services: Map<string, any> = new Map();
  private singletons: Map<string, any> = new Map();

  // Register a service instance
  register<T>(key: string, service: T): void {
    this.services.set(key, service);
  }

  // Register as singleton
  registerSingleton<T>(key: string, service: T): void {
    this.singletons.set(key, service);
  }

  // Resolve a service by key
  resolve<T>(key: string): T {
    // Check singletons first
    if (this.singletons.has(key)) {
      return this.singletons.get(key);
    }

    const service = this.services.get(key);
    if (!service) {
      throw new Error(`Service '${key}' not registered in container`);
    }
    return service;
  }

  // Check if service exists
  has(key: string): boolean {
    return this.services.has(key) || this.singletons.has(key);
  }

  // List all registered services
  list(): string[] {
    return [
      ...Array.from(this.services.keys()),
      ...Array.from(this.singletons.keys()).map(k => `${k} (singleton)`)
    ];
  }
}

export { DIContainer };
```

---

## Interfaces

```typescript
// src/interfaces/ILogger.ts
export interface ILogger {
  log(message: string): void;
  error(message: string): void;
  warn(message: string): void;
}

// src/interfaces/ITaskRepository.ts
export interface ITaskRepository {
  findAll(): Promise<any[]>;
  findById(id: string): Promise<any>;
  create(data: any): Promise<any>;
  update(id: string, data: any): Promise<any>;
  delete(id: string): Promise<boolean>;
}

// src/interfaces/INotificationService.ts
export interface INotificationService {
  send(type: string, message: string, recipient: string): void;
}
```

---

## Implementations

```typescript
// src/services/Logger.ts
import { ILogger } from '../interfaces/ILogger';

export class ConsoleLogger implements ILogger {
  log(message: string): void {
    console.log(`[INFO] ${new Date().toISOString()}: ${message}`);
  }

  error(message: string): void {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`);
  }

  warn(message: string): void {
    console.warn(`[WARN] ${new Date().toISOString()}: ${message}`);
  }
}

export class FileLogger implements ILogger {
  constructor(private filePath: string) {}

  log(message: string): void {
    console.log(`[FILE:${this.filePath}] INFO: ${message}`);
  }

  error(message: string): void {
    console.log(`[FILE:${this.filePath}] ERROR: ${message}`);
  }

  warn(message: string): void {
    console.log(`[FILE:${this.filePath}] WARN: ${message}`);
  }
}
```

```typescript
// src/services/NotificationService.ts
import { INotificationService } from '../interfaces/INotificationService';
import { ILogger } from '../interfaces/ILogger';

export class NotificationService implements INotificationService {
  constructor(private logger: ILogger) {}

  send(type: string, message: string, recipient: string): void {
    this.logger.log(`Sending ${type} notification to ${recipient}: ${message}`);
    // In real app: actually send notification
  }
}
```

```typescript
// src/repositories/Task.repository.ts
import { ITaskRepository } from '../interfaces/ITaskRepository';
import { v4 as uuid } from 'uuid';

export class TaskRepository implements ITaskRepository {
  private tasks: any[] = [];

  async findAll(): Promise<any[]> {
    return [...this.tasks];
  }

  async findById(id: string): Promise<any> {
    return this.tasks.find(t => t.id === id);
  }

  async create(data: any): Promise<any> {
    const task = { id: uuid(), ...data, createdAt: new Date() };
    this.tasks.push(task);
    return task;
  }

  async update(id: string, data: any): Promise<any> {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) return null;
    this.tasks[index] = { ...this.tasks[index], ...data };
    return this.tasks[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) return false;
    this.tasks.splice(index, 1);
    return true;
  }
}
```

---

## Task Service with Injected Dependencies

```typescript
// src/services/Task.service.ts
import { ITaskRepository } from '../interfaces/ITaskRepository';
import { ILogger } from '../interfaces/ILogger';
import { INotificationService } from '../interfaces/INotificationService';

export class TaskService {
  constructor(
    private repository: ITaskRepository,
    private logger: ILogger,
    private notificationService: INotificationService
  ) {}

  async createTask(data: any): Promise<any> {
    this.logger.log(`Creating task: ${data.title}`);
    
    const task = await this.repository.create(data);
    
    this.notificationService.send(
      'email',
      `Task created: ${task.title}`,
      'admin@example.com'
    );
    
    this.logger.log(`Task created with ID: ${task.id}`);
    return task;
  }

  async getAllTasks(): Promise<any[]> {
    this.logger.log('Fetching all tasks');
    return this.repository.findAll();
  }

  async getTaskById(id: string): Promise<any> {
    this.logger.log(`Fetching task: ${id}`);
    return this.repository.findById(id);
  }

  async deleteTask(id: string): Promise<boolean> {
    this.logger.log(`Deleting task: ${id}`);
    const result = await this.repository.delete(id);
    
    if (result) {
      this.notificationService.send(
        'email',
        `Task deleted: ${id}`,
        'admin@example.com'
      );
    }
    
    return result;
  }
}
```

---

## Container Setup

```typescript
// src/config/container.ts
import { DIContainer } from '../patterns/di/DIContainer';
import { ConsoleLogger } from '../services/Logger';
import { NotificationService } from '../services/NotificationService';
import { TaskRepository } from '../repositories/Task.repository';
import { TaskService } from '../services/Task.service';
import { ILogger } from '../interfaces/ILogger';
import { ITaskRepository } from '../interfaces/ITaskRepository';
import { INotificationService } from '../interfaces/INotificationService';

export function setupContainer(): DIContainer {
  const container = new DIContainer();

  // Register logger as singleton (shared across all services)
  const logger = new ConsoleLogger();
  container.registerSingleton<ILogger>('logger', logger);

  // Register repository
  const taskRepository = new TaskRepository();
  container.register<ITaskRepository>('taskRepository', taskRepository);

  // Register notification service (depends on logger)
  const notificationService = new NotificationService(
    container.resolve<ILogger>('logger')
  );
  container.register<INotificationService>('notificationService', notificationService);

  // Register task service (depends on multiple services)
  const taskService = new TaskService(
    container.resolve<ITaskRepository>('taskRepository'),
    container.resolve<ILogger>('logger'),
    container.resolve<INotificationService>('notificationService')
  );
  container.register('taskService', taskService);

  return container;
}
```

---

## Usage Example

```typescript
// test-di.ts
import { setupContainer } from './config/container';
import { TaskService } from './services/Task.service';
import { ILogger } from './interfaces/ILogger';

async function main() {
  // Setup container
  const container = setupContainer();
  
  console.log('=== Registered Services ===');
  console.log(container.list());

  // Resolve services
  const logger = container.resolve<ILogger>('logger');
  const taskService = container.resolve<TaskService>('taskService');

  logger.log('Application started');

  // Use task service
  console.log('\n=== Creating Task ===');
  const task = await taskService.createTask({
    title: 'Learn Dependency Injection',
    description: 'Master DI pattern in TypeScript'
  });

  console.log('\n=== Getting All Tasks ===');
  const tasks = await taskService.getAllTasks();
  console.log(`Found ${tasks.length} tasks`);

  console.log('\n=== Deleting Task ===');
  await taskService.deleteTask(task.id);
}

main();
```

---

## Output

```
=== Registered Services ===
[ 'taskRepository', 'notificationService', 'taskService', 'logger (singleton)' ]
[INFO] 2026-02-17T...: Application started

=== Creating Task ===
[INFO] 2026-02-17T...: Creating task: Learn Dependency Injection
[INFO] 2026-02-17T...: Sending email notification to admin@example.com: Task created: Learn Dependency Injection
[INFO] 2026-02-17T...: Task created with ID: abc-123

=== Getting All Tasks ===
[INFO] 2026-02-17T...: Fetching all tasks
Found 1 tasks

=== Deleting Task ===
[INFO] 2026-02-17T...: Deleting task: abc-123
[INFO] 2026-02-17T...: Sending email notification to admin@example.com: Task deleted: abc-123
```

---

## Mock for Testing

```typescript
// test/mocks.ts
class MockLogger implements ILogger {
  logs: string[] = [];
  log(message: string) { this.logs.push(`LOG: ${message}`); }
  error(message: string) { this.logs.push(`ERROR: ${message}`); }
  warn(message: string) { this.logs.push(`WARN: ${message}`); }
}

class MockRepository implements ITaskRepository {
  tasks: any[] = [];
  async findAll() { return this.tasks; }
  async findById(id: string) { return this.tasks.find(t => t.id === id); }
  async create(data: any) { 
    const task = { id: 'mock-id', ...data };
    this.tasks.push(task);
    return task;
  }
  async update(id: string, data: any) { return { id, ...data }; }
  async delete(id: string) { return true; }
}

// Test with mocks
const mockLogger = new MockLogger();
const mockRepo = new MockRepository();
const mockNotification = { send: jest.fn() };

const service = new TaskService(mockRepo, mockLogger, mockNotification as any);
// Now test TaskService in isolation!
```

---

**Challenge:** [08-dependency-injection-challenge.md](../challenge/08-dependency-injection-challenge.md)
