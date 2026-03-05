# Challenge 3: MVC Pattern

> **Difficulty:** ⭐⭐ Medium  
> **Estimated Time:** 1 hour

---

## Node.js Project Setup

### Quick Start
```bash
mkdir mvc-challenge && cd mvc-challenge
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
│   └── Task.ts
├── controllers/
│   └── TaskController.ts
├── views/
│   └── TaskView.ts
└── index.ts
```

### Running Your Solution
```bash
npm start
```

---

## Objective

Build a complete Task CRUD API using the MVC (Model-View-Controller) pattern.

---

## Requirements

### Model
Create a Task model with fields:
- `id: string`
- `title: string`
- `description: string`
- `status: 'todo' | 'in-progress' | 'review' | 'completed'`
- `priority: 'low' | 'medium' | 'high' | 'urgent'`
- `createdAt: Date`
- `updatedAt: Date`

### Controller
Create a TaskController with methods:
- `getAll` - Get all tasks
- `getById` - Get task by ID
- `create` - Create new task
- `update` - Update existing task
- `delete` - Delete task
- `updateStatus` - Update task status only

### Routes
Create RESTful routes:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/:id` | Get task by ID |
| POST | `/api/tasks` | Create new task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| PATCH | `/api/tasks/:id/status` | Update status |

---

## File Structure

```
src/
├── models/
│   └── Task.model.ts
├── controllers/
│   └── Task.controller.ts
├── routes/
│   └── task.routes.ts
└── index.ts
```

---

## Acceptance Criteria

```bash
# Create task
POST /api/tasks
Body: { "title": "Learn MVC", "description": "Master the pattern" }
Response: { "success": true, "data": { "id": "...", "title": "Learn MVC", ... } }

# Get all tasks
GET /api/tasks
Response: { "success": true, "data": [...], "count": 1 }

# Update status
PATCH /api/tasks/:id/status
Body: { "status": "completed" }
Response: { "success": true, "data": { ... } }
```

---

## Hints

- Use Express.js for routing
- Create DTOs (Data Transfer Objects) for create/update
- Handle 404 cases properly
- Use try-catch with next() for error handling

---

## Bonus Challenge

- Add input validation
- Implement filtering by status/priority
- Add pagination support

---

**Solution:** [03-mvc-solution.md](../solutions/03-mvc-solution.md)
