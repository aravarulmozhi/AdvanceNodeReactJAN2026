# Chapter 6: MVC Pattern (Model-View-Controller)

> **Category:** Architectural Pattern

---

## What is MVC?

MVC separates an application into three interconnected components:
- **Model** - Data and business logic
- **View** - User interface (responses/templates)
- **Controller** - Handles input and coordinates Model/View

---

## When to Use

- Web applications
- REST APIs
- Applications requiring separation of concerns
- Projects with multiple developers working on different layers

---

## Structure

```
┌─────────────────────────────────────────────────────────┐
│                        CLIENT                            │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                      CONTROLLER                          │
│            Receives requests, coordinates flow           │
└─────────────────────────────────────────────────────────┘
                    │                 │
                    ▼                 ▼
┌──────────────────────┐    ┌──────────────────────┐
│        MODEL         │    │         VIEW         │
│   Data & Business    │    │   Response Format    │
│       Logic          │    │                      │
└──────────────────────┘    └──────────────────────┘
```

---

## Folder Structure

```
src/
├── models/
│   └── User.model.ts
├── views/
│   └── (response formatters)
├── controllers/
│   └── User.controller.ts
├── routes/
│   └── user.routes.ts
├── services/
│   └── User.service.ts
└── index.ts
```

---

## Model Implementation

```typescript
// src/models/Task.model.ts

export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface ITask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskDTO {
  title: string;
  description: string;
  priority?: TaskPriority;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}
```

---

## Controller Implementation

```typescript
// src/controllers/Task.controller.ts

import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/Task.service';
import { CreateTaskDTO, UpdateTaskDTO } from '../models/Task.model';

const taskService = new TaskService();

export class TaskController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tasks = await taskService.getAllTasks();
      res.json({ success: true, data: tasks, count: tasks.length });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const task = await taskService.getTaskById(req.params.id);
      if (!task) {
        res.status(404).json({ success: false, message: 'Task not found' });
        return;
      }
      res.json({ success: true, data: task });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const taskData: CreateTaskDTO = req.body;
      const task = await taskService.createTask(taskData);
      res.status(201).json({ success: true, data: task });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updateData: UpdateTaskDTO = req.body;
      const task = await taskService.updateTask(req.params.id, updateData);
      if (!task) {
        res.status(404).json({ success: false, message: 'Task not found' });
        return;
      }
      res.json({ success: true, data: task });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const deleted = await taskService.deleteTask(req.params.id);
      if (!deleted) {
        res.status(404).json({ success: false, message: 'Task not found' });
        return;
      }
      res.json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
```

---

## Routes Implementation

```typescript
// src/routes/task.routes.ts

import { Router } from 'express';
import { TaskController } from '../controllers/Task.controller';

const router = Router();

router.get('/', TaskController.getAll);
router.get('/:id', TaskController.getById);
router.post('/', TaskController.create);
router.put('/:id', TaskController.update);
router.delete('/:id', TaskController.delete);
router.patch('/:id/status', TaskController.updateStatus);

export default router;
```

---

## RESTful Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/:id` | Get task by ID |
| POST | `/api/tasks` | Create new task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| PATCH | `/api/tasks/:id/status` | Update task status |

---

## Pros and Cons

### ✅ Pros
- Clear separation of concerns
- Easier to test individual components
- Multiple developers can work in parallel
- Supports multiple views for same data

### ❌ Cons
- Can be overkill for simple applications
- Requires more files/boilerplate
- Learning curve for beginners

---

**Previous:** [Factory Pattern](05-factory-pattern.md) | **Next:** [Repository Pattern](07-repository-pattern.md)
