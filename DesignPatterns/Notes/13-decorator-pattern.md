# Chapter 13: Decorator Pattern

> **Category:** Structural Pattern

---

## What is Decorator?

The Decorator pattern attaches additional responsibilities to an object dynamically without modifying its structure.

---

## When to Use

- Adding features to objects without subclassing
- Implementing caching layers
- Adding logging/monitoring
- Cross-cutting concerns
- Wrapping third-party code

---

## Structure

```
┌─────────────────┐
│   Component     │  ← Interface
├─────────────────┤
│ + operation()   │
└─────────────────┘
         △
         │
    ┌────┴────┐
    │         │
┌───┴───┐  ┌──┴──────────────┐
│Concrete│  │    Decorator    │
│Component│ ├─────────────────┤
└─────────┘ │ - component     │
            │ + operation()   │
            └─────────────────┘
                     △
                     │
            ┌────────┴────────┐
            │                 │
     ┌──────┴─────┐    ┌──────┴─────┐
     │ DecoratorA │    │ DecoratorB │
     └────────────┘    └────────────┘
```

---

## Cached Repository Implementation

```typescript
// src/patterns/decorator/CachedRepository.ts

import { IRepository } from '../../repositories/IRepository';
import { ITask } from '../../models/Task.model';

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

interface CacheOptions {
  ttl: number; // Time to live in milliseconds
}

class CachedRepository implements IRepository<ITask> {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private readonly ALL_TASKS_KEY = 'all_tasks';

  constructor(
    private baseRepository: IRepository<ITask>,
    private options: CacheOptions = { ttl: 60000 }
  ) {}

  private getCacheKey(id: string): string {
    return `task_${id}`;
  }

  private isExpired(entry: CacheEntry<any>): boolean {
    return Date.now() > entry.expiry;
  }

  private setCache<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + this.options.ttl
    });
    console.log(`[CACHE] SET: ${key}`);
  }

  private getCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      console.log(`[CACHE] MISS: ${key}`);
      return null;
    }

    if (this.isExpired(entry)) {
      console.log(`[CACHE] EXPIRED: ${key}`);
      this.cache.delete(key);
      return null;
    }

    console.log(`[CACHE] HIT: ${key}`);
    return entry.data;
  }

  private invalidateCache(): void {
    console.log(`[CACHE] INVALIDATING all entries`);
    this.cache.clear();
  }

  // Decorated methods
  async findAll(): Promise<ITask[]> {
    const cached = this.getCache<ITask[]>(this.ALL_TASKS_KEY);
    if (cached) {
      return cached;
    }

    const tasks = await this.baseRepository.findAll();
    this.setCache(this.ALL_TASKS_KEY, tasks);
    return tasks;
  }

  async findById(id: string): Promise<ITask | null> {
    const key = this.getCacheKey(id);
    const cached = this.getCache<ITask>(key);
    
    if (cached) {
      return cached;
    }

    const task = await this.baseRepository.findById(id);
    if (task) {
      this.setCache(key, task);
    }
    return task;
  }

  // Write operations invalidate cache
  async create(item: Omit<ITask, 'id'>): Promise<ITask> {
    const task = await this.baseRepository.create(item);
    this.invalidateCache();
    return task;
  }

  async update(id: string, item: Partial<ITask>): Promise<ITask | null> {
    const task = await this.baseRepository.update(id, item);
    if (task) {
      this.cache.delete(this.getCacheKey(id));
      this.cache.delete(this.ALL_TASKS_KEY);
    }
    return task;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.baseRepository.delete(id);
    if (result) {
      this.invalidateCache();
    }
    return result;
  }

  async findByQuery(query: Partial<ITask>): Promise<ITask[]> {
    // Queries bypass cache
    return this.baseRepository.findByQuery(query);
  }

  // Cache management
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  clearCache(): void {
    this.invalidateCache();
  }
}

export { CachedRepository, CacheOptions };
```

---

## Usage Example

```typescript
import { TaskRepository } from '../repositories/Task.repository';
import { CachedRepository } from './CachedRepository';

// Create base repository
const baseRepo = new TaskRepository();

// Wrap with caching decorator
const cachedRepo = new CachedRepository(baseRepo, { ttl: 60000 }); // 1 minute cache

// First call - fetches from storage
const tasks1 = await cachedRepo.findAll();
// [CACHE] MISS: all_tasks
// [CACHE] SET: all_tasks

// Second call - returns from cache
const tasks2 = await cachedRepo.findAll();
// [CACHE] HIT: all_tasks

// Create invalidates cache
await cachedRepo.create({ title: 'New Task', description: 'Test' });
// [CACHE] INVALIDATING all entries

// Next call fetches fresh data
const tasks3 = await cachedRepo.findAll();
// [CACHE] MISS: all_tasks
```

---

## Logging Decorator

```typescript
// src/patterns/decorator/LoggedRepository.ts

class LoggedRepository implements IRepository<ITask> {
  constructor(
    private baseRepository: IRepository<ITask>,
    private logger: ILogger
  ) {}

  async findAll(): Promise<ITask[]> {
    this.logger.log('Repository.findAll() called');
    const start = Date.now();
    
    const result = await this.baseRepository.findAll();
    
    this.logger.log(`Repository.findAll() returned ${result.length} items in ${Date.now() - start}ms`);
    return result;
  }

  async findById(id: string): Promise<ITask | null> {
    this.logger.log(`Repository.findById(${id}) called`);
    const result = await this.baseRepository.findById(id);
    this.logger.log(`Repository.findById(${id}) returned: ${result ? 'found' : 'not found'}`);
    return result;
  }

  async create(item: Omit<ITask, 'id'>): Promise<ITask> {
    this.logger.log(`Repository.create() called with: ${JSON.stringify(item)}`);
    const result = await this.baseRepository.create(item);
    this.logger.log(`Repository.create() created: ${result.id}`);
    return result;
  }

  // ... other methods
}
```

---

## Stacking Decorators

```typescript
// Stack multiple decorators
const baseRepo = new TaskRepository();
const loggedRepo = new LoggedRepository(baseRepo, logger);
const cachedRepo = new CachedRepository(loggedRepo, { ttl: 60000 });

// Call flow: CachedRepo → LoggedRepo → TaskRepository
await cachedRepo.findAll();
```

---

## TypeScript Decorators (Alternative)

```typescript
// Method decorator for logging
function Log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    console.log(`Calling ${propertyKey} with:`, args);
    const result = await originalMethod.apply(this, args);
    console.log(`${propertyKey} returned:`, result);
    return result;
  };

  return descriptor;
}

// Method decorator for caching
function Cache(ttl: number = 60000) {
  const cache = new Map<string, { data: any; expiry: number }>();

  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const key = `${propertyKey}_${JSON.stringify(args)}`;
      const cached = cache.get(key);

      if (cached && Date.now() < cached.expiry) {
        return cached.data;
      }

      const result = await originalMethod.apply(this, args);
      cache.set(key, { data: result, expiry: Date.now() + ttl });
      return result;
    };

    return descriptor;
  };
}

// Usage with decorators
class TaskService {
  @Log
  @Cache(30000)
  async getAllTasks(): Promise<ITask[]> {
    // ...
  }
}
```

---

## Pros and Cons

### ✅ Pros
- Add behavior without modifying original
- Combine behaviors by stacking
- Single Responsibility Principle
- Open/Closed Principle

### ❌ Cons
- Many small objects can be confusing
- Order of decoration matters
- Can be hard to debug
- Initial setup complexity

---

**Previous:** [Middleware Pattern](12-middleware-pattern.md) | **Next:** [Summary](14-summary.md)
