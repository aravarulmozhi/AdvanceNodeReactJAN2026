# Challenge 4: Repository Pattern

> **Difficulty:** ⭐⭐ Medium  
> **Estimated Time:** 45 minutes

---

## Node.js Project Setup

### Quick Start
```bash
mkdir repository-challenge && cd repository-challenge
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
├── models/
│   └── User.ts
├── repositories/
│   └── UserRepository.ts
├── services/
│   └── UserService.ts
└── index.ts
```

### Running Your Solution
```bash
npm start
```

---

## Objective

Create an abstract data access layer using the Repository pattern.

---

## Requirements

1. Create a generic `IRepository<T>` interface with methods:
   - `findAll(): Promise<T[]>`
   - `findById(id: string): Promise<T | null>`
   - `create(item: Omit<T, 'id'>): Promise<T>`
   - `update(id: string, item: Partial<T>): Promise<T | null>`
   - `delete(id: string): Promise<boolean>`
   - `findByQuery(query: Partial<T>): Promise<T[]>`

2. Implement `TaskRepository` that implements the interface

3. Use in-memory storage (array) for this challenge

4. All repository methods must be async

---

## File Structure

```
src/
└── repositories/
    ├── IRepository.ts
    └── Task.repository.ts
```

---

## Acceptance Criteria

```typescript
const repo = new TaskRepository();

// Create
const task = await repo.create({ 
  title: 'Test', 
  description: 'Testing repo' 
});
console.log(task.id); // Should have generated ID

// Find all
const tasks = await repo.findAll();
console.log(tasks.length); // 1

// Find by ID
const found = await repo.findById(task.id);
console.log(found?.title); // 'Test'

// Update
const updated = await repo.update(task.id, { title: 'Updated' });
console.log(updated?.title); // 'Updated'

// Delete
const deleted = await repo.delete(task.id);
console.log(deleted); // true

// Find by query
const byStatus = await repo.findByQuery({ status: 'todo' });
```

---

## Hints

- Use `uuid` package for generating IDs
- Return copies of objects to prevent mutation
- Handle not-found cases gracefully
- Set default values for status and priority

---

## Bonus Challenge

- Add `findByStatus(status)` method
- Add `findByPriority(priority)` method
- Create a `MockRepository` for testing

---

**Solution:** [04-repository-solution.md](../solutions/04-repository-solution.md)
