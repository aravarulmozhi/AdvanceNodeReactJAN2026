# Solution 4: Repository Pattern

---

## Node.js Project Setup

### Quick Start
```bash
mkdir repository-solution && cd repository-solution
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

### Run Solution
```bash
npm start
```

---

## Generic Interface

```typescript
// src/repositories/IRepository.ts

export interface IRepository<T> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(item: Omit<T, 'id'>): Promise<T>;
  update(id: string, item: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  findByQuery(query: Partial<T>): Promise<T[]>;
}
```

---

## Task Repository Implementation

```typescript
// src/repositories/Task.repository.ts

import { v4 as uuid } from 'uuid';
import { IRepository } from './IRepository';
import { ITask, CreateTaskDTO, TaskStatus, TaskPriority } from '../models/Task.model';

export class TaskRepository implements IRepository<ITask> {
  private tasks: ITask[] = [];

  async findAll(): Promise<ITask[]> {
    // Return copy to prevent external mutation
    return [...this.tasks];
  }

  async findById(id: string): Promise<ITask | null> {
    const task = this.tasks.find(t => t.id === id);
    return task ? { ...task } : null;
  }

  async create(item: CreateTaskDTO): Promise<ITask> {
    const newTask: ITask = {
      id: uuid(),
      title: item.title,
      description: item.description,
      status: 'todo' as TaskStatus,
      priority: item.priority || 'medium' as TaskPriority,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.tasks.push(newTask);
    return { ...newTask };
  }

  async update(id: string, item: Partial<ITask>): Promise<ITask | null> {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) return null;

    this.tasks[index] = {
      ...this.tasks[index],
      ...item,
      updatedAt: new Date()
    };
    return { ...this.tasks[index] };
  }

  async delete(id: string): Promise<boolean> {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) return false;
    this.tasks.splice(index, 1);
    return true;
  }

  async findByQuery(query: Partial<ITask>): Promise<ITask[]> {
    return this.tasks.filter(task => {
      return Object.entries(query).every(([key, value]) => {
        return task[key as keyof ITask] === value;
      });
    });
  }

  // Additional helper methods
  async findByStatus(status: TaskStatus): Promise<ITask[]> {
    return this.tasks.filter(t => t.status === status);
  }

  async findByPriority(priority: TaskPriority): Promise<ITask[]> {
    return this.tasks.filter(t => t.priority === priority);
  }

  async count(): Promise<number> {
    return this.tasks.length;
  }
}
```

---

## Usage Example

```typescript
// test-repository.ts

import { TaskRepository } from './repositories/Task.repository';

async function testRepository() {
  const repo = new TaskRepository();

  // Create
  const task1 = await repo.create({
    title: 'Learn Repository Pattern',
    description: 'Master data access abstraction',
    priority: 'high'
  });
  console.log('Created:', task1);

  const task2 = await repo.create({
    title: 'Write Tests',
    description: 'Test the repository',
    priority: 'medium'
  });

  // Find all
  const allTasks = await repo.findAll();
  console.log('All tasks:', allTasks.length); // 2

  // Find by ID
  const found = await repo.findById(task1.id);
  console.log('Found:', found?.title); // 'Learn Repository Pattern'

  // Find by query
  const highPriority = await repo.findByQuery({ priority: 'high' });
  console.log('High priority:', highPriority.length); // 1

  // Update
  const updated = await repo.update(task1.id, { 
    status: 'in-progress',
    title: 'Master Repository Pattern' 
  });
  console.log('Updated:', updated?.title); // 'Master Repository Pattern'

  // Delete
  const deleted = await repo.delete(task2.id);
  console.log('Deleted:', deleted); // true

  // Count remaining
  const count = await repo.count();
  console.log('Remaining:', count); // 1
}

testRepository();
```

---

## Output

```
Created: { id: '...', title: 'Learn Repository Pattern', ... }
All tasks: 2
Found: Learn Repository Pattern
High priority: 1
Updated: Master Repository Pattern
Deleted: true
Remaining: 1
```

---

## Mock Repository for Testing

```typescript
// src/repositories/Mock.repository.ts

import { IRepository } from './IRepository';
import { ITask } from '../models/Task.model';

export class MockTaskRepository implements IRepository<ITask> {
  private mockData: ITask[] = [
    {
      id: 'mock-1',
      title: 'Mock Task 1',
      description: 'Test task',
      status: 'todo',
      priority: 'medium',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  async findAll(): Promise<ITask[]> {
    return this.mockData;
  }

  async findById(id: string): Promise<ITask | null> {
    return this.mockData.find(t => t.id === id) || null;
  }

  async create(item: Omit<ITask, 'id'>): Promise<ITask> {
    const task = { id: 'mock-new', ...item } as ITask;
    this.mockData.push(task);
    return task;
  }

  async update(id: string, item: Partial<ITask>): Promise<ITask | null> {
    const index = this.mockData.findIndex(t => t.id === id);
    if (index === -1) return null;
    this.mockData[index] = { ...this.mockData[index], ...item };
    return this.mockData[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.mockData.findIndex(t => t.id === id);
    if (index === -1) return false;
    this.mockData.splice(index, 1);
    return true;
  }

  async findByQuery(query: Partial<ITask>): Promise<ITask[]> {
    return this.mockData.filter(t => {
      return Object.entries(query).every(([k, v]) => t[k as keyof ITask] === v);
    });
  }
}
```

---

## Key Points

1. **Interface abstraction** - Business logic depends on interface, not implementation
2. **Easy to swap** - Can switch from memory to MongoDB without changing service
3. **Testability** - Use MockRepository for unit tests
4. **Return copies** - Prevent external mutation of internal data

---

**Challenge:** [04-repository-challenge.md](../challenge/04-repository-challenge.md)
