# Solution 5: Observer Pattern

---

## Node.js Project Setup

### Quick Start
```bash
mkdir observer-solution && cd observer-solution
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

### Run Solution
```bash
npm start
```

---

## Base Observer Interface and Subject

```typescript
// src/patterns/observer/Observer.ts

interface IObserver {
  update(event: string, data: any): void;
}

abstract class Subject {
  private observers: IObserver[] = [];

  subscribe(observer: IObserver): void {
    const exists = this.observers.includes(observer);
    if (exists) {
      console.log('Observer already subscribed');
      return;
    }
    this.observers.push(observer);
    console.log('Observer subscribed');
  }

  unsubscribe(observer: IObserver): void {
    const index = this.observers.indexOf(observer);
    if (index === -1) {
      console.log('Observer not found');
      return;
    }
    this.observers.splice(index, 1);
    console.log('Observer unsubscribed');
  }

  protected notify(event: string, data: any): void {
    console.log(`Notifying ${this.observers.length} observers...`);
    this.observers.forEach(observer => {
      observer.update(event, data);
    });
  }
}

export { IObserver, Subject };
```

---

## Task Subject

```typescript
// src/patterns/observer/TaskSubject.ts

import { Subject } from './Observer';

class TaskSubject extends Subject {
  updateStatus(taskId: string, oldStatus: string, newStatus: string): void {
    this.notify('STATUS_CHANGED', {
      taskId,
      oldStatus,
      newStatus,
      timestamp: new Date()
    });
  }

  createTask(taskId: string, title: string): void {
    this.notify('TASK_CREATED', {
      taskId,
      title,
      timestamp: new Date()
    });
  }

  deleteTask(taskId: string): void {
    this.notify('TASK_DELETED', {
      taskId,
      timestamp: new Date()
    });
  }

  assignTask(taskId: string, userId: string): void {
    this.notify('TASK_ASSIGNED', {
      taskId,
      userId,
      timestamp: new Date()
    });
  }
}

export { TaskSubject };
```

---

## Concrete Observers

```typescript
// src/patterns/observer/Observers.ts

import { IObserver } from './Observer';

// Logs all events to console
class LogObserver implements IObserver {
  update(event: string, data: any): void {
    console.log(`[LOG] Event: ${event}`);
    console.log(`[LOG] Data:`, JSON.stringify(data, null, 2));
    console.log('---');
  }
}

// Tracks event metrics
class MetricsObserver implements IObserver {
  private metrics: Map<string, number> = new Map();

  update(event: string, data: any): void {
    const count = this.metrics.get(event) || 0;
    this.metrics.set(event, count + 1);
    console.log(`[METRICS] ${event} count: ${count + 1}`);
  }

  getMetrics(): Record<string, number> {
    const result: Record<string, number> = {};
    this.metrics.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  reset(): void {
    this.metrics.clear();
  }
}

// Sends webhook notifications
class WebhookObserver implements IObserver {
  constructor(private webhookUrl: string) {}

  update(event: string, data: any): void {
    console.log(`[WEBHOOK] Sending to ${this.webhookUrl}`);
    console.log(`[WEBHOOK] Payload:`, JSON.stringify({ event, data }));
    // In real app:
    // await axios.post(this.webhookUrl, { event, data });
  }
}

// Sends email alerts for specific events
class EmailAlertObserver implements IObserver {
  constructor(private adminEmail: string = 'admin@example.com') {}

  update(event: string, data: any): void {
    // Only send emails for important events
    const importantEvents = ['TASK_DELETED', 'STATUS_CHANGED'];
    
    if (importantEvents.includes(event)) {
      if (event === 'STATUS_CHANGED' && data.newStatus === 'completed') {
        console.log(`[EMAIL] Sending to ${this.adminEmail}`);
        console.log(`[EMAIL] Subject: Task ${data.taskId} completed!`);
      } else if (event === 'TASK_DELETED') {
        console.log(`[EMAIL] Sending to ${this.adminEmail}`);
        console.log(`[EMAIL] Subject: Task ${data.taskId} was deleted`);
      }
    }
  }
}

// Stores events for audit
class AuditObserver implements IObserver {
  private auditLog: Array<{ event: string; data: any; timestamp: Date }> = [];

  update(event: string, data: any): void {
    this.auditLog.push({
      event,
      data,
      timestamp: new Date()
    });
    console.log(`[AUDIT] Event logged. Total entries: ${this.auditLog.length}`);
  }

  getAuditLog() {
    return [...this.auditLog];
  }
}

export { 
  LogObserver, 
  MetricsObserver, 
  WebhookObserver, 
  EmailAlertObserver,
  AuditObserver 
};
```

---

## Usage Example

```typescript
// test-observer.ts

import { TaskSubject } from './patterns/observer/TaskSubject';
import { 
  LogObserver, 
  MetricsObserver, 
  WebhookObserver,
  EmailAlertObserver
} from './patterns/observer/Observers';

// Create subject
const taskSubject = new TaskSubject();

// Create observers
const logger = new LogObserver();
const metrics = new MetricsObserver();
const webhook = new WebhookObserver('https://api.myapp.com/webhook');
const emailAlert = new EmailAlertObserver('admin@company.com');

// Subscribe observers
console.log('=== Subscribing Observers ===');
taskSubject.subscribe(logger);
taskSubject.subscribe(metrics);
taskSubject.subscribe(webhook);
taskSubject.subscribe(emailAlert);

// Trigger events
console.log('\n=== Creating Task ===');
taskSubject.createTask('task-001', 'Learn Observer Pattern');

console.log('\n=== Updating Status ===');
taskSubject.updateStatus('task-001', 'todo', 'in-progress');

console.log('\n=== Completing Task ===');
taskSubject.updateStatus('task-001', 'in-progress', 'completed');

console.log('\n=== Deleting Task ===');
taskSubject.deleteTask('task-001');

// Check metrics
console.log('\n=== Metrics Summary ===');
console.log(metrics.getMetrics());

// Unsubscribe webhook
console.log('\n=== Unsubscribing Webhook ===');
taskSubject.unsubscribe(webhook);

// This won't notify webhook
console.log('\n=== Creating Another Task ===');
taskSubject.createTask('task-002', 'Another Task');
```

---

## Output

```
=== Subscribing Observers ===
Observer subscribed
Observer subscribed
Observer subscribed
Observer subscribed

=== Creating Task ===
Notifying 4 observers...
[LOG] Event: TASK_CREATED
[LOG] Data: { taskId: 'task-001', title: 'Learn Observer Pattern', ... }
[METRICS] TASK_CREATED count: 1
[WEBHOOK] Sending to https://api.myapp.com/webhook
[WEBHOOK] Payload: { event: 'TASK_CREATED', ... }

=== Completing Task ===
Notifying 4 observers...
[LOG] Event: STATUS_CHANGED
[METRICS] STATUS_CHANGED count: 2
[WEBHOOK] Sending to ...
[EMAIL] Sending to admin@company.com
[EMAIL] Subject: Task task-001 completed!

=== Metrics Summary ===
{ TASK_CREATED: 1, STATUS_CHANGED: 2, TASK_DELETED: 1 }
```

---

## Key Points

1. **Loose coupling** - Subject doesn't know observer types
2. **Easy to extend** - Add new observers without modifying subject
3. **Event-driven** - Natural for async architectures
4. **Memory management** - Remember to unsubscribe when needed

---

**Challenge:** [05-observer-challenge.md](../challenge/05-observer-challenge.md)
