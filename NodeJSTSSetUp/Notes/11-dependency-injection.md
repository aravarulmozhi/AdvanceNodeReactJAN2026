# Chapter 11: Dependency Injection Pattern

> **Category:** Creational/Structural Pattern

---

## What is Dependency Injection?

Dependency Injection (DI) is a technique where objects receive their dependencies from external sources rather than creating them internally.

---

## When to Use

- Decoupling components
- Improving testability
- Managing complex dependencies
- Supporting multiple implementations

---

## Types of Dependency Injection

### 1. Constructor Injection
```typescript
class UserService {
  constructor(private repository: IUserRepository) {}
}
```

### 2. Property Injection
```typescript
class UserService {
  repository!: IUserRepository;
}
```

### 3. Method Injection
```typescript
class UserService {
  setRepository(repository: IUserRepository): void {
    this.repository = repository;
  }
}
```

---

## DI Container Implementation

```typescript
// src/patterns/di/DIContainer.ts

class DIContainer {
  private services: Map<string, any> = new Map();
  private singletons: Map<string, any> = new Map();

  // Register a service
  register<T>(key: string, service: T): void {
    this.services.set(key, service);
  }

  // Register as singleton
  registerSingleton<T>(key: string, service: T): void {
    this.singletons.set(key, service);
  }

  // Resolve a service
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
}

export { DIContainer };
```

---

## Service Interfaces

```typescript
// Define interfaces for loose coupling

interface ILogger {
  log(message: string): void;
  error(message: string): void;
  warn(message: string): void;
}

interface ITaskRepository {
  findAll(): Promise<any[]>;
  findById(id: string): Promise<any>;
  create(data: any): Promise<any>;
  update(id: string, data: any): Promise<any>;
  delete(id: string): Promise<boolean>;
}

interface INotificationService {
  send(type: string, message: string, recipient: string): void;
}
```

---

## Service Implementations

```typescript
// Console Logger
class ConsoleLogger implements ILogger {
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

// File Logger (alternative implementation)
class FileLogger implements ILogger {
  constructor(private filePath: string) {}

  log(message: string): void {
    // Write to file
    console.log(`[FILE] Writing to ${this.filePath}: ${message}`);
  }

  error(message: string): void {
    console.log(`[FILE] ERROR to ${this.filePath}: ${message}`);
  }

  warn(message: string): void {
    console.log(`[FILE] WARN to ${this.filePath}: ${message}`);
  }
}

// Notification Service
class NotificationService implements INotificationService {
  constructor(private logger: ILogger) {}

  send(type: string, message: string, recipient: string): void {
    this.logger.log(`Sending ${type} to ${recipient}: ${message}`);
  }
}
```

---

## Service with Injected Dependencies

```typescript
// TaskService using dependency injection
class TaskService {
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
    
    return task;
  }

  async getAllTasks(): Promise<any[]> {
    this.logger.log('Fetching all tasks');
    return this.repository.findAll();
  }

  async deleteTask(id: string): Promise<boolean> {
    this.logger.log(`Deleting task: ${id}`);
    return this.repository.delete(id);
  }
}
```

---

## Container Setup

```typescript
// src/config/container.ts

import { DIContainer } from '../patterns/di/DIContainer';
import { ConsoleLogger, FileLogger } from '../services/Logger';
import { NotificationService } from '../services/NotificationService';
import { TaskRepository } from '../repositories/Task.repository';
import { TaskService } from '../services/Task.service';

function setupContainer(): DIContainer {
  const container = new DIContainer();

  // Register logger as singleton
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

export { setupContainer };
```

---

## Usage in Application

```typescript
// src/index.ts

import { setupContainer } from './config/container';

const container = setupContainer();

// Resolve services from container
const taskService = container.resolve<TaskService>('taskService');
const logger = container.resolve<ILogger>('logger');

// Use services
logger.log('Application started');

async function main() {
  const task = await taskService.createTask({
    title: 'Learn DI Pattern',
    description: 'Master dependency injection'
  });
  
  console.log('Created:', task);
}

main();
```

---

## Testing with Mock Dependencies

```typescript
// test/Task.service.test.ts

class MockLogger implements ILogger {
  logs: string[] = [];
  
  log(message: string): void {
    this.logs.push(`LOG: ${message}`);
  }
  error(message: string): void {
    this.logs.push(`ERROR: ${message}`);
  }
  warn(message: string): void {
    this.logs.push(`WARN: ${message}`);
  }
}

class MockRepository implements ITaskRepository {
  private tasks: any[] = [];
  
  async findAll() { return this.tasks; }
  async findById(id: string) { return this.tasks.find(t => t.id === id); }
  async create(data: any) { 
    const task = { id: '1', ...data };
    this.tasks.push(task);
    return task;
  }
  async update(id: string, data: any) { return { id, ...data }; }
  async delete(id: string) { return true; }
}

// Test
const mockLogger = new MockLogger();
const mockRepo = new MockRepository();
const mockNotification = { send: jest.fn() };

const service = new TaskService(mockRepo, mockLogger, mockNotification);

// Now you can test TaskService in isolation!
```

---

## Pros and Cons

### ✅ Pros
- Loose coupling between components
- Easy to swap implementations
- Improves testability
- Follows SOLID principles

### ❌ Cons
- Adds complexity
- Runtime errors vs compile-time
- Learning curve
- Container configuration can grow large

---

**Previous:** [Builder Pattern](10-builder-pattern.md) | **Next:** [Middleware Pattern](12-middleware-pattern.md)
