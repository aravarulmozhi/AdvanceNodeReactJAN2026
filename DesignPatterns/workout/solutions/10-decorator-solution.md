# Solution 10: Decorator Pattern

---

## Complete Cached Repository Implementation

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
  ) {
    console.log(`[CACHE] Initialized with TTL: ${options.ttl}ms`);
  }

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
    console.log(`[CACHE] SET: ${key} (expires in ${this.options.ttl}ms)`);
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

  private invalidateAll(): void {
    const size = this.cache.size;
    this.cache.clear();
    console.log(`[CACHE] INVALIDATED: ${size} entries cleared`);
  }

  private invalidateSingle(id: string): void {
    const key = this.getCacheKey(id);
    this.cache.delete(key);
    this.cache.delete(this.ALL_TASKS_KEY);
    console.log(`[CACHE] INVALIDATED: ${key} and ${this.ALL_TASKS_KEY}`);
  }

  // Decorated Repository Methods

  async findAll(): Promise<ITask[]> {
    // Try cache first
    const cached = this.getCache<ITask[]>(this.ALL_TASKS_KEY);
    if (cached) {
      return cached;
    }

    // Fetch from base repository
    const tasks = await this.baseRepository.findAll();
    
    // Store in cache
    this.setCache(this.ALL_TASKS_KEY, tasks);
    
    return tasks;
  }

  async findById(id: string): Promise<ITask | null> {
    const key = this.getCacheKey(id);
    
    // Try cache first
    const cached = this.getCache<ITask>(key);
    if (cached) {
      return cached;
    }

    // Fetch from base repository
    const task = await this.baseRepository.findById(id);
    
    // Store in cache if found
    if (task) {
      this.setCache(key, task);
    }
    
    return task;
  }

  async create(item: Omit<ITask, 'id'>): Promise<ITask> {
    // Create in base repository
    const task = await this.baseRepository.create(item);
    
    // Invalidate cache (new item affects findAll)
    this.invalidateAll();
    
    return task;
  }

  async update(id: string, item: Partial<ITask>): Promise<ITask | null> {
    // Update in base repository
    const task = await this.baseRepository.update(id, item);
    
    // Invalidate affected cache entries
    if (task) {
      this.invalidateSingle(id);
    }
    
    return task;
  }

  async delete(id: string): Promise<boolean> {
    // Delete from base repository
    const result = await this.baseRepository.delete(id);
    
    // Invalidate all cache (deletion affects findAll)
    if (result) {
      this.invalidateAll();
    }
    
    return result;
  }

  async findByQuery(query: Partial<ITask>): Promise<ITask[]> {
    // Queries bypass cache - always fetch fresh data
    console.log(`[CACHE] BYPASS: findByQuery (not cached)`);
    return this.baseRepository.findByQuery(query);
  }

  // Cache Management Methods

  getCacheStats(): { size: number; keys: string[]; ttl: number } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      ttl: this.options.ttl
    };
  }

  clearCache(): void {
    this.invalidateAll();
  }

  // Check if specific key is cached and valid
  isCached(id: string): boolean {
    const key = this.getCacheKey(id);
    const entry = this.cache.get(key);
    return entry !== undefined && !this.isExpired(entry);
  }
}

export { CachedRepository, CacheOptions };
```

---

## Usage Example

```typescript
// test-decorator.ts

import { TaskRepository } from './repositories/Task.repository';
import { CachedRepository } from './patterns/decorator/CachedRepository';

async function testCachedRepository() {
  // Create base repository
  const baseRepo = new TaskRepository();

  // Wrap with caching decorator (30 second TTL)
  const cachedRepo = new CachedRepository(baseRepo, { ttl: 30000 });

  console.log('=== Creating Tasks ===');
  await cachedRepo.create({ title: 'Task 1', description: 'First task' });
  await cachedRepo.create({ title: 'Task 2', description: 'Second task' });

  console.log('\n=== First findAll (MISS) ===');
  const tasks1 = await cachedRepo.findAll();
  console.log(`Found ${tasks1.length} tasks`);

  console.log('\n=== Second findAll (HIT) ===');
  const tasks2 = await cachedRepo.findAll();
  console.log(`Found ${tasks2.length} tasks`);

  console.log('\n=== Find by ID (MISS) ===');
  const task = await cachedRepo.findById(tasks1[0].id);
  console.log(`Found: ${task?.title}`);

  console.log('\n=== Find by ID again (HIT) ===');
  await cachedRepo.findById(tasks1[0].id);

  console.log('\n=== Update task (invalidates cache) ===');
  await cachedRepo.update(tasks1[0].id, { title: 'Updated Task 1' });

  console.log('\n=== findAll after update (MISS) ===');
  await cachedRepo.findAll();

  console.log('\n=== Cache Stats ===');
  console.log(cachedRepo.getCacheStats());

  console.log('\n=== Clear Cache ===');
  cachedRepo.clearCache();
  console.log(cachedRepo.getCacheStats());
}

