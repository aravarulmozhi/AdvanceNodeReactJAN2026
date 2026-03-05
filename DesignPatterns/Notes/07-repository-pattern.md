# Chapter 7: Repository Pattern

> **Category:** Structural/Data Access Pattern

---

## What is Repository?

The Repository pattern abstracts the data layer, providing a collection-like interface for accessing domain objects.

---

## When to Use

- Separating business logic from data access
- Supporting multiple data sources
- Enabling testability with mock repositories
- Centralizing query logic

---

## Structure

```
┌─────────────────┐      uses      ┌─────────────────┐
│    Service      │ ─────────────► │   IRepository   │
└─────────────────┘                └─────────────────┘
                                          △
                                          │ implements
                    ┌─────────────────────┼─────────────────────┐
                    │                     │                     │
          ┌─────────┴────────┐  ┌─────────┴────────┐  ┌─────────┴────────┐
          │  MongoRepository │  │  SQLRepository   │  │  MockRepository  │
          └──────────────────┘  └──────────────────┘  └──────────────────┘
```

---

## Generic Repository Interface

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
}
```

---

## Using Repository in Service

```typescript
// src/services/Task.service.ts

import { TaskRepository } from '../repositories/Task.repository';
import { ITask, CreateTaskDTO, UpdateTaskDTO } from '../models/Task.model';

export class TaskService {
  private repository: TaskRepository;

  constructor() {
    this.repository = new TaskRepository();
  }

  async getAllTasks(): Promise<ITask[]> {
    return this.repository.findAll();
  }

  async getTaskById(id: string): Promise<ITask | null> {
    return this.repository.findById(id);
  }

  async createTask(data: CreateTaskDTO): Promise<ITask> {
    // Business logic can go here
    return this.repository.create(data);
  }

  async updateTask(id: string, data: UpdateTaskDTO): Promise<ITask | null> {
    return this.repository.update(id, data);
  }

  async deleteTask(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }
}
```

---

## Mock Repository for Testing

```typescript
// src/repositories/Mock.repository.ts

import { IRepository } from './IRepository';

export class MockTaskRepository implements IRepository<ITask> {
  private mockData: ITask[] = [
    { id: '1', title: 'Test Task', description: 'Test', status: 'todo', priority: 'medium', createdAt: new Date(), updatedAt: new Date() }
  ];

  async findAll(): Promise<ITask[]> {
    return this.mockData;
  }

  async findById(id: string): Promise<ITask | null> {
    return this.mockData.find(t => t.id === id) || null;
  }

  // ... other methods
}
```

---

## Pros and Cons

### ✅ Pros
- Decouples business logic from data access
- Easy to swap data sources
- Enables unit testing with mocks
- Centralizes data access logic

### ❌ Cons
- Additional abstraction layer
- Can be overkill for simple CRUD
- May lead to repository bloat

---

**Previous:** [MVC Pattern](06-mvc-pattern.md) | **Next:** [Observer Pattern](08-observer-pattern.md)
