# Challenge 8: Dependency Injection Pattern

> **Difficulty:** ⭐⭐⭐ Hard  
> **Estimated Time:** 1 hour

---

## Objective

Implement a service container for dependency injection.

---

## Requirements

1. Create `DIContainer` class with methods:
   - `register<T>(key, service)` - Register a service
   - `registerSingleton<T>(key, service)` - Register as singleton
   - `resolve<T>(key)` - Get a service
   - `has(key)` - Check if service exists

2. Define interfaces:
   - `ILogger` - log, error, warn methods
   - `ITaskRepository` - CRUD operations
   - `INotificationService` - send method

3. Create implementations:
   - `ConsoleLogger`
   - `TaskRepository`
   - `NotificationService`

4. Create `TaskService` with constructor injection:
   - Depends on: `ITaskRepository`, `ILogger`, `INotificationService`

---

## File Structure

```
src/
├── patterns/
│   └── di/
│       └── DIContainer.ts
├── interfaces/
│   ├── ILogger.ts
│   ├── ITaskRepository.ts
│   └── INotificationService.ts
└── config/
    └── container.ts
```

---

## Acceptance Criteria

```typescript
// Setup container
const container = new DIContainer();

// Register logger as singleton
container.registerSingleton('logger', new ConsoleLogger());

// Register services
container.register('taskRepository', new TaskRepository());
container.register('notificationService', 
  new NotificationService(container.resolve('logger'))
);

// Register TaskService with dependencies
container.register('taskService', new TaskService(
  container.resolve('taskRepository'),
  container.resolve('logger'),
  container.resolve('notificationService')
));

// Resolve and use
const taskService = container.resolve<TaskService>('taskService');
await taskService.createTask({ title: 'Test DI' });
```

---

## Interface Definitions

```typescript
interface ILogger {
  log(message: string): void;
  error(message: string): void;
  warn(message: string): void;
}

interface INotificationService {
  send(type: string, message: string, recipient: string): void;
}
```

---

## Hints

- Store services in a Map
- Separate maps for regular services and singletons
- Throw error if service not found during resolve
- Dependencies must be registered before dependents

---

## Bonus Challenge

- Add `registerFactory(key, factoryFn)` for lazy instantiation
- Create mock implementations for testing
- Add scoped services (per-request lifetime)

---

**Solution:** [08-dependency-injection-solution.md](../solutions/08-dependency-injection-solution.md)