testCachedRepository();
```

---

## Output

```
[CACHE] Initialized with TTL: 30000ms

=== Creating Tasks ===
[CACHE] INVALIDATED: 0 entries cleared
[CACHE] INVALIDATED: 0 entries cleared

=== First findAll (MISS) ===
[CACHE] MISS: all_tasks
[CACHE] SET: all_tasks (expires in 30000ms)
Found 2 tasks

=== Second findAll (HIT) ===
[CACHE] HIT: all_tasks
Found 2 tasks

=== Find by ID (MISS) ===
[CACHE] MISS: task_abc123
[CACHE] SET: task_abc123 (expires in 30000ms)
Found: Task 1

=== Find by ID again (HIT) ===
[CACHE] HIT: task_abc123

=== Update task (invalidates cache) ===
[CACHE] INVALIDATED: task_abc123 and all_tasks

=== findAll after update (MISS) ===
[CACHE] MISS: all_tasks
[CACHE] SET: all_tasks (expires in 30000ms)

=== Cache Stats ===
{ size: 1, keys: ['all_tasks'], ttl: 30000 }

=== Clear Cache ===
[CACHE] INVALIDATED: 1 entries cleared
{ size: 0, keys: [], ttl: 30000 }
```

---

## Bonus: Logged Repository Decorator

```typescript
// src/patterns/decorator/LoggedRepository.ts

import { IRepository } from '../../repositories/IRepository';
import { ITask } from '../../models/Task.model';
import { ILogger } from '../../interfaces/ILogger';

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
    this.logger.log(`Repository.create() called`);
    const result = await this.baseRepository.create(item);
    this.logger.log(`Repository.create() created: ${result.id}`);
    return result;
  }

  async update(id: string, item: Partial<ITask>): Promise<ITask | null> {
    this.logger.log(`Repository.update(${id}) called`);
    const result = await this.baseRepository.update(id, item);
    this.logger.log(`Repository.update(${id}) result: ${result ? 'updated' : 'not found'}`);
    return result;
  }

  async delete(id: string): Promise<boolean> {
    this.logger.log(`Repository.delete(${id}) called`);
    const result = await this.baseRepository.delete(id);
    this.logger.log(`Repository.delete(${id}) result: ${result}`);
    return result;
  }

  async findByQuery(query: Partial<ITask>): Promise<ITask[]> {
    this.logger.log(`Repository.findByQuery() called with: ${JSON.stringify(query)}`);
    return this.baseRepository.findByQuery(query);
  }
}

export { LoggedRepository };
```

---

## Stacking Decorators

```typescript
// Stack multiple decorators
const baseRepo = new TaskRepository();
const loggedRepo = new LoggedRepository(baseRepo, new ConsoleLogger());
const cachedRepo = new CachedRepository(loggedRepo, { ttl: 60000 });

// Call flow: CachedRepository → LoggedRepository → TaskRepository
await cachedRepo.findAll();
// 1. CachedRepository checks cache (MISS)
// 2. LoggedRepository logs the call
// 3. TaskRepository fetches data
// 4. LoggedRepository logs the result
// 5. CachedRepository stores in cache
```

---

## Key Points

1. **Same interface** - Decorator implements the same interface as the base
2. **Transparent** - Client doesn't know about decoration
3. **Stackable** - Multiple decorators can be combined
4. **Single Responsibility** - Each decorator adds one behavior

---

**Challenge:** [10-decorator-challenge.md](../challenge/10-decorator-challenge.md)
