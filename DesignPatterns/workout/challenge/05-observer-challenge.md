# Challenge 5: Observer Pattern

> **Difficulty:** ⭐⭐⭐ Hard  
> **Estimated Time:** 1 hour

---

## Node.js Project Setup

### Quick Start
```bash
mkdir observer-challenge && cd observer-challenge
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
├── patterns/
│   └── observer/
│       ├── EventEmitter.ts
│       └── TaskManager.ts
└── index.ts
```

### Running Your Solution
```bash
npm start
```

---

## Objective

Implement a task notification system using the Observer pattern.

---

## Requirements

1. Create base `Subject` class with methods:
   - `subscribe(observer): void`
   - `unsubscribe(observer): void`
   - `notify(event, data): void`

2. Create `TaskSubject` that extends Subject with methods:
   - `updateStatus(taskId, oldStatus, newStatus)`
   - `createTask(taskId, title)`
   - `deleteTask(taskId)`

3. Create multiple observers:
   - `LogObserver` - Logs all events to console
   - `MetricsObserver` - Tracks event counts
   - `WebhookObserver` - Simulates webhook calls
   - `EmailAlertObserver` - Sends alerts for specific events

---

## File Structure

```
src/
└── patterns/
    └── observer/
        ├── Observer.ts
        ├── TaskSubject.ts
        └── Observers.ts
```

---

## Acceptance Criteria

```typescript
const taskSubject = new TaskSubject();

// Subscribe observers
taskSubject.subscribe(new LogObserver());
taskSubject.subscribe(new MetricsObserver());
taskSubject.subscribe(new WebhookObserver('https://api.example.com/hook'));

// Trigger events
taskSubject.createTask('task-123', 'Learn Observer');
// [LOG] Event: TASK_CREATED
// [METRICS] TASK_CREATED count: 1
// [WEBHOOK] Sending to https://api.example.com/hook

taskSubject.updateStatus('task-123', 'todo', 'completed');
// All observers notified with STATUS_CHANGED event

// Unsubscribe
taskSubject.unsubscribe(webhookObserver);
```

---

## Observer Interface

```typescript
interface IObserver {
  update(event: string, data: any): void;
}
```

---

## Hints

- Don't allow duplicate subscriptions
- Handle unsubscribe gracefully if observer not found
- Include timestamp in notification data
- MetricsObserver should store counts in a Map

---

## Bonus Challenge

- Add event filtering (observers only receive certain events)
- Implement async notification
- Add priority to observers (order of notification)

---

**Solution:** [05-observer-solution.md](../solutions/05-observer-solution.md)
