# Solution 3: MVC Pattern

---

## Model

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

## Service (Business Logic)

```typescript
// src/services/Task.service.ts

import { v4 as uuid } from 'uuid';
import { ITask, CreateTaskDTO, UpdateTaskDTO, TaskStatus } from '../models/Task.model';

export class TaskService {
  private tasks: ITask[] = [];

  async getAllTasks(): Promise<ITask[]> {
    return [...this.tasks];
  }

  async getTaskById(id: string): Promise<ITask | null> {
    return this.tasks.find(t => t.id === id) || null;
  }

  async createTask(data: CreateTaskDTO): Promise<ITask> {
    const task: ITask = {
      id: uuid(),
      title: data.title,
      description: data.description,
      status: 'todo',
      priority: data.priority || 'medium',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.tasks.push(task);
    return task;
  }

  async updateTask(id: string, data: UpdateTaskDTO): Promise<ITask | null> {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) return null;

    this.tasks[index] = {
      ...this.tasks[index],
      ...data,
      updatedAt: new Date()
    };
    return this.tasks[index];
  }

  async deleteTask(id: string): Promise<boolean> {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) return false;
    this.tasks.splice(index, 1);
    return true;
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<ITask | null> {
    return this.updateTask(id, { status });
  }
}
```

---

## Controller

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

  static async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status } = req.body;
      const task = await taskService.updateTaskStatus(req.params.id, status);
      if (!task) {
        res.status(404).json({ success: false, message: 'Task not found' });
        return;
      }
      res.json({ success: true, data: task });
    } catch (error) {
      next(error);
    }
  }
}
```

---

## Routes

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

## Entry Point

```typescript
// src/index.ts

import express, { Application } from 'express';
import taskRoutes from './routes/task.routes';

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/tasks', taskRoutes);

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

---

## Testing with cURL

```bash
# Create task
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn MVC", "description": "Master the pattern", "priority": "high"}'

# Get all tasks
curl http://localhost:3000/api/tasks

# Update status
curl -X PATCH http://localhost:3000/api/tasks/{id}/status \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```

---

**Challenge:** [03-mvc-challenge.md](../challenge/03-mvc-challenge.md)
