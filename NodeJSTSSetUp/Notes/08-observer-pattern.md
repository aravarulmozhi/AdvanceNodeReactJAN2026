# Chapter 8: Observer Pattern

> **Category:** Behavioral Pattern

---

## What is Observer?

The Observer pattern defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified automatically.

---

## When to Use

- Event-driven architectures
- Notification systems
- Real-time updates
- Pub/Sub messaging
- UI state management

---

## Structure

```
┌─────────────────┐         notifies        ┌─────────────────┐
│     Subject     │ ──────────────────────► │    Observer     │
├─────────────────┤                         ├─────────────────┤
│ - observers[]   │                         │ + update(data)  │
│ + subscribe()   │                         └─────────────────┘
│ + unsubscribe() │                                 △
│ + notify()      │                                 │
└─────────────────┘                    ┌───────────┼───────────┐
                                       │           │           │
                                 ┌─────┴────┐ ┌────┴─────┐ ┌───┴──────┐
                                 │ Observer │ │ Observer │ │ Observer │
                                 │    A     │ │    B     │ │    C     │
                                 └──────────┘ └──────────┘ └──────────┘
```

---

## Base Implementation

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
  }

  unsubscribe(observer: IObserver): void {
    const index = this.observers.indexOf(observer);
    if (index === -1) {
      console.log('Observer not found');
      return;
    }
    this.observers.splice(index, 1);
  }

  protected notify(event: string, data: any): void {
    this.observers.forEach(observer => {
      observer.update(event, data);
    });
  }
}

export { IObserver, Subject };
```

---

## Task Subject Implementation

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

  getMetrics(): Map<string, number> {
    return new Map(this.metrics);
  }
}

// Sends webhook notifications
class WebhookObserver implements IObserver {
  constructor(private webhookUrl: string = 'https://api.example.com/webhook') {}

  update(event: string, data: any): void {
    console.log(`[WEBHOOK] Sending to ${this.webhookUrl}`);
    console.log(`[WEBHOOK] Payload: ${JSON.stringify({ event, data })}`);
    // In real app: axios.post(this.webhookUrl, { event, data });
  }
}

// Sends email alerts for specific events
class EmailAlertObserver implements IObserver {
  constructor(private adminEmail: string = 'admin@example.com') {}

  update(event: string, data: any): void {
    if (event === 'TASK_DELETED' || data.newStatus === 'completed') {
      console.log(`[EMAIL] Sending alert to ${this.adminEmail}`);
      console.log(`[EMAIL] Subject: Task ${event}`);
    }
  }
}

export { LogObserver, MetricsObserver, WebhookObserver, EmailAlertObserver };
```

---

## Usage Example

```typescript
import { TaskSubject } from './TaskSubject';
import { LogObserver, MetricsObserver, WebhookObserver } from './Observers';

// Create subject
const taskSubject = new TaskSubject();

// Create observers
const logger = new LogObserver();
const metrics = new MetricsObserver();
const webhook = new WebhookObserver('https://myapp.com/webhook');

// Subscribe observers
taskSubject.subscribe(logger);
taskSubject.subscribe(metrics);
taskSubject.subscribe(webhook);

// Trigger events - all observers will be notified
taskSubject.createTask('task-001', 'Learn Observer Pattern');
taskSubject.updateStatus('task-001', 'todo', 'in-progress');
taskSubject.updateStatus('task-001', 'in-progress', 'completed');

// Unsubscribe if needed
taskSubject.unsubscribe(webhook);
```

---

## Node.js EventEmitter (Built-in Observer)

```typescript
import { EventEmitter } from 'events';

class TaskEventEmitter extends EventEmitter {
  createTask(taskId: string, title: string): void {
    this.emit('taskCreated', { taskId, title });
  }

  updateStatus(taskId: string, status: string): void {
    this.emit('statusChanged', { taskId, status });
  }
}

// Usage
const taskEmitter = new TaskEventEmitter();

taskEmitter.on('taskCreated', (data) => {
  console.log('Task created:', data);
});

taskEmitter.on('statusChanged', (data) => {
  console.log('Status changed:', data);
});

taskEmitter.createTask('123', 'New Task');
```

---

## Pros and Cons

### ✅ Pros
- Loose coupling between subject and observers
- Supports broadcast communication
- Easy to add new observers
- Open/Closed principle

### ❌ Cons
- Observers notified in random order
- Memory leaks if observers not unsubscribed
- Can be complex to debug
- Unexpected updates possible

---

**Previous:** [Repository Pattern](07-repository-pattern.md) | **Next:** [Strategy Pattern](09-strategy-pattern.md)
