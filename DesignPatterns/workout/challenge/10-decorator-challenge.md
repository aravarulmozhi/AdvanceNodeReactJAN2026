# Challenge 10: Decorator Pattern

> **Difficulty:** ⭐⭐⭐ Hard  
> **Estimated Time:** 1 hour

---

## Node.js Project Setup

### Quick Start
```bash
mkdir decorator-challenge && cd decorator-challenge
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
├── decorators/
│   ├── Component.ts
│   ├── BorderDecorator.ts
│   └── ScrollDecorator.ts
└── index.ts
```

### Running Your Solution
```bash
npm start
```

---

## Objective

Add caching functionality to the Repository using the Decorator pattern.

---

## Requirements

1. Create `CachedRepository` class that:
   - Implements `IRepository<ITask>` interface
   - Wraps a base repository
   - Accepts cache options (TTL in milliseconds)

2. Caching behavior:
   - `findAll()` - Cache results
   - `findById(id)` - Cache individual items
   - `create()` - Invalidate all cache
   - `update()` - Invalidate specific item + all items cache
   - `delete()` - Invalidate all cache
   - `findByQuery()` - No caching (always fresh)

3. Add cache management:
   - `getCacheStats()` - Return cache size and keys
   - `clearCache()` - Manually clear cache

---

## File Structure

```
src/
└── patterns/
    └── decorator/
        └── CachedRepository.ts
```

---

## Acceptance Criteria

```typescript
// Create base repository
const baseRepo = new TaskRepository();

// Wrap with caching decorator
const cachedRepo = new CachedRepository(baseRepo, { ttl: 60000 });

// First call - fetches from base
const tasks1 = await cachedRepo.findAll();
// [CACHE] MISS: all_tasks
// [CACHE] SET: all_tasks

// Second call - returns cached
const tasks2 = await cachedRepo.findAll();
// [CACHE] HIT: all_tasks

// Create invalidates cache
await cachedRepo.create({ title: 'New Task', description: 'Test' });
// [CACHE] INVALIDATING all entries

// Next call fetches fresh
const tasks3 = await cachedRepo.findAll();
// [CACHE] MISS: all_tasks

// Cache stats
console.log(cachedRepo.getCacheStats());
// { size: 1, keys: ['all_tasks'] }
```

---

## Cache Entry Interface

```typescript
interface CacheEntry<T> {
  data: T;
  expiry: number; // timestamp
}

interface CacheOptions {
  ttl: number; // milliseconds
}
```

---

## Cache Keys

- All tasks: `'all_tasks'`
- Individual task: `'task_${id}'`

---

## Hints

- Store cache entries in a Map
- Check expiry before returning cached data
- Delete expired entries on access
- Log cache hits/misses for debugging

---

## Bonus Challenge

- Add LRU (Least Recently Used) eviction
- Implement cache warming on startup
- Create a `LoggedRepository` decorator
- Stack decorators: Logged → Cached → Base

---

**Solution:** [10-decorator-solution.md](../solutions/10-decorator-solution.md)
